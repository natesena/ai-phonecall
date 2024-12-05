import { AccordionComponent } from "@/components/homepage/accordion-component";
import HeroSection from "@/components/homepage/hero-section";
import Pricing from "@/components/pricing/pricing";
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import SnowScene from "@/components/homepage/three/snowScene";
import AudioPlayer from "@/components/homepage/audio-player";
import HowTo from "@/components/homepage/howto/howto";
import ReviewCarousel from "@/components/homepage/reviews/reviewCarousel";
import Sleigh from "@/components/homepage/decoration/sleigh";
import CallNow from "@/components/homepage/call-now/call-now";
import { YouTubeSection } from "@/components/homepage/youtube/youtube";
// import CallCount from "@/components/homepage/call-count/call-count";

import Image from "next/image";
export default async function Home() {
  return (
    <PageWrapper showFooter={true}>
      <div className="fixed bottom-4 right-4 z-50">
        <AudioPlayer />
      </div>
      <div className="home-page-container">
        <div className="relative">
          <div className="threejs-container absolute inset-0 z-0">
            <SnowScene />
          </div>
          <div className="home-page-section relative z-10 min-h-[calc(100vh-var(--navbar-height))]">
            {/* in the below DIV,on mobile just the hero section and pricing section in one height, on desktop they are separate */}
            <div className="sm:min-h-0">
              <div className="hero-section-container flex flex-col justify-center items-center w-full p-3">
                <HeroSection />
              </div>
              <div className="flex flex-col justify-center items-center w-full mt-[1rem] sm:mt-[3rem]">
                <YouTubeSection />
              </div>

              {/* <div className="pricing-section-container flex flex-col justify-center items-center w-full mt-[1rem] sm:mt-[3rem]">
                <Pricing />
              </div> */}
            </div>
            <div className="call-counter flex flex-col justify-center items-center max-w-full relative overflow-x-clip">
              <div className="relative z-20">
                <CallNow />
              </div>
              <div className="sleigh-component-container absolute transform -translate-x-[25%] translate-y-[-50%] sleigh-diagonal z-10">
                <Sleigh />
              </div>
              {/* <CallCount /> */}
            </div>
            <div className="flex flex-col justify-center items-center w-full mt-[1rem] sm:mt-[3rem]">
              <ReviewCarousel />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full p-3 my-[5rem] sm:my-[7rem]">
          <HowTo />
        </div>
        <div>
          <Pricing />
        </div>
        <div className="relative bg-[#7F0000] faq-section flex justify-center items-center w-full">
          <AccordionComponent />
        </div>
      </div>
    </PageWrapper>
  );
}
