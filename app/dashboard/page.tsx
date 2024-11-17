"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Banknote } from "lucide-react";
import CallLog from "./calls/_components/CallLog";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

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

export default function OverviewPage() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.phoneNumbers?.[0]) return;

      try {
        setLoading(true);
        const number = user.phoneNumbers[0].phoneNumber;

        // Fetch both calls and transactions
        const [callsResponse, transactionsResponse] = await Promise.all([
          fetch(`/api/vapi/calls?phoneNumber=${encodeURIComponent(number)}`),
          fetch(`/api/payments/query?userId=${userId}`),
        ]);

        const calls = await callsResponse.json();
        const transactions = await transactionsResponse.json();
        // Transform calls and transactions into timeline items
        const callItems: TimelineItem[] = calls.map((call: any) => ({
          type: "call",
          date: call.startedAt,
          data: call,
        }));

        const transactionItems: TimelineItem[] = transactions.transactions.map(
          (transaction: Transaction) => ({
            type: "transaction",
            date: transaction.payment_time,
            data: transaction,
          })
        );

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
            <Banknote className="h-4 w-4 text-gray-600" />
          </div>
          <span className="font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: transaction.currency,
            }).format(transaction.amount)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Activity Overview</h1>
      {Object.entries(groupedItems).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-lg font-semibold mb-4">
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
    </div>
  );
}
