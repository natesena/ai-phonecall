"use client";

import Image from "next/image";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { ConsentModal } from "@/components/consent/consent-modal";
import { privacyv0 } from "@/app/privacy/_versions/v0_privacy";
import { termsv0 } from "@/app/terms/_versions/v0_terms";

export default function CallNow() {
  const { user } = useUser();
  const router = useRouter();
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

  const handleClick = async () => {
    if (!user?.id) {
      router.push(
        `/sign-up?redirect=checkout&price=5&priceId=${process.env.NEXT_PUBLIC_3_CALL_PRICE_ID}`
      );
      return;
    }

    const { hasTermsConsent, hasPrivacyConsent } = await checkExistingConsent();

    if (hasTermsConsent && hasPrivacyConsent) {
      proceedToCheckout(5, process.env.NEXT_PUBLIC_3_CALL_PRICE_ID as string);
    } else {
      setPendingCheckout({
        price: 5,
        priceId: process.env.NEXT_PUBLIC_3_CALL_PRICE_ID as string,
      });
      setShowConsentModal(true);
    }
  };

  return (
    <>
      <div
        className="flex justify-center items-center cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleClick}
      >
        <Image
          src="/images/homepage/call-now.png"
          alt="call count background"
          width={500}
          height={500}
        />
      </div>

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
    </>
  );
}
