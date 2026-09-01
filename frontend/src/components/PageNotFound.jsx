import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, ScanLine } from "lucide-react";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-paper-1 text-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        {/* Main Card */}
        <section className="relative overflow-hidden rounded-3xl border border-muted/20 bg-paper-2/20 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 text-center shadow-sm">

          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 size-64 rounded-full bg-muted/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-muted/10 blur-3xl pointer-events-none" />

          {/* Leaf Scan Icon */}
          <div className="relative mx-auto flex size-16 sm:size-20 items-center justify-center rounded-2xl border border-muted/20 bg-paper-1 shadow-sm">
            <ScanLine className="size-8 sm:size-10 text-muted" />
          </div>

          {/* 404 */}
          <div className="relative mt-7">
            <h1 className="font-primary text-[90px] leading-none font-bold tracking-tight text-muted sm:text-[120px] lg:text-[150px]">
              404
            </h1>
          </div>

          {/* Heading */}
          <div className="relative mt-5">
            <h2 className="font-primary text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
              Page not found
            </h2>

            <p className="mx-auto mt-3 max-w-lg font-secondary text-sm leading-6 text-secondary sm:text-base">
              The page you're looking for doesn't exist or may have been
              moved. Let's get you back to PlantDx.
            </p>
          </div>

          {/* Buttons */}
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

            {/* Go Home */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-muted px-6 py-3 font-primary text-sm font-semibold text-white ring-1 ring-muted transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted/50"
            >
              <Home className="size-4" />
              Go to Home
            </button>

            {/* Go Back */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-muted/25 bg-paper-1 px-6 py-3 font-primary text-sm font-semibold text-muted transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted hover:text-white hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted/50"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </button>
          </div>

          {/* Footer */}
          <div className="relative mt-10 border-t border-muted/15 pt-6">
            <div className="flex items-center justify-center gap-2">
              <ScanLine className="size-4 text-muted" />

              <span className="font-primary text-xs font-semibold text-primary sm:text-sm">
                PlantDx
              </span>
            </div>

            <p className="mt-1 font-secondary text-xs text-secondary">
              Intelligent leaf disease analysis
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}