import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { userId, email, priceId, subscription } = await req.json();

    // Get or create customer
    let customerId;
    try {
      const customers = await stripe.customers.list({ email: email, limit: 1 });
      customerId = customers.data[0]?.id;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: email,
          metadata: { userId },
        });
        customerId = customer.id;
      }
    } catch (error) {
      console.error("Error handling customer:", error);
      return NextResponse.json({ error: "Failed to handle customer" });
    }

    if (subscription) {
      try {
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          metadata: { userId, email, subscription },
          mode: "subscription",
          success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/cancel`,
          allow_promotion_codes: true,
        });

        return NextResponse.json({ sessionId: session.id });
      } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json({
          error: "Failed to create checkout session",
        });
      }
    } else {
      console.log("Creating checkout session for one-time payment");
      try {
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          line_items: [{ price: priceId, quantity: 1 }],
          metadata: { userId, email, subscription },
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        return NextResponse.json({ sessionId: session.id });
      } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json({
          error: "Failed to create checkout session",
        });
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" });
  }
}
