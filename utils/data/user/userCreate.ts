"server only";

import { userCreateProps } from "@/utils/types";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Log the available properties
type Debug = Prisma.userCreateInput;
console.log("Available properties:", Object.keys(prisma.user.fields));

// Create a type helper function to see the full type structure
type InspectType<T> = T extends object ? { [K in keyof T]: T[K] } : T;

// Inspect the exact types Prisma is generating
type UserUpdateInputType = InspectType<Prisma.userUpdateInput>;
type UserCreateInputType = InspectType<Prisma.userCreateInput>;

// Create a development-only type check
const typeCheck: UserUpdateInputType = {} as any;
const createCheck: UserCreateInputType = {} as any;

// Add this temporarily
const debug: Prisma.userUpdateInput = {} as any;
console.log("Update Input Type:", Object.keys(debug));

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

    if (error.code === "P2002") {
      return {
        code: "P2002",
        message: "User already exists with this email or user_id",
      };
    }

    throw new Error(error.message);
  }
};
