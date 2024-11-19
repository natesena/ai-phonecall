"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MobileHowTo } from "./mobile";
import { DesktopHowTo } from "./desktop";

const steps = [
  {
    title: "Step 1",
    description: "Purchase call credits from our pricing plans",
    icon: "🎅",
  },
  {
    title: "Step 2",
    description: "Call our special Santa hotline number",
    icon: "📞",
  },
  {
    title: "Step 3",
    description: "Talk with Santa and share your magical moment!",
    icon: "✨",
  },
];

export default function HowTo() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        How It Works
      </h2>

      {/* Mobile Carousel */}
      <MobileHowTo steps={steps} />
      {/* Desktop Layout */}
      <DesktopHowTo steps={steps} />
    </div>
  );
}