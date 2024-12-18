"use client";

import { useEffect, useState } from "react";
import CallsList from "./_components/CallsList";
import SyncCalls from "./_components/SyncCalls";
import { useUser } from "@/hooks/use-user";
import { Loading } from "@/components/loading";
import type { call } from "@prisma/client";

export default function CallsPage() {
  const [calls, setCalls] = useState<call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const isLocalhost =
    typeof window !== "undefined" && window.location.hostname === "localhost";

  const fetchCalls = async () => {
    if (!isLoaded) return;
    if (!user?.phoneNumbers?.[0]) return;

    try {
      setLoading(true);
      const number = user.phoneNumbers[0].phoneNumber;

      const response = await fetch("/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: number }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCalls(data.calls || []); // Ensure we always have an array
      }
    } catch (err) {
      setError("Failed to fetch calls");
      console.error("Error fetching calls:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, [user, isLoaded]);

  if (!isLoaded) return <Loading />;
  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto max-w-4xl space-y-8 overflow-hidden">
      {calls.length > 0 ? (
        <>
          {isLocalhost && <SyncCalls onSyncComplete={fetchCalls} />}
          <CallsList calls={calls} />
        </>
      ) : (
        <div className="space-y-6 text-center py-8">
          <div className="lobster-regular text-white">
            <p className="text-7xl">No calls found 🎅</p>
            <p className="text-2xl">Santa Misses You</p>
          </div>
          <div className="pt-4">
            {isLocalhost && <SyncCalls onSyncComplete={fetchCalls} />}
          </div>
        </div>
      )}
    </div>
  );
}
