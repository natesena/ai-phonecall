import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log("No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch calls from VAPI
    const response = await fetch("https://api.vapi.ai/call", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`VAPI responded with status: ${response.status}`);
    }

    const vapiData = await response.json();

    // Ensure we always return an array, even if empty
    return NextResponse.json({
      calls: Array.isArray(vapiData) ? vapiData : [],
    });
  } catch (error) {
    console.error("VAPI API Error:", {
      error,
      path: "/api/vapi/calls",
    });

    return NextResponse.json(
      { error: "Failed to fetch calls from VAPI" },
      { status: 500 }
    );
  }
}
