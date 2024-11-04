import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { updateUserCredits } from "./updateCredit";
import { PRICE_TO_CREDITS } from "@/app/config/stripe";

export async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
  supabase: ReturnType<typeof createServerClient>,
  stripe: Stripe
) {
  const session = await stripe.checkout.sessions.retrieve(
    (event.data.object as Stripe.Checkout.Session).id,
    {
      expand: ["line_items.data.price.product"],
    }
  );

  const metadata: any = session?.metadata;

  if (metadata?.subscription === "true") {
    // This is for subscription payments
    const subscriptionId = session.subscription;
    try {
      await stripe.subscriptions.update(subscriptionId as string, { metadata });

      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ user_id: metadata?.userId })
        .eq("email", metadata?.email);
      if (invoiceError) throw new Error("Error updating invoice");

      const { error: userError } = await supabase
        .from("user")
        .update({ subscription: session.id })
        .eq("user_id", metadata?.userId);
      if (userError) throw new Error("Error updating user subscription");

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
      const { data: user, error: userError } = await supabase
        .from("user")
        .select("*")
        .eq("user_id", metadata?.userId);
      if (userError) throw new Error("Error fetching user");

      const paymentData = {
        user_id: metadata?.userId,
        stripe_id: session.id,
        email: metadata?.email,
        amount: session.amount_total! / 100,
        customer_details: JSON.stringify(session.customer_details),
        payment_intent: session.payment_intent,
        payment_time: dateTime,
        payment_date: new Date(session.created * 1000)
          .toISOString()
          .split("T")[0],
        currency: session.currency,
      };

      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .insert([paymentData]);

      if (paymentsError) {
        console.error("Payment insertion error details:", {
          error: paymentsError,
          errorMessage: paymentsError.message,
          errorDetails: paymentsError.details,
          paymentData,
        });
        throw new Error(`Error inserting payment: ${paymentsError.message}`);
      }

      const priceId = session.line_items?.data[0]?.price?.id;
      const stripeProductId = session.line_items?.data[0]?.price?.product?.id;
      const productName = (
        session.line_items?.data[0]?.price?.product as Stripe.Product
      )?.name;

      if (!priceId || !stripeProductId || !productName) {
        console.error("Missing product details in session:", session);
        throw new Error("Missing product details in session");
      }

      try {
        await updateUserCredits(supabase, {
          userId: metadata?.userId,
          stripeProductId,
          productName,
          amount: PRICE_TO_CREDITS[priceId] || 0,
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
