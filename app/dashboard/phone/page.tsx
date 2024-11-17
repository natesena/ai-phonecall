"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      if (!user?.phoneNumbers?.[0]) return;

      setIsLoading(true);
      try {
        const number = user.phoneNumbers[0].phoneNumber;
        const response = await fetch(
          `/api/vapi/numid?phoneNumber=${encodeURIComponent(number)}`
        );

        const result = await response.json();
        console.log(result);
        setPhoneNumbers([result]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoneNumber();
  }, [user]);

  return (
    <div className="p-4">
      <h1>Phone Numbers</h1>

      {phoneNumbers[0] && (
        <div>
          <h2>{phoneNumbers[0].phoneNumberId}</h2>
          <h2>{phoneNumbers[0].phoneNumber}</h2>
        </div>
      )}
    </div>
  );
}
