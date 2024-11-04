import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getCustomerEmail } from "./getCustomerEmail";

export async function handleInvoiceEvent(
  event: Stripe.Event,
  status: "succeeded" | "failed",
  supabase: ReturnType<typeof createServerClient>,
  stripe: Stripe
) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerEmail = await getCustomerEmail(
    invoice.customer as string,
    stripe
  );

  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: "Customer email could not be fetched",
    });
  }

  const invoiceData = {
    invoice_id: invoice.id,
    subscription_id: invoice.subscription as string,
    amount_paid: status === "succeeded" ? invoice.amount_paid / 100 : undefined,
    amount_due: status === "failed" ? invoice.amount_due / 100 : undefined,
    currency: invoice.currency,
    status,
    user_id: invoice.metadata?.userId,
    email: customerEmail,
  };

  const { data, error } = await supabase.from("invoices").insert([invoiceData]);

  if (error) {
    console.error(`Error inserting invoice (payment ${status}):`, error);
    return NextResponse.json({
      status: 500,
      error: `Error inserting invoice (payment ${status})`,
    });
  }

  return NextResponse.json({
    status: 200,
    message: `Invoice payment ${status}`,
    data,
  });
}
