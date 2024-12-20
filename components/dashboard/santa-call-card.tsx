import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";

interface SantaCallCardProps {
  phoneNumber: string;
}

export function SantaCallCard({ phoneNumber }: SantaCallCardProps) {
  return (
    <Card className="bg-gradient-to-b from-red-600 to-red-800 border-2 border-gold-300 shadow-xl">
      <CardContent className="pt-4 pb-6 px-4 sm:pt-6 sm:pb-8 sm:px-6">
        <div className="text-center space-y-4 sm:space-y-6">
          <h2 className="lobster-regular text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4 animate-bounce">
            🎅 Ready to Talk with Santa? 🎄
          </h2>
          <p className="lobster-regular text-white text-lg sm:text-xl mb-2 sm:mb-4">
            Call Santa at:
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mx-auto max-w-md border-2 border-gold-200">
            <a
              href={`tel:${phoneNumber}`}
              className="flex flex-col items-center gap-2 sm:gap-3 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-green-500 p-2 sm:p-3 rounded-full">
                <Phone className="text-white w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
              </div>
              <p className="font-mono text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-300 to-green-500 text-transparent bg-clip-text tracking-wider">
                {phoneNumber}
              </p>
            </a>
          </div>
          <p className="lobster-regular text-gold-200 text-base sm:text-lg mt-2 sm:mt-4 text-white">
            ✨ Santa&apos;s Waiting ! ✨
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
