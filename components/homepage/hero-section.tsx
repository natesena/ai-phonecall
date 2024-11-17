import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { BorderBeam } from "../magicui/border-beam";
import { Button } from "../ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="flex flex-col items-center justify-center leading-6 mt-[3rem]"
      aria-label="Nextjs Starter Kit Hero"
    >
      <h1
        className={`hero-title lobster-regular text-7xl scroll-m-20 font-semibold tracking-tight text-center max-w-[1120px] bg-gradient-to-b text-white`}
      >
        1800Santa
      </h1>
      <p className="lobster-regular text-2xl text-white">
        You call, Santa Answers!
      </p>
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
