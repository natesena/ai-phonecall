import { ChevronDown, Phone, Play, Pause } from "lucide-react";
import { useState, useRef } from "react";
import WaveformPlayer from "./WaveformPlayer";
import { formatDistance, differenceInSeconds, parseISO } from "date-fns";

interface CallLogProps {
  call: any;
}

export default function CallLog({ call }: CallLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Approach 1: Get duration in seconds
  const durationInSeconds = differenceInSeconds(
    parseISO(call.endedAt),
    parseISO(call.startedAt)
  );

  // Format seconds into mm:ss
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Approach 2: Get human readable distance
  const duration = formatDistance(
    parseISO(call.startedAt),
    parseISO(call.endedAt),
    { includeSeconds: true }
  );

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
            <Phone className="h-4 w-4 text-gray-600" />
          </div>
          <span className="text-sm text-gray-500">{call.customer?.number}</span>
          <span className="font-medium">
            Duration: {formatDuration(durationInSeconds)}
          </span>
          <span className="text-sm text-gray-500">({duration})</span>
        </div>

        <ChevronDown
          className={`h-5 w-5 cursor-pointer transition-transform duration-200 ${
            isExpanded ? "transform rotate-180" : ""
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>

      {/* Dropdown Content */}
      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
          {/* Audio Player */}
          <WaveformPlayer audioUrl={call.artifact.stereoRecordingUrl} />
          <pre className="whitespace-pre-wrap break-words text-sm">
            {JSON.stringify(call, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
