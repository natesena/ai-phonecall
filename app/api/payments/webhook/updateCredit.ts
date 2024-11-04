import { SupabaseClient } from "@supabase/supabase-js";

export async function updateUserCredits(
  supabase: SupabaseClient,
  {
    userId,
    stripeProductId,
    productName,
    amount,
  }: {
    userId: string;
    stripeProductId: string;
    productName: string;
    amount: number;
  }
) {
  // First get the current credits
  const { data: currentCredits, error: fetchError } = await supabase
    .from("user_credits")
    .select("amount")
    .match({ user_id: userId, stripe_product_id: stripeProductId })
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "not found" error
    throw new Error(`Error fetching current credits: ${fetchError.message}`);
  }

  const currentAmount = currentCredits?.amount || 0;
  const newAmount = currentAmount + amount;

  // Update with combined amount
  const { data: updatedCredits, error: updateError } = await supabase
    .from("user_credits")
    .upsert(
      {
        user_id: userId,
        stripe_product_id: stripeProductId,
        product_name: productName,
        amount: newAmount,
      },
      {
        onConflict: "user_id,stripe_product_id",
      }
    )
    .select();

  if (updateError) {
    console.error("Credit update error details:", {
      error: updateError,
      userId,
      stripeProductId,
      productName,
      newAmount: amount,
    });
    throw new Error(`Error updating user credits: ${updateError.message}`);
  }

  return updatedCredits;
}
