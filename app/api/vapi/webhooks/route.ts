import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

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
    };
  };
}

async function handleStatusUpdate(webhookData: WebhookData) {
  const status = webhookData.body.message.status;
  const customerPhone = webhookData.body.message.customer?.number;

  switch (status) {
    case "in-progress":
      // TODO: Attach metadata (like Clerk user ID) to the call
      // TODO: Create initial call record in database
      console.log(`Call started for customer ${customerPhone}`);
      break;

    case "ended":
      // TODO: Update call record in database with end status
      console.log(`Call ended for customer ${customerPhone}`);
      break;
  }
}

async function handleEndOfCallReport(webhookData: WebhookData) {
  const { durationSeconds, customer } = webhookData.body.message;

  // TODO: Define your threshold for crediting calls (e.g. 30 seconds)
  const CREDIT_THRESHOLD_SECONDS = 30;

  if (durationSeconds && durationSeconds > CREDIT_THRESHOLD_SECONDS) {
    // TODO: Debit user credit
    console.log(`Debiting credit for call lasting ${durationSeconds} seconds`);
  }

  // TODO: Send email to user with call summary
  console.log(`Sending call summary email to customer ${customer?.number}`);
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
