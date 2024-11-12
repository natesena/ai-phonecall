"use client";

import { useEffect, useState } from "react";
import CallLog from "./_components/CallLog";

export default function CallList() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/calls");
        const data = await response.json();
        setCalls(data);
      } catch (err) {
        setError("Failed to fetch calls");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Calls</h2>
      {calls.length === 0 ? (
        <p>No calls found</p>
      ) : (
        <ul className="space-y-2">
          {calls.map((call) => (
            <CallLog call={call} />
          ))}
        </ul>
      )}
    </div>
  );
}
