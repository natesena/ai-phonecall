# Getting Started

## Prerequisites

- Node.js and yarn/bun installed
- Accounts and API keys for:
  - Supabase
  - Stripe (if using payments)
  - Clerk (if using authentication)

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```
   yarn
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   SUPABASE_URL=<your-supabase-project-url>
   SUPABASE_SERVICE_KEY=<your-supabase-service-key>

   # If using Stripe
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   NEXT_PUBLIC_STRIPE_PRICE_ID=<your-stripe-price-id>

   # If using Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

4. Configure features:
   In `config.ts`, set the desired features:

   ```typescript
   const config = {
     auth: {
       enabled: true, // Set to false if not using Clerk
     },
     payments: {
       enabled: true, // Set to false if not using Stripe
     },
   };
   ```

5. Set up the database:
   Run Prisma migrations:

   ```
   npx prisma migrate dev
   ```

6. Start the development server:

   ```
   yarn dev
   ```

7. Open your browser and navigate to `http://localhost:3000` to see your application running.

## Routes / API

- `/api/auth/webhook`
  - Inputs: Webhook data from Clerk
  - Outputs: None
- `api/calls`
  - Used for posting a call from within the VAPI Webhook Logic in `/api/vapi/webhooks/route.ts`
  - Inputs: Call data
  - Outputs: None
- `/api/calls/sync`
  - Description: (CAREFUL) Syncs all calls from VAPI to the database. This incorrectly assumes that all calls are from the requesting user. This needs to be fixed.
  - Inputs: None
  - Outputs: All calls synced from VAPI
- `/api/calls/total`
  - Description: Gets the total number of calls from the database for use on the homepage.
  - Inputs: None
  - Outputs: Total number of calls
- `/api/consent`
  - (GET) Checks to see if the user has consented to the terms of service or privacy policy. Currently, there is only one version of each, but this could be extended in the future to search for only the latest version.
  - (POST) Records a user's consent to the terms of service or privacy policy.
    - Inputs: consent type (either "terms" or "privacy") and version
    - Outputs: None
- `/api/credits`
  - (GET) Gets the number of credits the user has remaining.
  - (POST) Records a user's purchase of credits.
    - Inputs: number of credits purchased
    - Outputs: None
- `/api/payments/create-checkout-session`
  - Inputs: userId, email, priceId, subscription
    - userId: The user's Clerk ID
    - email: The user's email
    - priceId: The Stripe price ID for a single line item
    - subscription: Whether the user is subscribing or purchasing credits
    - (Note) The user's intent is to either buy a single line item or subscribe.
  - Outputs: Checkout session
- `/api/payments/webhook`
  - Inputs: Webhook data from Stripe
  - Outputs: None
- `api/payments/query`
  - Inputs: userId via the request (not via params or request body)
  - Outputs: All payments for the user
- `/api/vapi/call/[id]`
  - Inputs: a single callId
  - Outputs: Detailed call information directly from VAPI
- `/api/vapi/calls`
  - Inputs: None
  - Outputs: All calls (Note: This is not currently used by the frontend)
- `/api/vapi/numbers`
  - Description: Gets information about a phone number from VAPI. Only works for Vapi providers rather than the general number lookup.
  - Inputs: phoneNumber
  - Outputs: Phone number information directly from VAPI
- `api/vapi/numid`
  - Description: Not currently used by the frontend.
  - Inputs: Phonenumber/s
  - Outputs: A single phone number and phone number id

## Additional Configuration

- Webhooks: Set up webhooks for Clerk (if using auth) at `/api/auth/webhook` and for Stripe (if using payments) at `/api/payments/webhook`.
- Customize the landing page, dashboard, and other components as needed.
- Modify the Prisma schema in `prisma/schema.prisma` if you need to change the database structure.

## Important Security Notes

- Enable Row Level Security (RLS) in your Supabase project to ensure data protection at the database level.
- Always make Supabase calls on the server-side (in API routes or server components) to keep your service key secure.

## Learn More

Refer to the documentation of the individual technologies used in this project for more detailed information:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.dev/docs) (if using auth)
- [Stripe Documentation](https://stripe.com/docs) (if using payments)

## Making Schema Changes

When modifying the Prisma schema (`prisma/schema.prisma`):

1. Edit the schema file with your changes
2. Create a new migration:
   ```bash
   npx prisma migrate dev --name describe_your_changes
   ```
3. This command will:
   - Create a new migration file
   - Apply the migration to your database
   - Regenerate the Prisma client

Note: In development, you can also use `npx prisma db push` for quick schema prototyping, but migrations are recommended for production changes.
