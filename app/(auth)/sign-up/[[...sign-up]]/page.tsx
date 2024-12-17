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
import { toast } from "sonner";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Link from "next/link";

const SignInSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  name: Yup.string().required('Name is required'),
  phoneNo: Yup.string().required('Phone Number is required'),
});
type SchemaType = Yup.InferType<typeof SignInSchema>;
export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    handleBlur,
    values,
    isSubmitting,
    setFieldValue,
  } = useFormik<SchemaType>({
    validationSchema: SignInSchema,
    initialValues: {
      email: '',
      password: '',
      name: '',
      phoneNo: '',
    },
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name,
              phone: values.phoneNo,
            }
          }
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        if (data.user) {
          toast.success("Account created successfully!");
          const res = await supabase
          .from("user")
          .insert({ first_name: values.name, email: values.email, id: data?.user?.id, phone: values.phoneNo, isPhoneVerified: false });
         
          router.push("/sign-in");
        }
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
          <Image src="/images/homepage/santa.avif" width={100} height={100} alt="santa icon" className="w-16 h-16 mx-auto"/>
          <CardTitle className="text-xl">Register Account</CardTitle>
          <CardDescription>
            Enter your details below to register new account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4 border border-white text-gray-500">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter your name"
              required
              onBlur={handleBlur}
              value={values.name}
              onChange={(e) => setFieldValue("name", e.target.value)}
              className="w-full bg-white border border-gray-300"
            />
          </div>

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
            <Label>Phone Number</Label>
            <Input
              type="tel"
              placeholder="Enter your phone number"
              required
              onBlur={handleBlur}
              value={values.phoneNo}
              onChange={(e) => setFieldValue("phoneNo", e.target.value)}
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
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex py-2 flex-col gap-3 bg-gray-200">
          <h1 className="w-full bg-transparent py-3 text-sm text-center text-gray-500 font-[400]">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold ml-2">
              Sign In
            </Link>
          </h1>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}
