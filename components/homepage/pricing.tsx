"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Band } from "@/components/homepage/band";

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  user: any;
  handleCheckout: any;
  price: number;
  title: string;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
  priceId: string;
};

const PricingCard = ({
  user,
  handleCheckout,
  price,
  title,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
  priceId,
}: PricingCardProps) => {
  const router = useRouter();
  return (
    <div className="relative">
      <div className="shiny-border rounded-lg p-[20px]">
        <Card className="pricing w-72 flex flex-col justify-between py-1 mx-auto sm:mx-0 bg-white dark:bg-zinc-900">
          <div>
            <CardHeader className="pb-8 pt-4">
              <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
                {title}
              </CardTitle>

              <div className="flex gap-0.5">${price}</div>
              <CardDescription className="pt-1.5 h-12">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {features.map((feature: string) => (
                <CheckItem key={feature} text={feature} />
              ))}
            </CardContent>
          </div>
          <CardFooter className="mt-2">
            <Button
              onClick={() => {
                if (user?.id) {
                  handleCheckout(price, priceId);
                } else {
                  toast("Please login or sign up to purchase", {
                    description: "You must be logged in to make a purchase",
                    action: {
                      label: "Sign Up",
                      onClick: () => {
                        router.push("/sign-up");
                      },
                    },
                  });
                }
              }}
              className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              type="button"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
              {actionLabel}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
);

export default function Pricing() {
  const { user } = useUser();
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const handleCheckout = async (price: number, priceId: string) => {
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
        toast("Failed to create checkout session");
        return;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast("Error during checkout");
      return;
    }
  };

  const plans = [
    {
      title: "Call Santa",
      price: 5,
      description: "Essential features you need to get started",
      features: [
        "1x 5 minute call with Santa",
        "No milk & cookies necessary",
        "Chimney-proof guarantee",
      ],
      priceId: process.env.NEXT_PUBLIC_1_CALL_PRICE_ID as string,
      productId: process.env.NEXT_PUBLIC_1_CALL_PROD_ID as string,
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
    </div>
  );
}
