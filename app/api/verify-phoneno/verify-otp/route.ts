import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { createServerClient } from "@supabase/ssr";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID!;

const client = twilio(accountSid, authToken);

export async function GET(request: NextRequest) {
  try {
    const getSession = async (req: NextRequest) => {
      const session = await getToken({ req });
      return session;
    };

    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        cookies: {}
      }
    );

    const { data, error } = await supabase
      .from("user")
      .select()
      .eq("user_id", session.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const user = data[0];
    const { searchParams } = new URL(request.url);
    const otp = searchParams.get("otp") as string;

    // Verify OTP
    const twillioResponse = await client.verify.v2
      .services(serviceId)
      .verificationChecks.create({
        to: `${user.phone_number}`,
        code: otp,
      });

    if (twillioResponse.status === "approved") {
      const { error: updateError } = await supabase
        .from("user")
        .update({ is_phone_verified: true })
        .eq("id", user.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      return NextResponse.json({ verified: true }, { status: 200 });
    } else {
      return NextResponse.json({ verified: false }, { status: 400 });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
