"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import { Loading } from "@/components/loading";
interface CreditType {
  product_name: string;
  amount: number;
}

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credits.map((credit) => (
          <Card key={credit.product_name}>
            <CardHeader>
              <CardTitle className="text-lg">{credit.product_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{credit.amount}</p>
              <p className="text-sm text-muted-foreground">Remaining calls</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
