"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import CallLog from "@/app/dashboard/calls/_components/CallLog";
import TransactionItem from "./transactions/_components/TransactionItem";
import { Loading } from "@/components/loading";
import ErrorPage from "@/components/errorpage/ErrorPage";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import type { call } from ".prisma/client";
import CheckoutFlow from "@/components/checkout-flow/checkout-flow";
import { SantaCallCard } from "@/components/dashboard/santa-call-card";

interface Transaction {
  stripe_id: string;
  payment_time: string;
  amount: number;
  currency: string;
}

interface TimelineItem {
  type: "call" | "transaction";
  date: string;
  data: any;
}

interface CallsResponse {
  calls: call[];
}

const santaPhoneNumber = process.env.NEXT_PUBLIC_SANTA_PHONE_NUMBER!;

export default function OverviewPage() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const { userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.phoneNumbers?.[0]) return;

      try {
        setLoading(true);
        const number = user.phoneNumbers[0].phoneNumber;

        // Fetch calls, transactions, and credits
        const [callsResponse, transactionsResponse, creditsResponse] =
          await Promise.all([
            fetch(`/api/calls`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phoneNumber: number }),
            }),
            fetch("/api/payments/query"),
            fetch("/api/credits"),
          ]);

        const callsData = await callsResponse.json();
        const transactions = await transactionsResponse.json();
        const creditsData = await creditsResponse.json();
        setCredits(creditsData.credits[0].amount);

        // Initialize empty arrays for both item types
        let callItems: TimelineItem[] = [];
        let transactionItems: TimelineItem[] = [];

        // Only map calls if they exist
        if (callsData?.calls && callsData.calls.length > 0) {
          callItems = callsData.calls.map((call: call) => ({
            type: "call",
            date: call.startedAt,
            data: call,
          }));
        }

        // Only map transactions if they exist
        if (
          transactions?.transactions &&
          transactions.transactions.length > 0
        ) {
          transactionItems = transactions.transactions.map(
            (transaction: Transaction) => ({
              type: "transaction",
              date: transaction.payment_time,
              data: transaction,
            })
          );
        }

        // Combine and sort all items by date
        const allItems = [...callItems, ...transactionItems].sort(
          (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
        );

        setTimelineItems(allItems);
      } catch (err) {
        setError("Failed to fetch timeline data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userId]);

  // Group items by date
  const groupedItems = timelineItems.reduce(
    (groups: { [key: string]: TimelineItem[] }, item) => {
      const date = format(parseISO(item.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    },
    {}
  );

  if (loading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <div className="dashboard-page container mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6 text-white text-shadow-lg">
        Activity Overview
      </h1>
      {timelineItems.length === 0 ? (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl text-white">
              Welcome to Santa's Magical Phone Line! 🎄
            </h2>
            <p className="text-gray-300">
              Your journey with Santa begins with purchasing credits. Once you
              have credits, you'll see all your North Pole activity right here.
            </p>
          </div>

          <CheckoutFlow
            title="Start Your Santa Journey"
            description="Purchase credits to begin making magical calls with Santa"
            buttonText="Get Your First Credits"
          />
        </div>
      ) : (
        <>
          {credits > 0 ? (
            <SantaCallCard phoneNumber={santaPhoneNumber} />
          ) : (
            <CheckoutFlow
              title="Get More Credits"
              description="Purchase more credits to continue making magical calls with Santa"
              buttonText="Get More Credits"
            />
          )}
          {Object.entries(groupedItems).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-4 text-white text-shadow-lg">
                {format(parseISO(date), "MMMM d, yyyy")}
              </h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index}>
                    {item.type === "call" ? (
                      <CallLog call={item.data} />
                    ) : (
                      <TransactionItem transaction={item.data} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
