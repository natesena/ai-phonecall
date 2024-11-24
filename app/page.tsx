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
import prisma from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";

async function getCallCount() {
  try {
    const count = await prisma.call.count();
    return count;
  } catch (error) {
    console.error("Failed to get call count:", error);
    return 1000000; // Fallback number
  }
}

export default async function Home() {
  const count = await getCallCount();

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
            <div className="min-h-[calc(100svh-var(--navbar-height))] sm:min-h-0">
              <div className="hero-section-container flex flex-col justify-center items-center w-full p-3">
                <HeroSection />
              </div>
              <div className="pricing-section-container flex flex-col justify-center items-center w-full mt-[1rem] sm:mt-[3rem]">
                <Pricing />
              </div>
            </div>
            <div className="call-counter flex flex-col justify-center items-center max-w-full relative overflow-x-clip">
              <div className="sleigh-component-container absolute transform -translate-x-[25%] translate-y-[50%] sleigh-diagonal">
                <Sleigh />
              </div>
              <p className="lobster-regular text-center text-5xl text-white mx-auto relative z-10 my-[1rem] sm:my-[7rem] px-4 mb-16">
                {formatNumber(count)} calls and counting!
              </p>
            </div>
            <div className="flex flex-col justify-center items-center w-full mt-[1rem] sm:mt-[3rem]">
              <ReviewCarousel />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full p-3 my-[5rem] sm:my-[7rem]">
          <HowTo />
        </div>
        <div className="relative bg-[#7F0000] faq-section flex justify-center items-center w-full">
          <AccordionComponent />
        </div>
      </div>
    </PageWrapper>
  );
}
