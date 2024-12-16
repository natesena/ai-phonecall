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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useUser } from "@/hooks/use-user";
import { useSession } from "next-auth/react";
const VerifyPhoneNO = () => {
  const [otpValue, setOtpValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { user, getUser } = useUser();

  const { toast } = useToast();
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
        toast({
          title: "OTP Sent",
          description: "An OTP has been sent to your phone number.",
        });
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "OTP Sent Failed",
        description: "Unable to send OTP. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpValue) {
      return toast({
        variant: "destructive",
        title: "Please enter OTP",
      });
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/verify-phoneno/verify-otp?otp=${otpValue}`
      );
      const data = await response.json();

      if (response.ok && data?.verified) {
        toast({ title: "OTP Verified" });

          router.push("/");
          getUser();
      } else {
        throw new Error("OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "OTP Verification Failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Verify Phone Number</CardTitle>
            <CardDescription>Enter the OTP sent to your phone number</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-center space-y-2">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
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
            <Button className="w-full" onClick={verifyOTP} disabled={loading}>
              {loading ? "Loading..." : "Verify"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyPhoneNO;
