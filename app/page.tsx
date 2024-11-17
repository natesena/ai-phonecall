import { AccordionComponent } from "@/components/homepage/accordion-component";
import HeroSection from "@/components/homepage/hero-section";
import Pricing from "@/components/homepage/pricing";
import PageWrapper from "@/components/wrapper/page-wrapper";
import TodoList from "@/components/homepage/todoList";
import config from "@/config";
import SnowScene from "@/components/homepage/three/snowScene";

export default function Home() {
  return (
    <PageWrapper>
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <SnowScene />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
            <HeroSection />
          </div>
          <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
            <p>A recording of a call, or a video of a call</p>
            <p>Buy a credit, call the phone number, share your call!</p>
          </div>

          {config.auth.enabled && config.payments.enabled && (
            <div>
              <Pricing />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center w-full my-[8rem]">
        <TodoList />
      </div>
      <div className="faq-section flex justify-center items-center w-full my-[8rem]">
        <AccordionComponent />
      </div>
    </PageWrapper>
  );
}
