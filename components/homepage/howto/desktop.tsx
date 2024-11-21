interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface DesktopHowToProps {
  steps: Step[];
}

export function DesktopHowTo({ steps }: DesktopHowToProps) {
  return (
    <div className="hidden md:grid md:grid-cols-3 md:gap-8">
      {steps.map((step, index) => (
        <div key={index} className="text-center p-6 rounded-lg bg-white">
          <div className="text-4xl mb-4">{step.icon}</div>
          <h3 className="text-xl font-semibold mb-2 dark:text-black">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-black">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
