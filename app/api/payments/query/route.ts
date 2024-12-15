import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        stripe_customer_id: true,
      },
    });

    if (!userData?.stripe_customer_id) {
      console.log(`No Stripe customer ID found for user ${userId}`);
      return NextResponse.json({ transactions: [] });
    }

    // Get all payments for the customer
    const payments = await stripe.charges.list({
      customer: userData.stripe_customer_id,
      limit: 100,
    });

    // Format the payments data
    const transactions = payments.data.map((payment) => ({
      stripe_id: payment.id,
      payment_time: new Date(payment.created * 1000).toISOString(),
      amount: payment.amount / 100, // Convert from cents to dollars
      currency: payment.currency,
      status: payment.status,
    }));

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
