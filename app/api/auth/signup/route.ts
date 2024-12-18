import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phoneNo } = await request.json();

    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        cookies: {}
      }
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          phone_number: phoneNo,
          last_name: lastName
        }
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const res = await supabase
        .from("user")
        .insert({ 
          first_name: firstName, 
          last_name: lastName, 
          email: email, 
          user_id: data.user.id, 
          phone_number: phoneNo, 
          is_phone_verified: false 
        });

      if (res.error) {
        return NextResponse.json({ error: res.error.message }, { status: 400 });
      }

      return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
    }

    return NextResponse.json({ error: "Failed to create account" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
