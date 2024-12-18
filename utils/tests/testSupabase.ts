"server only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const testSupabaseConnection = async () => {
  console.log("Starting Supabase connection test...");

  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    const envInfo = {
      hasUrl: !!process.env.SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_KEY,
      url: process.env.SUPABASE_URL?.substring(0, 10) + "...", // Log first 10 chars for verification
    };
    console.error("Environment variables missing:", envInfo);
    throw new Error("Missing Supabase environment variables");
  }

  try {
    // Create Supabase client
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        cookies: {}
      }
    );

    // Test query
    const { data: testData, error: testError } = await supabase
      .from("user")
      .select("*")
      .limit(1);

    if (testError) {
      console.error("Query error:", testError);
      throw testError;
    }

    return {
      success: true,
      message: "Successfully connected to Supabase",
      data: {
        rowCount: testData?.length || 0,
      },
    };
  } catch (error: any) {
    console.error("Connection error:", error);
    throw new Error(`Supabase test failed: ${error.message}`);
  }
};
