import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
      },
    }
  );

  try {
    const { data: credits, error } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user credits:", error);
      return NextResponse.json(
        { error: "Failed to fetch user credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({ credits });
  } catch (error) {
    console.error("Error in credits route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
