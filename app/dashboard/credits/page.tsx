"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useUser } from "@clerk/nextjs";
import { Loading } from "@/components/loading";
import CheckoutFlow from "@/components/checkout-flow/checkout-flow";
import { SantaCallCard } from "@/components/dashboard/santa-call-card";

interface CreditType {
  product_name: string;
  amount: number;
}

const santaPhoneNumber = process.env.NEXT_PUBLIC_SANTA_PHONE_NUMBER!;

export default function CreditsPage() {
  const [credits, setCredits] = useState<CreditType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch(`/api/credits`);
        if (!response.ok) throw new Error("Failed to fetch credits");
        const data = await response.json();
        setCredits(data.credits);
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchCredits();
    }
  }, [userId]);

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 container mx-auto max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold mb-6 text-white text-shadow-lg">
        Credits Overview
      </h1>
      {!credits.some((credit) => credit.amount > 0) ? (
        <CheckoutFlow
          title="Get Started with Credits"
          description="Purchase credits to start making calls with Santa"
          buttonText="Purchase Credits"
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Your Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {credits.map((credit, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span>{credit.product_name}</span>
                    <span className="font-semibold">
                      {credit.amount} credits
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <SantaCallCard phoneNumber={santaPhoneNumber} />
        </>
      )}
    </div>
  );
}
