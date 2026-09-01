import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole, ArrowRight, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import { useUpdatePasswordMutation } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice.js";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Za-z]/, "Password must contain at least one letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),

    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const { theme } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const email = location.state?.email;
  const reset_token = location.state?.reset_token;
  const [updatePassword] = useUpdatePasswordMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await updatePassword({
        email,
        reset_token,
        new_password: data.password,
        confirm_password: data.confirmPassword,
      }).unwrap();

      dispatch(
        setCredentials({
          access_token: response.access_token,
          user: response.user,
          rememberMe: true,
        })
      );

      alert(response?.message || "Password updated successfully!");
      navigate("/");
    } catch (error) {
      alert(error?.data?.message || "Failed to update password.");
    }
  };

  return (
    <main className="min-h-screen bg-paper-1 flex items-center justify-center sm:px-4 lg:px-8 xl:px-12 py-8 mt-15">

      <div className="w-full max-w-md">

        <div className="rounded-3xl border border-muted/20 bg-paper-2/20 sm:px-4 md:px-8 py-6 lg:p-12 shadow-[0_20px_60px_color-mix(in_srgb,var(--muted)_8%,transparent)]">

          <div className="text-center">

            <div className="mx-auto size-14 sm:size-16 rounded-2xl bg-muted/10 border border-muted/20 flex items-center justify-center">
              <LockKeyhole className="size-7 sm:size-8 text-muted" />
            </div>

            <h1 className="mt-5 text-2xl sm:text-3xl font-primary font-bold text-primary">
              Reset your password
            </h1>

            <p className="mt-2 text-sm sm:text-base text-secondary font-secondary leading-relaxed">
              Create a new password to secure your PlantDx account.
            </p>

          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">

            {/* New Password */}
            <div className="flex flex-col gap-2">

              <label className="text-sm font-semibold text-primary font-primary">
                New password
              </label>

              <div className="relative">

                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("password")}
                  className={`w-full h-12 rounded-xl border ${errors.password ? "border-red-500" : "border-muted/25"} bg-paper-2/20 pl-10 pr-11 text-sm text-primary placeholder:text-secondary/60 outline-none transition focus:ring-2 focus:ring-muted/15 font-secondary`}
                />

                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-muted cursor-pointer">
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>

              </div>

              {errors.password ? (
                <p className="text-xs text-red-500 font-secondary">
                  {errors.password.message}
                </p>
              ) : (
                <p className="text-xs text-secondary font-secondary">
                  Use at least 8 characters with a combination of letters and numbers.
                </p>
              )}

            </div>


            {/* Confirm Password */}
            <div className="flex flex-col gap-2">

              <label className="text-sm font-semibold text-primary font-primary">
                Confirm new password
              </label>

              <div className="relative">

                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...register("confirmPassword")}
                  className={`w-full h-12 rounded-xl border ${errors.confirmPassword ? "border-red-500" : "border-muted/25"} bg-paper-2/20 pl-10 pr-11 text-sm text-primary placeholder:text-secondary/60 outline-none transition focus:ring-2 focus:ring-muted/15 font-secondary`}
                />

                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-muted cursor-pointer">
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>

              </div>

              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-secondary">
                  {errors.confirmPassword.message}
                </p>
              )}

            </div>


            {/* Security Notice */}
            <div className="flex items-start gap-3 rounded-2xl border border-muted/15 bg-muted/5 p-4">

              <ShieldCheck className="size-5 shrink-0 text-muted mt-0.5" />

              <p className="text-xs sm:text-sm leading-relaxed text-secondary font-secondary">
                Your password will be securely updated after verification.
              </p>

            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 rounded-xl bg-muted ${theme === "light" ? "text-white" : "text-paper-1"} flex items-center justify-center gap-2 font-primary font-semibold cursor-pointer transition-all duration-300 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_25px_color-mix(in_srgb,var(--muted)_25%,transparent)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
            >
              {isSubmitting ? "Updating..." : "Reset Password"}

              {!isSubmitting && <ArrowRight className="size-4" />}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}