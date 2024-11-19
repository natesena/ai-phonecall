"use client";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={"flex-1 pt-[var(--navbar-height)]"}>{children}</main>
    </div>
  );
}
