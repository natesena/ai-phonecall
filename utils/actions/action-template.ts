"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function actionTemplate() {
  const { userId } = await auth();

  if (!userId) {
    return "You must be signed in";
  }

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {}
    }
  );

  try {
    let { data: user, error } = await supabase.from("user").select("*");
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }

}
