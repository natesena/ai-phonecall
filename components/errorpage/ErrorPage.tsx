import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ErrorPageProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export default function ErrorPage({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  showHomeButton = true,
}: ErrorPageProps) {
  return (
    <div className="container mx-auto max-w-4xl min-h-[50vh] flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-100">{title}</h1>
          <p className="text-gray-400">{message}</p>
        </div>

        {showHomeButton && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
          >
            <HomeIcon className="h-5 w-5 text-black" />
            <span className="text-black">Return Home</span>
          </Link>
        )}
      </div>
    </div>
  );
}
