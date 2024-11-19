"use client";
import { useEffect, useRef } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Indicate that the audio component is loaded
    document.body.classList.add("audio-ready");

    const tryAutoplay = async () => {
      if (!audioRef.current) return;

      try {
        await audioRef.current.play();
      } catch (err) {
        console.log(
          "Autoplay failed. User interaction needed to start playback."
        );
      }
    };

    tryAutoplay();

    return () => {
      // Cleanup class on unmount
      document.body.classList.remove("audio-ready");
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      controls
      autoPlay
      preload="auto"
      className="z-50"
      onPlay={() => console.log("Audio is playing")} // For debugging
    >
      <source src="/audio/sleigh-bells.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}
