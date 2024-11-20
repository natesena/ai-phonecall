import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log("No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = searchParams.get("phoneNumber");

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Ensure we're getting an array of calls
    const calls = await prisma.call.findMany({
      where: {
        customerPhone: phoneNumber,
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        callId: true,
        status: true,
        startedAt: true,
        endedAt: true,
        durationSeconds: true,
        cost: true,
      },
    });

    // Ensure we always return an array, even if empty
    return NextResponse.json({
      calls: Array.isArray(calls) ? calls : [],
    });
  } catch (error) {
    console.error("API Error:", {
      error,
      path: "/api/vapi/calls",
      phoneNumber: request.nextUrl.searchParams.get("phoneNumber"),
    });

    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
