"use client";

import { useState } from "react";
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
import { supabase } from "@/utils/supabase";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { signIn } from "next-auth/react";
const SignInSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

type SchemaType = Yup.InferType<typeof SignInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    handleBlur,
    values,
    setFieldValue,
    isSubmitting,
  } = useFormik<SchemaType>({
    validationSchema: SignInSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          throw new Error(result.error);
        }
          toast.success("Signed in successfully!");
          router.push("/");
          router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageWrapper>
      <Card className="w-full mx-auto bg-white overflow-hidden text-black max-w-sm mt-20">
        <CardHeader className="flex flex-col justify-center items-center">
          <Image
            src="/images/homepage/santa.avif"
            width={100}
            height={100}
            alt="Santa icon"
            className="w-16 h-16 mx-auto"
          />
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>Enter your details below to login.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="pt-4">
          <CardContent className="grid gap-4 text-gray-500">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                required
                onBlur={handleBlur}
                value={values.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
                className="w-full bg-white border border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                required
                onBlur={handleBlur}
                value={values.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
                className="w-full bg-white border border-gray-300"
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-neutral-700 hover:bg-neutral-800 py-1 text-white"
              disabled={isSubmitting || loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex py-2 flex-col gap-3 bg-gray-200">
          <h1 className="w-full bg-transparent py-3 text-sm text-center text-gray-500 font-[400]">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold ml-2">
              Sign Up
            </Link>
          </h1>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
