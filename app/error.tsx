"use client";

import ErrorPage from "@/components/errorpage/ErrorPage";
import PageWrapper from "@/components/wrapper/page-wrapper";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageWrapper>
      <ErrorPage />
    </PageWrapper>
  );
}
