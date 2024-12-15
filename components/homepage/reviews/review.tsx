import Image from "next/image";
import { cn } from "@/lib/utils";

interface ReviewProps {
  reviewerName: string;
  reviewerImage: string;
  rating: string;
  reviewText: string;
  decoration: string;
}

export default function Review({
  reviewerName,
  reviewerImage,
  rating,
  reviewText,
  decoration,
}: ReviewProps) {
  return (
    <div className="relative bg-white rounded-lg p-6 shadow-lg w-full max-w-[280px] sm:max-w-[400px] my-4">
      <span
        className="absolute -left-2 -top-2 text-4xl animate-bounce"
        aria-hidden="true"
      >
        {decoration}
      </span>

      <span
        className="absolute -right-2 -bottom-2 text-4xl animate-bounce"
        aria-hidden="true"
      >
        {decoration}
      </span>

      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 mr-4">
          <Image
            src={reviewerImage}
            alt={`${reviewerName}'s profile picture`}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{reviewerName}</h3>
          <div className="flex space-x-1">
            <span className="text-2xl">{rating}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-600">{reviewText}</p>
    </div>
  );
}
