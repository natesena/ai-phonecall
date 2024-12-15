import { NextResponse } from "next/server";
import { testSupabaseConnection } from "@/utils/tests/testSupabase";

export async function GET() {
  try {
    const result = await testSupabaseConnection();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
