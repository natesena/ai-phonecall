import { AccordionComponent } from "@/components/homepage/accordion-component";
import HeroSection from "@/components/homepage/hero-section";
import Pricing from "@/components/homepage/pricing";
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";

export default function Home() {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
        <HeroSection />
      </div>
      {config.auth.enabled && config.payments.enabled && (
        <div>
          <Pricing />
        </div>
      )}
      <div className="flex justify-center items-center w-full my-[8rem]">
        <AccordionComponent />
      </div>
    </PageWrapper>
  );
}
