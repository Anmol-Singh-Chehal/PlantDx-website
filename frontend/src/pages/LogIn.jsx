import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, ArrowRight, Mail, LockKeyhole } from "lucide-react";
import { Input } from "@/components/ui/input";
import googleIcon from "@/assets/googleIcon.png";
import facebookIcon from "@/assets/facebookIcon.png";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/api.js";
import { setCredentials } from "@/features/auth/authSlice.js";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean(),
});

export default function LogIn() {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap();

      console.log("Login successful:", result);

      dispatch(
        setCredentials({
          access_token: result.access_token,
          user: result.user,
          rememberMe: data.rememberMe,
        })
      );

      navigate("/");

    } catch (error) {
      console.error("Login failed:", error);

      alert(
        error?.data?.detail ||
        "Unable to login. Please check your email and password."
      );
    }
  };

  return (
    <main className="min-h-screen bg-paper-1 flex items-center justify-center sm:px-4 lg:px-8 xl:px-12 sm:mt-15">

      <div className="w-full max-w-6xl min-h-155 lg:grid lg:grid-cols-2 rounded-3xl overflow-hidden bg-paper-1 border border-muted/20 shadow-[0_15px_60px_color-mix(in_srgb,var(--muted)_12%,transparent)]">

        <div className={`hidden lg:flex relative ${theme === "light" ? "bg-teal-900" : "bg-paper-2"} overflow-hidden`}>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_srgb,var(--muted)_28%,transparent),transparent_45%)]"></div>

          <div className="absolute -left-28 -bottom-28 size-96 rounded-full border border-muted/15"></div>
          <div className="absolute -left-12 -bottom-12 size-64 rounded-full border border-muted/15"></div>

          <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14">

            <div className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-muted/15 border border-muted/30 flex items-center justify-center">
                <ShieldCheck className="size-5 text-muted" />
              </div>

              <span className="text-white text-xl font-semibold font-primary">
                PlantDx
              </span>
            </div>

            <div className="max-w-md">

              <span className="inline-flex items-center gap-2 rounded-full border border-muted/30 bg-muted/10 px-3 py-1.5 text-sm text-muted font-secondary">
                <span className="size-1.5 rounded-full bg-muted"></span>
                Secure leaf classification platform
              </span>

              <h1 className="mt-6 text-4xl xl:text-5xl font-semibold leading-tight text-white font-primary">
                Welcome
                <span className="block text-muted">back.</span>
              </h1>

              <p className="mt-5 text-sm xl:text-base leading-relaxed text-white/65 font-secondary">
                Sign in to access your leaf classification workspace and
                continue exploring AI-powered analysis for Mango,
                Cherry, Grape, Apple, and other fruit leaves.
              </p>

            </div>

            <div className="flex items-center gap-3 text-white/45 text-xs font-secondary">
              <ShieldCheck className="size-4 text-muted" />
              Your connection is protected.
            </div>

          </div>
        </div>

        <div className="flex items-center justify-center bg-paper-1 sm:px-4 md:px-8 py-12 lg:p-12">

          <div className="w-full max-w-lg">

            <div className="mb-8">

              <p className="text-xs uppercase tracking-[0.18em] text-muted font-secondary font-semibold">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl sm:text-2xl font-semibold text-primary font-primary">
                Log in to your account
              </h2>

              <p className="mt-2 text-sm text-secondary font-secondary">
                Don't have an account?{" "}
                <NavLink to="/signup" className="font-semibold text-muted hover:underline">
                  Sign up
                </NavLink>
              </p>

            </div>


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="flex flex-col gap-2">

                <label className="text-sm font-semibold text-primary font-primary">
                  Email address
                </label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary" />

                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={`w-full h-12 rounded-xl border ${errors.email ? "border-red-500" : "border-muted/25"} bg-paper-2/20 pl-10 pr-4 text-sm text-primary placeholder:text-secondary/60 outline-none transition focus:border-muted focus:ring-2 focus:ring-muted/15 font-secondary`}
                  />

                </div>

                {errors.email && (
                  <p className="text-xs text-red-500 font-secondary">
                    {errors.email.message}
                  </p>
                )}

              </div>

              <div className="flex flex-col gap-2">

                <div className="flex justify-between items-center">

                  <label className="text-sm font-semibold text-primary font-primary">
                    Password
                  </label>

                  <NavLink to="/forgot-password" className="text-xs font-medium text-muted hover:underline font-secondary">
                    Forgot password?
                  </NavLink>

                </div>

                <div className="relative">

                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`w-full h-12 rounded-xl border ${errors.password ? "border-red-500" : "border-muted/25"} bg-paper-2/20 pl-10 pr-11 text-sm text-primary placeholder:text-secondary/60 outline-none transition focus:border-muted focus:ring-2 focus:ring-muted/15 font-secondary`}
                  />

                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-muted cursor-pointer">

                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}

                  </button>

                </div>

                {errors.password && (
                  <p className="text-xs text-red-500 font-secondary">
                    {errors.password.message}
                  </p>
                )}

              </div>

              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="size-4 accent-muted cursor-pointer"
                />

                <span className="text-xs text-secondary font-secondary">
                  Remember me
                </span>

              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 rounded-xl bg-muted ${theme === "light" ? "text-white" : "text-paper-1"} flex items-center justify-center gap-2 font-primary font-semibold cursor-pointer transition-all duration-300 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_25px_color-mix(in_srgb,var(--muted)_25%,transparent)] disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isLoading ? "Logging in..." : "Log In"}

                {!isLoading && <ArrowRight className="size-4" />}

              </button>

            </form>


            {/* Divider */}
            <div className="flex items-center gap-3 my-7">

              <div className="h-px flex-1 bg-muted/20"></div>

            </div>


            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-secondary font-secondary">
              <ShieldCheck className="size-4 text-muted" />
              Secure access to your PlantDx workspace
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}