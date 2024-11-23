"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { Loading } from "@/components/loading";
import CheckoutFlow from "@/components/checkout-flow/checkout-flow";

interface Transaction {
  stripe_id: string;
  payment_time: string;
  amount: number;
  currency: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`/api/payments/query?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 container mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-6 text-white text-shadow-lg">
        Transaction History
      </h1>

      {transactions.length === 0 ? (
        <CheckoutFlow
          title="Make Your First Purchase"
          description="Get started with Santa calls today"
          buttonText="Purchase Credits"
        />
      ) : (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.stripe_id}>
                  <TableCell className="dark:text-black">
                    {formatDistance(
                      new Date(transaction.payment_time),
                      new Date(),
                      { addSuffix: true }
                    )}
                  </TableCell>
                  <TableCell className="dark:text-black">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: transaction.currency,
                    }).format(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                      Completed
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
