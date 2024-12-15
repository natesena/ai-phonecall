import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getCustomerEmail } from "./getCustomerEmail";
import prisma from "@/lib/prisma";

export async function handleInvoiceEvent(
  event: Stripe.Event,
  status: "succeeded" | "failed",
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
    amount_paid:
      status === "succeeded" ? (invoice.amount_paid / 100).toString() : "",
    amount_due:
      status === "failed" ? (invoice.amount_due / 100).toString() : "",
    currency: invoice.currency,
    status,
    user_id: invoice.metadata?.userId,
    email: customerEmail,
  };

  try {
    await prisma.invoices.create({
      data: invoiceData,
    });

    return NextResponse.json({
      status: 200,
      message: `Invoice payment ${status}`,
    });
  } catch (error) {
    console.error(`Error inserting invoice (payment ${status}):`, error);
    return NextResponse.json({
      status: 500,
      error: `Error inserting invoice (payment ${status})`,
    });
  }
}
