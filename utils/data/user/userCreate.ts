"server only";

import { userCreateProps } from "@/utils/types";
import prisma from "@/lib/prisma";

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

  try {
    console.log("Attempting Prisma insert...");
    const data = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        profile_image_url,
        user_id,
      },
    });

    console.log("Prisma Response:", { data });
    return data;
  } catch (error: any) {
    console.error("Caught error:", {
      message: error.message,
      stack: error.stack,
    });

    // Return a more structured error response
    if (error.code === "P2002") {
      return {
        code: "P2002",
        message: "User already exists with this email or user_id",
      };
    }

    throw new Error(error.message);
  }
};
