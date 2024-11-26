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
        // {
        //   "messageResponse": {
        //     "error": "error"
        //   }
        // }
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
        // Check if the user has credits
        const users = await fetchUserByPhoneNumber(customerPhone);
        let user;
        if (users.length === 0) {
          console.error(`No user found for phone number ${customerPhone}`);
          return;
        } else {
          user = users[0];
        }

        const userCredits = await prisma.user_credits.findFirst({
          where: {
            user_id: user.id,
          },
        });
        console.log(`User credits: ${JSON.stringify(userCredits)}`);

        if (!userCredits || userCredits.amount < 1) {
          console.log(
            `User ${user.id} has no credits or has 0 credits. Ending call.`
          );
          throw new Error("INSUFFICIENT_CREDITS");
        }
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message === "INSUFFICIENT_CREDITS"
        ) {
          return {
            messageResponse: {
              error:
                "Ho Ho Ho, Who gave you my number? Visit callsanta.shop to buy credits to talk to me",
            },
          };
        }
        console.error("Failed to create call record:", error);
      }
      break;

    case "ended":
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

      if (durationSeconds && durationSeconds >= CREDIT_THRESHOLD_SECONDS) {
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
      } else {
        await prisma.call.update({
          where: {
            callId: webhookData.body.message.call.id,
          },
          data: {
            durationSeconds: durationSeconds,
          },
        });
      }
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

    let response;
    switch (webhookData.body.message.type) {
      case "status-update":
        console.log("Status update webhook received");
        response = await handleStatusUpdate(webhookData);
        break;

      case "end-of-call-report":
        console.log("End of call report webhook received");
        await handleEndOfCallReport(webhookData);
        break;

      default:
        console.log(`Unhandled webhook type: ${webhookData.body.message.type}`);
    }

    if (response) {
      return NextResponse.json(response, { status: 200 });
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
