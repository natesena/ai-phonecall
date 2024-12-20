import { userCreate } from "@/utils/data/user/userCreate";
import { userUpdate } from "@/utils/data/user/userUpdate";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  console.log("🎅 Webhook endpoint hit at:", new Date().toISOString());

  const cookieStore = await cookies();

  const supabase: any = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("🎅 Missing required headers");
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  console.log("🎅 Webhook payload received:", JSON.stringify(payload, null, 2));

  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    console.log("🎅 Event verified successfully:", {
      type: evt.type,
      userId: evt.data?.id,
      email:
        "email_addresses" in evt.data
          ? evt.data.email_addresses?.[0]?.email_address
          : undefined,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      try {
        console.log("🎅 Processing user.created event");
        await userCreate({
          email: payload?.data?.email_addresses?.[0]?.email_address,
          first_name: payload?.data?.first_name,
          last_name: payload?.data?.last_name,
          profile_image_url: payload?.data?.profile_image_url,
          user_id: payload?.data?.id,
          phone_number: payload?.data?.phone_numbers?.[0]?.phone_number,
        });

        return NextResponse.json({
          status: 200,
          message: "User info inserted",
        });
      } catch (error: any) {
        console.error("🎅 Error inserting user:", error);
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }
      break;

    case "user.updated":
      try {
        console.log("🎅 Processing user.updated event");
        await userUpdate({
          email: payload?.data?.email_addresses?.[0]?.email_address,
          first_name: payload?.data?.first_name,
          last_name: payload?.data?.last_name,
          profile_image_url: payload?.data?.profile_image_url,
          user_id: payload?.data?.id,
        });

        return NextResponse.json({
          status: 200,
          message: "User info updated",
        });
      } catch (error: any) {
        console.error("🎅 Error updating user:", error);
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }
      break;
    case "session.created":
      try {
        console.log("🎅 Processing session.created event");
        // Check if user exists first
        const { data: existingUser } = await supabase
          .from("user")
          .select("user_id")
          .eq("user_id", payload?.data?.id)
          .single();

        if (!existingUser) {
          console.log("User does not exist, creating user");
          // Create user if they don't exist
          await userCreate({
            email: payload?.data?.email_addresses?.[0]?.email_address,
            first_name: payload?.data?.first_name,
            last_name: payload?.data?.last_name,
            profile_image_url: payload?.data?.profile_image_url,
            user_id: payload?.data?.id,
            phone_number: payload?.data?.phone_numbers?.[0]?.phone_number,
          });
        }

        return NextResponse.json({
          status: 200,
          message: "User sign in handled",
        });
      } catch (error: any) {
        console.error("🎅 Error handling user sign in:", error);
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }
      break;

    default:
      return new Response("Error occured -- unhandeled event type", {
        status: 400,
      });
  }

  return new Response("", { status: 201 });
}
