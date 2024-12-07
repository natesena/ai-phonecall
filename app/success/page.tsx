import { Button } from "@/components/ui/button";
import Link from "next/link";
import Stripe from "stripe";
import PageWrapper from "@/components/wrapper/page-wrapper";
import Santa from "./_background/santa";
import { Phone } from "lucide-react";
import Script from "next/script";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const santaPhoneNumber = process.env.SANTA_PHONE_NUMBER!;

export default async function SuccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const session = await stripe.checkout.sessions.retrieve(
    searchParams?.session_id as string,
    {
      expand: ["payment_intent"],
    }
  );

  // Get the transaction ID from the payment intent
  const transactionId =
    (session.payment_intent as Stripe.PaymentIntent)?.id || "";

  return (
    <PageWrapper>
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-16801404348/rTXtCKnQ2_AZELyrxMs-',
            'value': 1.0,
            'currency': 'USD',
            'transaction_id': '${transactionId}'
          });
        `}
      </Script>
      <div className="min-h-[calc(100vh-var(--navbar-height))] flex items-center justify-center relative">
        {/* Santa component in background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Santa />
        </div>

        {/* Modal overlay */}
        <div className="relative z-10 bg-black/50 rounded-lg backdrop-blur-sm p-4 sm:p-8 mx-4">
          <div className="text-center">
            <h1 className="lobster-regular text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">
              Thank you for your purchase!
            </h1>
            <h2 className="lobster-regular text-sm sm:text-lg text-white mb-4 sm:mb-8">
              Santa, Ms.Claus, The Reindeer, and all of the elves are thankful
              for your support
            </h2>

            <p className="text-white text-lg sm:text-xl mb-2">
              To call Santa please dial (or click):
            </p>
            <a
              href={`tel:${santaPhoneNumber}`}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Phone className="text-green-500 w-8 h-8 sm:w-12 sm:h-12" />
              <p className="text-white text-3xl sm:text-7xl break-all sm:break-normal">
                {santaPhoneNumber}
              </p>
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
