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

    // Send verification code
    const verification = await client.verify.v2
      .services(serviceId)
      .verifications.create({
        to: user.phone_number,
        channel: "sms",
      });

    if (verification.status === "pending") {
      return NextResponse.json({ sent: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to send verification code" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}