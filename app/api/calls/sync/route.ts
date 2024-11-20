import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// WARNING: This route is for development/testing purposes only.
// For production, consider using a proper job queue system like Bull

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const calls = Array.isArray(vapiData) ? vapiData : [];
    const results = [];

    // Sequential processing
    for (const call of calls) {
      try {
        if (!call.id) continue;
        const durationSeconds = Math.round(
          (new Date(call.endedAt).getTime() -
            new Date(call.startedAt).getTime()) /
            1000
        );
        const result = await prisma.call.upsert({
          where: { callId: call.id },
          update: {
            status: call.status,
            startedAt: new Date(call.startedAt),
            endedAt: new Date(call.endedAt),
            durationSeconds,
            customerPhone: call.customer?.number || "unknown",
            assistantId: call.assistantId,
            endedReason: call.endedReason,
            cost: call.cost,
            userId: userId,
          },
          create: {
            callId: call.id,
            status: call.status,
            startedAt: new Date(call.startedAt),
            endedAt: new Date(call.endedAt),
            durationSeconds,
            customerPhone: call.customer?.number || "unknown",
            assistantId: call.assistantId,
            endedReason: call.endedReason,
            cost: call.cost,
            userId: userId,
          },
        });

        results.push(result);
        console.log(`Synced call ${call.id}`);
      } catch (error) {
        console.error("Error syncing call:", {
          callId: call.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      message: `Synced ${results.length} calls`,
      totalCalls: calls.length,
      successfulSyncs: results.length,
    });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json(
      { error: "Failed to sync calls" },
      { status: 500 }
    );
  }
}
