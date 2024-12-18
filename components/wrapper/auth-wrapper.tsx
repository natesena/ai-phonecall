"use client";
import { ReactNode } from "react";
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
        {children}
    </SessionProvider>
  );
};

export default AuthWrapper;
