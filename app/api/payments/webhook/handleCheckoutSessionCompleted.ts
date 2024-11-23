import Stripe from "stripe";
import { NextResponse } from "next/server";
import { updateUserCredits } from "./updateCredit";
import { PRICE_TO_CREDITS } from "@/app/config/stripe";
import prisma from "@/lib/prisma";

export async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
  stripe: Stripe
) {
  const session = await stripe.checkout.sessions.retrieve(
    (event.data.object as Stripe.Checkout.Session).id,
    {
      expand: ["line_items.data.price.product"],
    }
  );

  const metadata: any = session?.metadata;

  // Add stripe_customer_id to user at the start, regardless of payment type
  if (session.customer && metadata?.userId) {
    try {
      await prisma.user.update({
        where: { user_id: metadata.userId },
        data: { stripe_customer_id: session.customer as string },
      });
    } catch (error) {
      console.error("Error updating stripe_customer_id:", error);
      // Continue with the rest of the logic even if this update fails
    }
  }

  if (metadata?.subscription === "true") {
    // This is for subscription payments
    const subscriptionId = session.subscription;
    try {
      await stripe.subscriptions.update(subscriptionId as string, { metadata });

      // Update user subscription
      // (removed)

      return NextResponse.json({
        status: 200,
        message: "Subscription metadata updated successfully",
      });
    } catch (error) {
      console.error("Error updating subscription metadata:", error);
      return NextResponse.json({
        status: 500,
        error: "Error updating subscription metadata",
      });
    }
  } else {
    // One-time payment logic
    const dateTime = new Date(session.created * 1000).toISOString();
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: metadata?.userId },
      });

      if (!user) throw new Error("User not found");

      const paymentData = {
        user_id: metadata?.userId,
        stripe_id: session.id,
        email: metadata?.email,
        amount: (session.amount_total! / 100).toString(), // Convert to string as per schema
        customer_details: JSON.stringify(session.customer_details),
        payment_intent: session.payment_intent as string,
        payment_time: dateTime,
        payment_date: new Date(session.created * 1000)
          .toISOString()
          .split("T")[0],
        currency: session.currency || "",
      };

      await prisma.payments.create({
        data: paymentData,
      });
      console.log("Payment created");

      const priceId = session.line_items?.data[0]?.price?.id;
      const stripeProductId = (
        session.line_items?.data[0]?.price?.product as Stripe.Product
      )?.id;
      const productName = (
        session.line_items?.data[0]?.price?.product as Stripe.Product
      )?.name;

      if (!priceId || !stripeProductId || !productName) {
        console.error("Missing product details in session:", session);
        throw new Error("Missing product details in session");
      }
      console.log("About to try credits upsert");
      try {
        await prisma.user_credits.upsert({
          where: {
            user_id_stripe_product_id: {
              user_id: metadata?.userId,
              stripe_product_id: stripeProductId,
            },
          },
          update: {
            amount: {
              increment: PRICE_TO_CREDITS[priceId] || 0,
            },
          },
          create: {
            user_id: metadata?.userId,
            stripe_product_id: stripeProductId,
            product_name: productName,
            amount: PRICE_TO_CREDITS[priceId] || 0,
          },
        });
      } catch (error) {
        console.error("Error in handleCheckoutSessionCompleted:", error);
        return NextResponse.json({
          status: 500,
          error: "Error processing checkout session",
        });
      }
    } catch (error) {
      console.error("Error in handleCheckoutSessionCompleted:", error);
      return NextResponse.json({
        status: 500,
        error: "Error processing Checkout Payment",
      });
    }
  }

  return NextResponse.json({
    status: 200,
    message: "Payment processed successfully",
  });
}
