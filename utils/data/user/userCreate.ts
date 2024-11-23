"server only";

import { userCreateProps } from "@/utils/types";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
  phone_number,
}: userCreateProps) => {
  console.log("Starting userCreate with:", {
    email,
    first_name,
    last_name,
    profile_image_url,
    user_id,
    phone_number,
  });

  try {
    console.log("Attempting Prisma upsert...");
    const updateData: Prisma.userUpdateInput = {
      first_name,
      last_name,
      profile_image_url,
      phone_number,
    };

    const createData: Prisma.userCreateInput = {
      email,
      first_name,
      last_name,
      profile_image_url,
      user_id,
      phone_number,
    };

    const data = await prisma.user.upsert({
      where: { email },
      update: updateData,
      create: createData,
    });

    console.log("Prisma Response:", { data });
    return data;
  } catch (error: any) {
    console.error("Caught error:", {
      message: error.message,
      stack: error.stack,
    });

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return {
        code: "CONNECTION_ERROR",
        message: "Unable to connect to the database. Please try again later.",
      };
    }

    if (error.code === "42501") {
      return {
        code: "42501",
        message: "Insufficient permissions to perform this operation",
      };
    }

    if (error.code === "P2002") {
      return {
        code: "P2002",
        message: "User already exists with this email or user_id",
      };
    }

    throw new Error(error.message);
  }
};
