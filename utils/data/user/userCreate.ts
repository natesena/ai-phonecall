"server only"

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { userCreateProps } from "@/utils/types";

export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: userCreateProps) => {
  console.log("Starting userCreate with:", {
    email,
    first_name,
    last_name,
    profile_image_url,
    user_id,
  });

  // First, verify environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.log("Environment variables:", {
      hasUrl: !!process.env.SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_KEY
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
    console.log("Attempting Supabase insert...");
    const { data, error } = await supabase
      .from("user")
      .insert([
        {
          email,
          first_name,
          last_name,
          profile_image_url,
          user_id,
        },
      ])
      .select();

    console.log("Supabase Response:", {
      data,
      error,
      errorCode: error?.code,
      errorMessage: error?.message,
      errorDetails: error?.details
    });

    if (error?.code) return error;
    return data;
  } catch (error: any) {
    console.error("Caught error:", {
      message: error.message,
      stack: error.stack
    });
    throw new Error(error.message);
  }
};
