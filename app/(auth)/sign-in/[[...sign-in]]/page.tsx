"use client";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
console.log(result)
    setLoading(false);

    if (result?.error) {
      toast({ variant: "destructive", title: result.error });
    } else {
      router.replace("/");
    }
  };
  return (
    <PageWrapper>
      <Card className="w-full border border-white max-w-sm mt-20 mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your details below to login</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-white text-black"
            onClick={() => router.push("/sign-up")}
          >
            Create account
          </Button>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
