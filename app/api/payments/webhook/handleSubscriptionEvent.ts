import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getCustomerEmail } from "./getCustomerEmail";

export async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: "created" | "updated" | "deleted",
  supabase: ReturnType<typeof createServerClient>,
  stripe: Stripe
) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerEmail = await getCustomerEmail(
    subscription.customer as string,
    stripe
  );

  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: "Customer email could not be fetched",
    });
  }

  const subscriptionData: any = {
    subscription_id: subscription.id,
    stripe_user_id: subscription.customer,
    status: subscription.status,
    start_date: new Date(subscription.created * 1000).toISOString(),
    plan_id: subscription.items.data[0]?.price.id,
    user_id: subscription.metadata?.userId || "",
    email: customerEmail,
  };

  let data, error;
  if (type === "deleted") {
    ({ data, error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled", email: customerEmail })
      .match({ subscription_id: subscription.id })
      .select());
    if (!error) {
      const { error: userError } = await supabase
        .from("user")
        .update({ subscription: null })
        .eq("email", customerEmail);
      if (userError) {
        console.error("Error updating user subscription status:", userError);
        return NextResponse.json({
          status: 500,
          error: "Error updating user subscription status",
        });
      }
    }
  } else {
    ({ data, error } = await supabase
      .from("subscriptions")
      [type === "created" ? "insert" : "update"](
        type === "created" ? [subscriptionData] : subscriptionData
      )
      .match({ subscription_id: subscription.id })
      .select());
  }

  if (error) {
    console.error(`Error during subscription ${type}:`, error);
    return NextResponse.json({
      status: 500,
      error: `Error during subscription ${type}`,
    });
  }

  return NextResponse.json({
    status: 200,
    message: `Subscription ${type} success`,
    data,
  });
}
