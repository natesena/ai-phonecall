"server only";

import { clerkClient } from "@clerk/nextjs/server";
import config from "@/tailwind.config";
import prisma from "@/lib/prisma";

export const isAuthorized = async (
  userId: string
): Promise<{ authorized: boolean; message: string }> => {
  if (!config?.payments?.enabled) {
    return {
      authorized: true,
      message: "Payments are disabled",
    };
  }

  const result = (await clerkClient()).users.getUser(userId);

  if (!result) {
    return {
      authorized: false,
      message: "User not found",
    };
  }

  try {
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        user_id: userId,
      },
      select: {
        status: true,
      },
    });

    if (subscription?.status === "active") {
      return {
        authorized: true,
        message: "User is subscribed",
      };
    }

    return {
      authorized: false,
      message: "User is not subscribed",
    };
  } catch (error: any) {
    console.error("Error checking subscription:", {
      message: error.message,
      code: error.code,
    });

    return {
      authorized: false,
      message: error.message,
    };
  }
};
