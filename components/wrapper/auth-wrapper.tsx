"use client";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import config from "@/config";
import { SessionProvider } from "next-auth/react";

interface AuthWrapperProps {
  children: ReactNode;
  session: any;
}

const AuthWrapper = ({ children, session }: AuthWrapperProps) => {
  if (!config.auth.enabled) {
    return <>{children}</>;
  }

  return (
    <SessionProvider session={session}>
      <ClerkProvider dynamic>{children}</ClerkProvider>
    </SessionProvider>
  );
};

export default AuthWrapper;
