import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, version } = await request.json();

  // Validate type
  if (type !== "terms" && type !== "privacy") {
    return NextResponse.json(
      { error: "Type must be either 'terms' or 'privacy'" },
      { status: 400 }
    );
  }

  const headersList = request.headers;
  const ip = headersList.get("x-forwarded-for") || "unknown";
  const userAgent = headersList.get("user-agent") || "unknown";

  try {
    const consent = await prisma.consent_record.create({
      data: {
        user_id: userId,
        type,
        version,
        ip_address: ip,
        user_agent: userAgent,
      },
    });

    return NextResponse.json({ success: true, consent });
  } catch (error) {
    console.error("Error creating consent:", error);
    return NextResponse.json(
      { error: "Failed to create consent" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const version = searchParams.get("version");
  const type = searchParams.get("type");

  // Validate parameters
  if (!version || !type) {
    return NextResponse.json(
      { error: "Version and type are required" },
      { status: 400 }
    );
  }

  // Validate type
  if (type !== "terms" && type !== "privacy") {
    return NextResponse.json(
      { error: "Type must be either 'terms' or 'privacy'" },
      { status: 400 }
    );
  }

  try {
    const consent = await prisma.consent_record.findFirst({
      where: {
        user_id: userId,
        type: type,
        version: version,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json({ consent });
  } catch (error) {
    console.error("Error checking consent:", error);
    return NextResponse.json(
      { error: "Failed to check consent" },
      { status: 500 }
    );
  }
}
