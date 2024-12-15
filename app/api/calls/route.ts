import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log("No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { phoneNumber } = await request.json();

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
        startedAt: "desc",
      },
      select: {
        id: true,
        callId: true,
        status: true,
        startedAt: true,
        endedAt: true,
        durationSeconds: true,
        cost: true,
        customerPhone: true,
      },
    });

    // Ensure we always return an array, even if empty
    return NextResponse.json({
      calls: Array.isArray(calls) ? calls : [],
    });
  } catch (error) {
    console.error("API Error:", {
      error,
      path: "/api/calls/",
      phoneNumber: request.body,
    });

    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
