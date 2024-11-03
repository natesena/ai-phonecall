import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { BorderBeam } from "../magicui/border-beam";
import { Button } from "../ui/button";
import Image from "next/image";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";

export default function HeroSection() {
  return (
    <section
      className="flex flex-col items-center justify-center leading-6 mt-[3rem]"
      aria-label="Nextjs Starter Kit Hero"
    >
      <h1
        className={`${TITLE_TAILWIND_CLASS} scroll-m-20 font-semibold tracking-tight text-center max-w-[1120px] bg-gradient-to-b dark:text-white`}
      >
        1800Santa
      </h1>
      <p className="mx-auto max-w-[700px] text-gray-500 text-center mt-2 dark:text-gray-400">
        The Ultimate Nextjs 14 Starter Kit for quickly building your SaaS,
        giving you time to focus on what really matters
      </p>
      <div className="flex justify-center items-center gap-3">...links</div>
      <div>
        <div className="relative flex max-w-6xl justify-center overflow-hidden mt-7">
          <div className="relative rounded-xl">
            <BorderBeam size={250} duration={12} delay={9} />
          </div>
        </div>
      </div>
    </section>
  );
}
