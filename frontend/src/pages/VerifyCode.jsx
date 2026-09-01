import React, { useState } from "react";
import { ArrowRight, Pencil } from "lucide-react";
import { useTheme } from "next-themes";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { useVerifyCodeMutation } from "@/services/api";
import { useLocation } from "react-router-dom";

export default function VerifyCode() {
  const { theme } = useTheme();
  const [code, setCode] = useState("");
  const [verifyCode] = useVerifyCodeMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;

    try {
      const response = await verifyCode({
        email,
        code,
      }).unwrap();

      alert(response?.message || "Code verified successfully!");

      navigate("/update-password", {
        state: {
          email,
          reset_token: response.reset_token,
        },
      });
    } catch (error) {
      alert(error?.data?.message || "Invalid verification code.");
    }
  };

  return (
    <main className="min-h-screen bg-paper-1 flex items-center justify-center sm:px-4 lg:px-8 xl:px-12 py-8">
      <section className="w-full max-w-2xl rounded-3xl border border-muted/20 bg-paper-2/20 p-6 sm:px-4 md:px-8 py-6 lg:p-12 shadow-[0_20px_60px_color-mix(in_srgb,var(--muted)_8%,transparent)]">

        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted text-xs sm:text-sm font-secondary uppercase tracking-wide font-semibold">
            Check your inbox
          </div>

          <h1 className="mt-4 text-3xl sm:text-2xl font-primary font-bold text-primary">
            Verify your email
          </h1>

          <p className="mt-3 text-sm sm:text-base text-secondary font-secondary leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-muted">
              d....l@example.com
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="flex justify-center sm:py-2 md:py-5">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className="size-11 sm:size-10 md:size-14 border-muted/40 bg-paper-1/60 text-primary text-lg sm:text-xl font-primary first:rounded-l-xl" />
                <InputOTPSlot index={1} className="size-11 sm:size-10 md:size-14 border-muted/40 bg-paper-1/60 text-primary text-lg sm:text-xl font-primary" />
                <InputOTPSlot index={2} className="size-11 sm:size-10 md:size-14 border-muted/40 bg-paper-1/60 text-primary text-lg sm:text-xl font-primary" />
                <InputOTPSlot index={3} className="size-11 sm:size-10 md:size-14 border-muted/40 bg-paper-1/60 text-primary text-lg sm:text-xl font-primary" />
                <InputOTPSlot index={4} className="size-11 sm:size-10 md:size-14 border-muted/40 bg-paper-1/60 text-primary text-lg sm:text-xl font-primary" />
                <InputOTPSlot index={5} className="size-11 sm:size-10 md:size-14 border-muted/40 bg-paper-1/60 text-primary text-lg sm:text-xl font-primary last:rounded-r-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <button type="submit" disabled={code.length !== 6} className={`mt-5 w-full h-12 rounded-xl bg-muted ${theme === "light" ? "text-white" : "text-paper-1"} flex items-center justify-center gap-2 font-primary font-semibold cursor-pointer transition-all duration-300 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-[0_8px_25px_color-mix(in_srgb,var(--muted)_25%,transparent)]`}>
            Verify Code
            <ArrowRight className="size-4" />
          </button>

        </form>

        <div className="mt-8 flex flex-col items-center gap-6 text-sm sm:text-base font-secondary">

          <p className="text-secondary">
            Didn't get it?{" "}
            <button type="button" className="text-muted font-semibold hover:underline cursor-pointer">
              Resend code
            </button>{" "}
            <span>in 0:60</span>
          </p>

          <button type="button" className="flex items-center gap-2 text-secondary hover:text-muted transition-colors cursor-pointer">
            Wrong email?
            <span className="text-muted font-semibold flex items-center gap-1">
              <Pencil className="size-3.5" />
              Edit it
            </span>
          </button>

        </div>

      </section>
    </main>
  );
}