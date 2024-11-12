import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

const Waveform = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#A8DBA8",
      progressColor: "#3B8686",
      cursorColor: "#3B8686",
      barWidth: 3,
      barRadius: 3,
      responsive: true,
      height: 150,
      normalize: true,
      partialRender: true,
    });

    wavesurfer.load(audioUrl);

    wavesurfer.on("ready", () => {
      wavesurferRef.current = wavesurfer;
    });

    return () => wavesurfer.destroy();
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <Button
          onClick={handlePlayPause}
          variant="outline"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <div ref={waveformRef} className="flex-grow" />
      </div>
    </div>
  );
};

export default Waveform;
