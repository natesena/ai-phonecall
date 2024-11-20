import { NextResponse } from "next/server";
import config from "./config";

let clerkMiddleware: (arg0: (auth: any, req: any) => any) => {
    (arg0: any): any;
    new (): any;
  },
  createRouteMatcher;

if (config.auth.enabled) {
  try {
    ({ clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server"));
  } catch (error) {
    console.warn("Clerk modules not available. Auth will be disabled.");
    config.auth.enabled = false;
  }
}

// Define protected routes that require authentication
const isProtectedRoute = config.auth.enabled
  ? createRouteMatcher([
      "/dashboard(.*)",
      "/api/calls(.*)", // Protect call-related APIs
      "/api/user(.*)", // Protect user-related APIs
      // Add other protected routes here
    ])
  : () => false;

// Define public routes that should bypass auth
const isPublicRoute = config.auth.enabled
  ? createRouteMatcher([
      "/",
      "/api/vapi/webhooks", // VAPI webhooks
      "/api/auth/webhook", // Clerk webhooks
      "/api/payments/webhook", // Stripe webhooks
    ])
  : () => true;

export default function middleware(req: any) {
  if (config.auth.enabled) {
    // Skip middleware for public routes
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    return clerkMiddleware(async (auth, req) => {
      const resolvedAuth = await auth();

      if (!resolvedAuth.userId && isProtectedRoute(req)) {
        return resolvedAuth.redirectToSignIn();
      } else {
        return NextResponse.next();
      }
    })(req);
  } else {
    return NextResponse.next();
  }
}

export const middlewareConfig = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
