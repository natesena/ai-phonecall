import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { handleSubscriptionEvent } from "./handleSubscriptionEvent";
import { handleInvoiceEvent } from "./handleInvoiceEvent";
import { handleCheckoutSessionCompleted } from "./handleCheckoutSessionCompleted";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const reqText = await req.text();
  return webhooksHandler(reqText, req);
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest
): Promise<NextResponse> {
  const sig = request.headers.get("Stripe-Signature");

  try {
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Event type:", event.type);

    switch (event.type) {
      case "customer.subscription.created":
        return handleSubscriptionEvent(event, "created", stripe);
      case "customer.subscription.updated":
        return handleSubscriptionEvent(event, "updated", stripe);
      case "customer.subscription.deleted":
        return handleSubscriptionEvent(event, "deleted", stripe);
      case "invoice.payment_succeeded":
        return handleInvoiceEvent(event, "succeeded", stripe);
      case "invoice.payment_failed":
        return handleInvoiceEvent(event, "failed", stripe);
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(event, stripe);
      default:
        return NextResponse.json({
          status: 400,
          error: "Unhandled event type",
        });
    }
  } catch (err) {
    console.error("Error constructing Stripe event:", err);
    return NextResponse.json({
      status: 500,
      error: "Webhook Error: Invalid Signature",
    });
  }
}
