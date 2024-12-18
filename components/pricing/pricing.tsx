"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { Band } from "@/components/homepage/band";
import PricingCard from "./pricing-card";
import { ConsentModal } from "@/components/consent/consent-modal";
import { privacyv0 } from "@/app/privacy/_versions/v0_privacy";
import { termsv0 } from "@/app/terms/_versions/v0_terms";

export default function Pricing() {
  const { user } = useUser();

  if (process.env.NODE_ENV === "development") {
    console.log("Rendering Pricing component");
    console.log("Environment variables:", {
      stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      priceId: process.env.NEXT_PUBLIC_3_CALL_PRICE_ID,
      prodId: process.env.NEXT_PUBLIC_3_CALL_PROD_ID,
    });
  }

  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<{
    price: number;
    priceId: string;
  } | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const checkExistingConsent = async () => {
    try {
      const [termsResponse, privacyResponse] = await Promise.all([
        fetch(`/api/consent?type=terms&version=${termsv0.version}`),
        fetch(`/api/consent?type=privacy&version=${privacyv0.version}`),
      ]);

      const [termsData, privacyData] = await Promise.all([
        termsResponse.json(),
        privacyResponse.json(),
      ]);

      return {
        hasTermsConsent: !!termsData.consent,
        hasPrivacyConsent: !!privacyData.consent,
      };
    } catch (error) {
      console.error("Error checking consent:", error);
      return { hasTermsConsent: false, hasPrivacyConsent: false };
    }
  };

  const proceedToCheckout = async (price: number, priceId: string) => {
    try {
      const response = await fetch(`/api/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.emailAddresses?.[0]?.emailAddress,
          price,
          priceId,
        }),
      });

      const data = await response.json();

      if (data.sessionId) {
        const stripe = await stripePromise;
        const result = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });
        return result;
      } else {
        console.error("Failed to create checkout session");
        toast.error("Failed to create checkout session");
        return;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Error during checkout");
      return;
    }
  };

  const handleCheckout = async (price: number, priceId: string) => {
    const { hasTermsConsent, hasPrivacyConsent } = await checkExistingConsent();

    if (hasTermsConsent && hasPrivacyConsent) {
      // If user has already consented, proceed directly to checkout
      proceedToCheckout(price, priceId);
    } else {
      // If user hasn't consented, show the modal
      setPendingCheckout({ price, priceId });
      setShowConsentModal(true);
    }
  };

  const plans = [
    {
      title: "Call Santa",
      price: 5,
      description:
        "Speak with jolly old St.Nick, powered by AI! Every call is unique and personalized to you.",
      features: [
        "3x 2 minute calls with Santa",
        "No milk & cookies necessary",
        "Chimney-proof guarantee",
      ],
      priceId: process.env.NEXT_PUBLIC_3_CALL_PRICE_ID as string,
      productId: process.env.NEXT_PUBLIC_3_CALL_PROD_ID as string,
      actionLabel: "Buy Credit",
    },
  ];

  return (
    <div className="pricing-section relative w-full z-[5] mt-4">
      <div className="band-container absolute left-0 top-1/2 -translate-y-1/2 w-full overflow-x-hidden">
        <Band />
      </div>
      <section className="relative z-10 flex flex-row justify-center gap-8 w-full">
        {plans.map((plan) => {
          if (!plan.priceId) return null;
          return (
            <div className="relative" key={plan.title}>
              <PricingCard
                user={user}
                handleCheckout={handleCheckout}
                {...plan}
              />
            </div>
          );
        })}
      </section>

      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => {
          setShowConsentModal(false);
          setPendingCheckout(null);
        }}
        onConsent={() => {
          setShowConsentModal(false);
          if (pendingCheckout) {
            proceedToCheckout(pendingCheckout.price, pendingCheckout.priceId);
          }
        }}
      />
    </div>
  );
}
