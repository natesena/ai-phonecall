import { Banknote } from "lucide-react";

interface Transaction {
  stripe_id: string;
  payment_time: string;
  amount: number;
  currency: string;
}

export default function TransactionItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
            <Banknote className="h-4 w-4 text-gray-600" />
          </div>
          <span className="font-medium dark:text-black">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: transaction.currency,
            }).format(transaction.amount)}
          </span>
        </div>
      </div>
    </div>
  );
}
