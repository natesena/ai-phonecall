import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getCustomerEmail } from "./getCustomerEmail";
import prisma from "@/lib/prisma";

export async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: "created" | "updated" | "deleted",
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

  const subscriptionData = {
    subscription_id: subscription.id,
    stripe_user_id: subscription.customer as string,
    status: type === "deleted" ? "cancelled" : subscription.status,
    start_date: new Date(subscription.created * 1000).toISOString(),
    plan_id: subscription.items.data[0]?.price.id,
    user_id: subscription.metadata?.userId || "",
    email: customerEmail,
  };

  try {
    let data;
    if (type === "deleted") {
      // Update subscription status to cancelled
      data = await prisma.subscriptions.update({
        where: {
          subscription_id: subscription.id,
        },
        data: {
          status: "cancelled",
          email: customerEmail,
        },
      });

      // Update user subscription to null
      await prisma.user.update({
        where: {
          email: customerEmail,
        },
        data: {
          subscription: null,
        },
      });
    } else if (type === "created") {
      // Create new subscription
      data = await prisma.subscriptions.create({
        data: subscriptionData,
      });
    } else {
      // Update existing subscription
      data = await prisma.subscriptions.update({
        where: {
          subscription_id: subscription.id,
        },
        data: subscriptionData,
      });
    }

    return NextResponse.json({
      status: 200,
      message: `Subscription ${type} success`,
      data,
    });
  } catch (error: any) {
    console.error(`Error during subscription ${type}:`, {
      message: error.message,
      code: error.code,
    });

    return NextResponse.json({
      status: 500,
      error: `Error during subscription ${type}: ${error.message}`,
    });
  }
}
