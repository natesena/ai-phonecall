"server only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const testSupabaseConnection = async () => {
  console.log("Starting Supabase connection test...");

  // Verify environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.log("Environment variables:", {
      hasUrl: !!process.env.SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_KEY,
      url: process.env.SUPABASE_URL?.substring(0, 10) + "...", // Log first 10 chars for verification
    });
    throw new Error("Missing Supabase environment variables");
  }

  const cookieStore = await cookies();

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

  try {
    console.log("Testing table access...");
    const { data: testData, error: testError } = await supabase
      .from("user")
      .select("*")
      .limit(1);

    console.log("Select test result:", {
      success: !testError,
      data: testData,
      error: testError,
    });

    return {
      connection: "success",
      selectTest: { data: testData, error: testError },
    };
  } catch (error: any) {
    console.error("Test failed:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    });
    throw new Error(`Supabase test failed: ${error.message}`);
  }
};
