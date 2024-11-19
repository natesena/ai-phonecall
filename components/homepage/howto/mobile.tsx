import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface MobileHowToProps {
  steps: Step[];
}

export function MobileHowTo({ steps }: MobileHowToProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  return (
    <div className="md:hidden">
      <div className="relative flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0"
          onClick={prevStep}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="text-center px-12">
          <div className="text-4xl mb-4">{steps[currentStep].icon}</div>
          <h3 className="text-xl font-semibold mb-2">
            {steps[currentStep].title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {steps[currentStep].description}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0"
          onClick={nextStep}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentStep ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
