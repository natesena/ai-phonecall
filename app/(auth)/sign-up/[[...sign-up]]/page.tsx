"use client";
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
import PageWrapper from "@/components/wrapper/page-wrapper";
import { supabase } from "@/utils/supabase";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      phone: phoneNo,
      password,
    });

    if (error) {
      toast({ variant: "destructive", title: error.message });
      return;
    }

    await supabase
      .from("user")
      .insert({ first_name: name, email: email, id: data?.user?.id });

    router.replace("/sign-in");
  };

  return (
    <PageWrapper>
      <Card className="w-full max-w-sm mt-20">
        <CardHeader>
          <CardTitle className="text-2xl">Register Account</CardTitle>
          <CardDescription>
            Enter your details below to register new account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            <Label htmlFor="email">Phone No</Label>
            <Input
              id="phonono"
              type="text"
              placeholder="15556664444"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
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
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </Button>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
