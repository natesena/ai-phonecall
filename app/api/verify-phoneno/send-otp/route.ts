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

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", session.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    if (!userData.phone_number) {
      return NextResponse.json(
        { message: "Phone number not found" },
        { status: 400 }
      );
    }

    // Send OTP via Twilio
    try {
        const twillioResponse = await client.verify.v2
      .services(serviceId)
      .verifications.create({
        to: `${userData.phone_number}`,
        channel: "sms",
      });

    if (twillioResponse.status === "pending") {
      return NextResponse.json({ sent: true }, { status: 200 });
    } else {
      return NextResponse.json({ sent: false }, { status: 500 });
    }
    } catch (twilioError: any) {
      console.error("Twilio Error:", twilioError);
      return NextResponse.json(
        { message: twilioError.message || "Failed to send OTP" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}