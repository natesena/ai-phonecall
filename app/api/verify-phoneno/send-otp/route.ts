
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
    // Send OTP
    const twillioResponse = await client.verify.v2
      .services(serviceId)
      .verifications.create({
        to: `${user.phone}`,
        channel: "sms",
      });

    if (twillioResponse.status === "pending") {
      return NextResponse.json({ sent: true }, { status: 200 });
    } else {
      return NextResponse.json({ sent: false }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}