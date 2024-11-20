"server only";
import { userUpdateProps } from "@/utils/types";
import prisma from "@/lib/prisma";

export const userUpdate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: userUpdateProps) => {
  try {
    const data = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        first_name,
        last_name,
        profile_image_url,
        user_id,
      },
    });

    return data;
  } catch (error: any) {
    console.error("Error updating user:", {
      message: error.message,
      code: error.code,
    });

    if (error.code === "P2025") {
      return {
        code: "P2025",
        message: "User not found with this email",
      };
    }

    throw new Error(error.message);
  }
};
