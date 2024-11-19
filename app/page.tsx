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
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <SnowScene />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
            <HeroSection />
          </div>
          <div className="flex flex-col justify-center items-center w-full p-3">
            <HowTo />
          </div>
          <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
            <Pricing />
          </div>
        </div>
        <div>
          <AudioPlayer />
        </div>
      </div>
      <div className="faq-section flex justify-center items-center w-full my-[8rem]">
        <AccordionComponent />
      </div>
    </PageWrapper>
  );
}
