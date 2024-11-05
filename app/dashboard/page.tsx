import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  return (
    <div className="flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4">
      <div className="grid md:grid-cols-2 sm:grid-cols-1 w-full gap-3"></div>
    </div>
  );
}
