import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckItem } from "./check-item";

type PricingCardProps = {
  user: any;
  handleCheckout: any;
  price: number;
  title: string;
  description: string;
  features: string[];
  actionLabel: string;
  priceId: string;
};

export default function PricingCard({
  user,
  handleCheckout,
  price,
  title,
  description,
  features,
  actionLabel,
  priceId,
}: PricingCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!user?.id) {
      router.push(
        `/sign-up?redirect=checkout&price=${price}&priceId=${priceId}`
      );
      return;
    }

    handleCheckout(price, priceId);
  };

  return (
    <div className="relative">
      <div className="shiny-border rounded-lg p-[20px]">
        <Card className="pricing w-72 flex flex-col justify-between py-1 mx-auto sm:mx-0 bg-white dark:bg-zinc-900">
          <div>
            <CardHeader className="pb-8 pt-4">
              <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
                {title}
              </CardTitle>

              <div className="flex items-baseline gap-0.5">
                <span className="text-4xl font-bold">$</span>
                <span className="text-5xl font-bold">{price}</span>
              </div>
              <CardDescription className="pt-1.5 h-12">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {features.map((feature: string) => (
                <CheckItem key={feature} text={feature} />
              ))}
            </CardContent>
          </div>
          <CardFooter className="mt-2">
            <Button
              onClick={handleClick}
              className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              type="button"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
              {actionLabel}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
