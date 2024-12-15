import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ConsentModal } from "@/components/consent/consent-modal";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { termsv0 } from "@/app/terms/_versions/v0_terms";
import { privacyv0 } from "@/app/privacy/_versions/v0_privacy";
import { loadStripe } from "@stripe/stripe-js";

interface CheckoutFlowProps {
  title: string;
  description: string;
  buttonText: string;
}

export default function CheckoutFlow({
  title,
  description,
  buttonText,
}: CheckoutFlowProps) {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<{
    price: number;
    priceId: string;
  } | null>(null);
  const { user } = useUser();

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

  const handleCheckout = async () => {
    const { hasTermsConsent, hasPrivacyConsent } = await checkExistingConsent();

    if (hasTermsConsent && hasPrivacyConsent) {
      console.log("proceeding to checkout");
      proceedToCheckout(5, process.env.NEXT_PUBLIC_3_CALL_PRICE_ID as string);
    } else {
      console.log("showing consent modal");
      setPendingCheckout({
        price: 5,
        priceId: process.env.NEXT_PUBLIC_3_CALL_PRICE_ID as string,
      });
      setShowConsentModal(true);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="text-center py-6">
          <p className="text-xl font-semibold mb-2">{title}</p>
          <p className="mb-4 text-muted-foreground">{description}</p>
          <Button onClick={handleCheckout} className="font-medium">
            {buttonText} →
          </Button>
        </CardContent>
      </Card>

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
