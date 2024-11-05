import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // First get the stripe_customer_id from the user record
    const cookieStore = cookies();
    const supabase = createServerClient(
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

    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (userError || !userData?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No customer ID found for user" },
        { status: 404 }
      );
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
