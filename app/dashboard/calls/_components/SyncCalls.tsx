"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SyncCalls({
  onSyncComplete,
}: {
  onSyncComplete: () => void;
}) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch("/api/calls/sync", {
        method: "POST",
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(`Successfully synced ${result.successfulSyncs} calls`);
      onSyncComplete(); // Trigger refetch of calls
    } catch (error) {
      console.error("Sync failed:", error);
      toast.error("Failed to sync calls");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      className="w-full max-w-sm mx-auto"
    >
      {isSyncing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Syncing Calls...
        </>
      ) : (
        "Sync Calls from VAPI"
      )}
    </Button>
  );
}
