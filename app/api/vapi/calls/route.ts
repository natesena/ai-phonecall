import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = searchParams.get("phoneNumber");

    console.log("Phone number param in calls", phoneNumber);
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Fetch all calls directly from Vapi
    const response = await fetch(`https://api.vapi.ai/call`, {
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      },
    });

    const allCalls = await response.json();

    // Filter calls to only include those from the user's phone number
    const filteredCalls = allCalls.filter((call) =>
      phoneNumber.includes(call.customer?.number)
    );

    console.log("Filtered calls for", phoneNumber, filteredCalls);
    return NextResponse.json(filteredCalls);
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
