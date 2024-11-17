import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phoneNumbers = searchParams.get("phoneNumber");

    console.log("Phone number param in numid", phoneNumbers);
    if (!phoneNumbers) {
      return NextResponse.json(
        { error: "Phone numbers are required" },
        { status: 400 }
      );
    }

    const phoneNumbersArray = phoneNumbers.split(",");
    console.log("Fetching calls for phone numbers:", phoneNumbersArray);

    // Fetch all calls
    const response = await fetch(`https://api.vapi.ai/call`, {
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      },
    });

    const allCalls: Record<string, any>[] = await response.json();

    // Filter calls to only include those from the user's phone number
    const filteredCalls = (allCalls as Record<string, any>[]).filter(
      (call: Record<string, any>) =>
        phoneNumbersArray.includes(call.customer?.number)
    );
    const filteredPhoneNumber = filteredCalls[0].customer.number;
    const filteredPhoneNumberId = filteredCalls[0].phoneNumberId;

    return NextResponse.json({
      phoneNumber: filteredPhoneNumber,
      phoneNumberId: filteredPhoneNumberId,
    });
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
