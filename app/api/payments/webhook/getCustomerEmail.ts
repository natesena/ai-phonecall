import Stripe from "stripe";

export async function getCustomerEmail(
  customerId: string,
  stripe: Stripe
): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return (customer as Stripe.Customer).email;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}
