import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const credits = await prisma.user_credits.findFirst({
      where: {
        user_id: userId,
      },
      select: {
        product_name: true,
        amount: true,
      },
    });

    return NextResponse.json({ credits: credits ? [credits] : [] });
  } catch (error) {
    console.error("Error in credits route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
