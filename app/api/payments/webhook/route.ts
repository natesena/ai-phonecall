import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { handleSubscriptionEvent } from "./handleSubscriptionEvent";
import { handleInvoiceEvent } from "./handleInvoiceEvent";
import { handleCheckoutSessionCompleted } from "./handleCheckoutSessionCompleted";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// At the top of your file, define the credit mapping
const PRICE_TO_CREDITS: Record<string, number> = {
  price_1QHVBkFMpb9ac8oli1eIxXb1: 1, // Replace with your actual Stripe price IDs
};

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  const supabase: any = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const reqText = await req.text();
  return webhooksHandler(reqText, req, supabase);
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest,
  supabase: ReturnType<typeof createServerClient>
): Promise<NextResponse> {
  const sig = request.headers.get("Stripe-Signature");

  try {
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "customer.subscription.created":
        return handleSubscriptionEvent(event, "created", supabase, stripe);
      case "customer.subscription.updated":
        return handleSubscriptionEvent(event, "updated", supabase, stripe);
      case "customer.subscription.deleted":
        return handleSubscriptionEvent(event, "deleted", supabase, stripe);
      case "invoice.payment_succeeded":
        return handleInvoiceEvent(event, "succeeded", supabase, stripe);
      case "invoice.payment_failed":
        return handleInvoiceEvent(event, "failed", supabase, stripe);
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(event, supabase, stripe);
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
