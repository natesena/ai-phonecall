import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.call.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to get call count:", error);
    return NextResponse.json(
      { error: "Failed to get call count" },
      { status: 500 }
    );
  }
}
