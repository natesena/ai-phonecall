import { Call } from "@prisma/client";
import { Phone, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, use } from "react";
import WaveformPlayer from "./WaveformPlayer";

// Extend the Prisma Call type with VAPI-specific fields
interface CallWithArtifacts extends Call {
  artifact?: {
    recordingUrl: string;
    stereoRecordingUrl: string;
    transcript: string;
  };
  customer?: {
    number: string;
  };
}

interface CallLogProps {
  call: CallWithArtifacts;
}

export default function CallLog({ call }: CallLogProps) {
  const [fullCall, setFullCall] = useState<CallWithArtifacts>(call);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function fetchVapiCall() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/vapi/call/${call.callId}`);
        if (!response.ok) throw new Error("Failed to fetch call details");

        const data = await response.json();

        // Update the call with VAPI data
        setFullCall((prev) => ({
          ...prev,
          artifact: {
            recordingUrl: data.recordingUrl || "",
            stereoRecordingUrl: data.stereoRecordingUrl || "",
            transcript: data.transcript || "",
          },
          customer: {
            number: data.customer?.number || prev.customer?.number || "",
          },
        }));
      } catch (error) {
        console.error("Error fetching VAPI call:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (process.env.NEXT_PUBLIC_SHOW_VAPI_CALL_DETAILS) {
      fetchVapiCall();
    }
  }, [call.callId]); // Only re-run if callId changes

  const durationInSeconds = fullCall.durationSeconds || 0;
  const hasArtifacts = Boolean(fullCall.artifact);
  const hasRecording = Boolean(fullCall.artifact?.stereoRecordingUrl);
  const hasTranscript = Boolean(fullCall.artifact?.transcript);
  const duration =
    durationInSeconds > 0
      ? `${Math.floor(durationInSeconds / 60)}:${(durationInSeconds % 60)
          .toString()
          .padStart(2, "0")}`
      : "0:00";

  const handleDownload = () => {
    if (hasRecording) {
      window.open(fullCall.artifact!.stereoRecordingUrl, "_blank");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
            <Phone className="h-4 w-4 text-gray-600" />
          </div>
          <span className="text-sm text-gray-500">
            {fullCall.customer?.number || fullCall.customerPhone}
          </span>
          <span className="font-medium">
            Duration: {formatDuration(durationInSeconds)}
          </span>
          <span className="text-sm text-gray-500">({duration})</span>
        </div>

        {hasArtifacts && (
          <ChevronDown
            className={`h-5 w-5 cursor-pointer transition-transform duration-200 ${
              isExpanded ? "transform rotate-180" : ""
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        )}
      </div>

      {isExpanded && hasArtifacts && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
          {durationInSeconds > 0 ? (
            <>
              {hasRecording && (
                <div className="space-y-4">
                  <WaveformPlayer
                    audioUrl={fullCall.artifact!.stereoRecordingUrl}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {hasTranscript && (
                <div className="mt-4 space-y-2">
                  {fullCall
                    .artifact!.transcript.split("\n")
                    .map((line: string, index: number) => (
                      <p key={index} className="text-sm">
                        {line}
                      </p>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div>
              This call seems to have not happened. There is no audio and you
              were not charged for the call.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
