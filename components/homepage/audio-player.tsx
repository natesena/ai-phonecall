"use client";
import { useEffect, useRef } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Try to play as soon as possible
    const playAudio = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
        }
      } catch (err) {
        console.log("Autoplay failed:", err);
      }
    };

    playAudio();
  }, []);

  return (
    <audio
      ref={audioRef}
      controls
      autoPlay
      preload="auto"
      className="fixed bottom-4 right-4 z-50"
    >
      <source src="/audio/sleigh-bells.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}
