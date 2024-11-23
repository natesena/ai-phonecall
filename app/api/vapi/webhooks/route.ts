import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

interface WebhookData {
  headers: Record<string, string>;
  body: {
    timestamp: number;
    message: {
      type: string;
      status?: string;
      durationSeconds?: number;
      customer: {
        number: string;
      };
      call: {
        id: string;
      };
      assistant?: {
        id: string;
      };
      user?: {
        id: string; // This should be your Clerk user ID
      };
    };
  };
}

async function handleStatusUpdate(webhookData: WebhookData) {
  const status = webhookData.body.message.status;
  const customerPhone = webhookData.body.message.customer?.number;
  const callId = webhookData.body.message.call?.id;
  const assistantId = webhookData.body.message.assistant?.id;
  const userId = webhookData.body.message.user?.id;

  switch (status) {
    case "in-progress":
      try {
        await prisma.call.create({
          data: {
            callId: callId,
            userId: userId,
            customerPhone: customerPhone,
            assistantId: assistantId || "default",
            status: "in-progress",
            startedAt: new Date(),
          },
        });
        console.log(`Call record created for ${callId}`);
      } catch (error) {
        console.error("Failed to create call record:", error);
      }
      break;

    case "ended":
      console.log(
        "Call ended webhook data:",
        JSON.stringify(webhookData, null, 2)
      );
      try {
        await prisma.call.update({
          where: { callId: callId },
          data: {
            status: "ended",
            endedAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Failed to update call record:", error);
      }
      break;
  }
}

async function fetchUserByPhoneNumber(phoneNumber: string) {
  try {
    const response = await fetch(
      `${process.env.FRONTEND_URL}/api/numbers/clerk/user-id-from-phone-number`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Error fetching user by phone number:", error);
    return null;
  }
}

async function handleEndOfCallReport(webhookData: WebhookData) {
  const { durationSeconds } = webhookData.body.message;
  const { number } = webhookData.body.message.customer;
  const CREDIT_THRESHOLD_SECONDS = 30;

  if (number) {
    try {
      const users = await fetchUserByPhoneNumber(number);
      let user;
      if (users.length === 0) {
        console.error(`No user found for phone number ${number}`);
        return;
      } else {
        user = users[0];
      }
      // Find the user's credits
      const userCredits = await prisma.user_credits.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (!userCredits || userCredits.amount < 1) {
        console.error(`No credits available for user ${user.id}`);
        return;
      }

      // Update credits by removing 1
      await prisma.user_credits.update({
        where: {
          id: userCredits.id,
        },
        data: {
          amount: userCredits.amount - 1,
        },
      });

      // Update call record with duration and cost
      await prisma.call.update({
        where: {
          callId: webhookData.body.message.call.id,
        },
        data: {
          durationSeconds: durationSeconds,
          cost: 1, // Assuming 1 credit = 1 cost unit
        },
      });

      console.log(
        `Debited 1 credit from user ${user.id} for call lasting ${durationSeconds} seconds`
      );
    } catch (error) {
      console.error("Failed to process credits:", error);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const webhookData: WebhookData = {
      headers: Object.fromEntries(request.headers),
      body: body,
    };

    switch (webhookData.body.message.type) {
      case "status-update":
        console.log("Status update webhook received");
        await handleStatusUpdate(webhookData);
        break;

      case "end-of-call-report":
        console.log("End of call report webhook received");
        await handleEndOfCallReport(webhookData);
        break;

      default:
        console.log(`Unhandled webhook type: ${webhookData.body.message.type}`);
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
