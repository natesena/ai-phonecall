"use client";

import { useEffect, useState } from "react";
import CallsList from "./_components/CallsList";
import { useUser } from "@clerk/nextjs";

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchCalls = async () => {
      if (!isLoaded) return;
      if (!user?.phoneNumbers?.[0]) return;

      try {
        setLoading(true);
        const rawNumber = user.phoneNumbers[0].phoneNumber;
        const number = rawNumber;
        console.log("Fetching calls for number:", number);

        const response = await fetch(
          `/api/vapi/calls?phoneNumber=${encodeURIComponent(number)}`
        );
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setCalls(data);
        }
      } catch (err) {
        setError("Failed to fetch calls");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [user, isLoaded]);

  if (!isLoaded) return <div>Loading user...</div>;
  if (loading) return <div>Loading calls...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{calls.length > 0 && <CallsList calls={calls} />}</div>;
}
