"use client";

import Review from "./review";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewCarouselProps {
  delayTime?: number; // Time in milliseconds between auto-transitions
}

const emojiList = ["🎁", "⛄", "🎄", "🎅", "🍪", "🥛", "🦌", "☃️"];

const getImagePath = (imageName: string) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "/images/reviews/"
      : "https://storage.cloud.google.com/callsanta/images/review-headshots/";

  return `${baseUrl}${imageName}`;
};

const reviews = [
  {
    decoration: "🎁",
    reviewerName: "Sarah Johnson",
    reviewerImage: getImagePath("frosty.png"),
    rating: "🎁 🎁 🎁 🎁 🎁",
    reviewText:
      "Santa's call made my children's Christmas magical! The personalized experience was incredible.",
  },
  {
    decoration: "🎄",
    reviewerName: "Michael Chen",
    reviewerImage: getImagePath("gingerbread.png"),
    rating: "⭐ ⭐ ⭐ ⭐ ⭐",
    reviewText:
      "Worth every penny! My kids were absolutely thrilled to talk to Santa directly.",
  },
  {
    decoration: "🎁",
    reviewerName: "Emma Williams",
    reviewerImage: getImagePath("rudolph.png"),
    rating: "🍪 🥛 🍪 🥛 🍪",
    reviewText:
      "Such a wonderful Christmas tradition. Will definitely do this again next year!",
  },
];

export default function ReviewCarousel({
  delayTime = 5000,
}: ReviewCarouselProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
    }, delayTime);

    return () => clearInterval(timer);
  }, [delayTime, mounted]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Prevent flash of content during hydration
  if (!mounted) {
    return (
      <div className="relative w-full max-w-4xl mx-auto py-4">
        <div className="overflow-hidden">
          <div
            className="flex justify-center transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 flex justify-center px-4"
              >
                <Review {...review} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto py-4 px-4">
      <div className="overflow-hidden px-8">
        <div
          className="flex transition-transform duration-500 ease-in-out w-full"
          style={{
            transform: `translateX(-${(currentIndex / reviews.length) * 100}%)`,
            width: `${reviews.length * 100}%`,
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex justify-center"
              style={{ width: `${100 / reviews.length}%` }}
            >
              <Review {...review} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
        aria-label="Previous review"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
        aria-label="Next review"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      <div className="flex justify-center mt-4 space-x-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-red-600" : "bg-gray-300"
            }`}
            aria-label={`Go to review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
