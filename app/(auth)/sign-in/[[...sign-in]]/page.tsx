"use client";
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  if (!config?.auth?.enabled) {
    router.back();
  }

  return (
    <PageWrapper>
      <div className="flex min-w-screen justify-center pt-16">
        <SignIn
          fallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/dashboard"
        />
      </div>
    </PageWrapper>
  );
}
