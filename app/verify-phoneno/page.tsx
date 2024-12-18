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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useUser } from "@/hooks/use-user";
import PageWrapper from "@/components/wrapper/page-wrapper";
import Image from "next/image";
const VerifyPhoneNO = () => {
  const [otpValue, setOtpValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { user, getUser } = useUser();

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      sendOTP();
    }
  }, []);

  const sendOTP = async () => {
    try {
      if (user?.phoneNo?.isVerified) {
        return router.push("/");
      }

      setLoading(true);

      const response = await fetch("/api/verify-phoneno/send-otp");
      const data = await response.json();

      if (response.ok && data?.sent) {
        toast.success("OTP sent successfully");
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpValue) {
      return toast.info("Please enter the OTP");
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/verify-phoneno/verify-otp?otp=${otpValue}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      if (data?.verified) {
        toast.success("OTP verified successfully");
        router.push("/");
        getUser();
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
    <div className="w-full mx-auto overflow-hidden text-black max-w-sm mt-20">
      <div className="w-full max-w-sm">
      <Card className="w-full mx-auto bg-white overflow-hidden text-black max-w-sm mt-20">
      <CardHeader className="flex flex-col justify-center items-center">
          <Image
            src="/images/homepage/santa.avif"
            width={100}
            height={100}
            alt="Santa icon"
            className="w-16 h-16 mx-auto"
          />
          <CardTitle className="text-xl">Verify Phone Number</CardTitle>
          <CardDescription>Enter the OTP sent to your phone number.</CardDescription>
        </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-center space-y-2">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value: any) => setOtpValue(value)}
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-4 bg-neutral-700 hover:bg-neutral-800 py-1 text-white" onClick={verifyOTP} disabled={loading}>
              {loading ? "Loading..." : "Verify"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
    </PageWrapper>
  );
};
export default VerifyPhoneNO;
