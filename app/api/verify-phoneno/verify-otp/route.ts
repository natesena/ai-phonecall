import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { supabase } from "@/utils/supabase";
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

    const { data, error } = await supabase.from("user").select()
    .eq("id", session.id)
    if (error) {
        return;
    }
    const user = data[0];
    console.log({user})
    const { searchParams } = new URL(request.url);
    const otp = searchParams.get("otp") as string;

    // Verify OTP
    const twillioResponse = await client.verify.v2
      .services(serviceId)
      .verificationChecks.create({
        to: `${user.phone}`,
        code: otp,
      });

    if (twillioResponse.status === "approved") {
        const { data, error } = await supabase.from("user").update({ isPhoneVerified: true }).eq("id", user.id).select();
        console.log({data, error})
      return NextResponse.json({ verified: true }, { status: 200 });
    } else {
      return NextResponse.json({ verified: false }, { status: 500 });
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
