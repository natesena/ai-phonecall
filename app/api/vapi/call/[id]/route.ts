import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const callId = (await params).id;
    if (!callId) {
      return NextResponse.json(
        { error: "Call ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching call:", callId); // Debug log

    // Fetch call from VAPI
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("VAPI Error:", errorText);
      throw new Error(`VAPI responded with status: ${response.status}`);
    }

    const call = await response.json();
    return NextResponse.json(call);
  } catch (error) {
    console.error("VAPI API Error:", {
      error,
      path: `/api/vapi/call/${(await params).id}`,
    });

    return NextResponse.json(
      { error: "Failed to fetch single call from VAPI" },
      { status: 500 }
    );
  }
}
