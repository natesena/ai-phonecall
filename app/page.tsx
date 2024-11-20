import { AccordionComponent } from "@/components/homepage/accordion-component";
import HeroSection from "@/components/homepage/hero-section";
import Pricing from "@/components/homepage/pricing";
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import SnowScene from "@/components/homepage/three/snowScene";
import AudioPlayer from "@/components/homepage/audio-player";
import HowTo from "@/components/homepage/howto/howto";
export default function Home() {
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
            <div className="hero-section-container flex flex-col justify-center items-center w-full p-3">
              <HeroSection />
            </div>
            <div className="pricing-section-container flex flex-col justify-center items-center w-full mt-[1rem] sm:mt-[3rem]">
              <Pricing />
            </div>
            <div className="flex flex-col justify-center items-center w-full mt-[1rem] sm:mt-[3rem]">
              <p className="lobster-regular text-center text-5xl text-white">
                1,000,000 calls and counting!
              </p>
            </div>
            <div className="flex flex-col justify-center items-center w-full mt-[1rem] sm:mt-[3rem]">
              <p className="text-center text-5xl text-white">
                Reviews, reviews, reviews
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full p-3">
          <HowTo />
        </div>
        <div className="relative bg-[#840000] faq-section flex justify-center items-center w-full">
          <AccordionComponent />
        </div>
      </div>
    </PageWrapper>
  );
}
