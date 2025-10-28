import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import trpc from "@shared/config";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

type LoginStep = "email" | "otp" | "success";

function RouteComponent() {
  const { data: appVer, error: versionError } = trpc.version.useQuery();
  console.log(appVer, versionError);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState<LoginStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        setError(error.message || "Failed to send OTP");
        console.error(error);
      } else if (data) {
        console.log("OTP sent successfully:", data);
        setCurrentStep("otp");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOTP() {
    if (!email || !otp || otp.length !== 6) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (error) {
        setError(error.message || "Invalid OTP");
        console.error(error);
      } else if (data) {
        console.log("OTP verified successfully:", data);
        navigate({ to: "/app" });
        // Here you might want to redirect or update auth state
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleBackToEmail() {
    setCurrentStep("email");
    setOtp("");
    setError(null);
  }

  function handleResendOTP() {
    handleSendOTP(new Event("submit") as unknown as React.FormEvent);
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 max-w-sm">
          {currentStep === "email" && (
            <form onSubmit={handleSendOTP}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md">
                      <GalleryVerticalEnd className="size-6" />
                    </div>
                    <span className="sr-only">Your App</span>
                  </a>
                  <h1 className="text-xl font-bold">Welcome to Your App</h1>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-600 text-center">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Login Code"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {currentStep === "otp" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Your App</span>
                </a>
                <h1 className="text-xl font-bold">Enter Verification Code</h1>
                <div className="text-center text-sm">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium">{email}</span>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3 justify-center">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value: string) => setOtp(value)}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                {error && (
                  <div className="text-sm text-red-600 text-center">
                    {error}
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleVerifyOTP}
                    className="w-full"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleBackToEmail}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleResendOTP}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Resend Code"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "success" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Your App</span>
                </a>
                <h1 className="text-xl font-bold">Welcome Back!</h1>
                <div className="text-center text-sm">
                  You have successfully logged in.
                </div>
              </div>
              <Button className="w-full">Continue to Dashboard</Button>
            </div>
          )}

          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
