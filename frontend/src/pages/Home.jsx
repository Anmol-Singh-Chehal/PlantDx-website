import React from "react";
import Badge from "@/components/Badge";
import {
  ArrowRight,
  Leaf,
  CircleAlert,
} from "lucide-react";
import InfoCard from "@/components/InfoCard";
import StepCard from "@/components/StepCard";
import FeatureCard from "@/components/FeatureCard";
import FadeIn from "@/components/FadeIn";
import { useTheme } from "next-themes";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

// Small helper so we can drop fruit emojis into components that expect
// an Icon component (same call shape as a lucide-react icon).
function emojiIcon(emoji) {
  return function EmojiIcon({ className = "" }) {
    return (
      <span
        className={`inline-flex items-center justify-center leading-none text-[1.15em] ${className}`}
      >
        {emoji}
      </span>
    );
  };
}

const MangoIcon = emojiIcon("🥭");
const CherryIcon = emojiIcon("🍒");
const GrapeIcon = emojiIcon("🍇");
const AppleIcon = emojiIcon("🍎");

export default function Home() {
  const { theme } = useTheme();

  return (
    <main className="pt-15">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <FadeIn id="home-hero" duration={0.8}>
        <section className="lg:px-8 lg:py-20 xl:px-12 flex lg:gap-8 items-center justify-center bg-paper-1 sm:py-10 sm:px-4">
          <div className="lg:w-1/2 xl:w-3/5 flex flex-col lg:gap-8 xl:gap-12 sm:gap-6">
            <Badge
              faIcon={"fa-leaf"}
              tag={"AI-POWERED LEAF CLASSIFICATION"}
            />

            <div>
              <h1 className="sm:text-3xl lg:text-4xl xl:text-5xl text-primary font-bold font-primary">
                Smarter Leaf Scanning.
              </h1>

              <h1 className="sm:text-3xl lg:text-4xl xl:text-5xl text-muted font-bold font-primary">
                Clearer AI-Assisted Insights.
              </h1>
            </div>

            <h3 className="sm:text-sm md:text-lg xl:text-xl text-secondary font-medium font-secondary">
              PlantDx is a plant health platform that lets you analyze
              Mango, Cherry, Grape, and Apple leaf photos using dedicated
              AI classification models to spot disease early.
            </h3>

            <div className="flex lg:gap-4 sm:gap-4">
              <NavLink
                to={"/detection"}
                className={`font-medium bg-muted ${
                  theme === "light" ? "text-white" : "text-paper-1"
                } flex lg:gap-2 items-center lg:px-4 lg:py-2 lg:text-lg rounded-md cursor-pointer ring-2 ring-muted sm:text-sm sm:px-2 sm:py-2 sm:gap-1 font-primary transition-all duration-400 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted/50`}
              >
                <h3>Start Scanning</h3>
                <ArrowRight className="sm:size-4" />
              </NavLink>

              <NavLink
                to={"/about-us"}
                className={`transition-all duration-400 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted/50 font-medium text-muted flex lg:gap-2 items-center lg:px-4 lg:py-2 lg:text-lg rounded-md ring-2 hover:bg-muted ${
                  theme === "light"
                    ? "hover:text-white"
                    : "hover:text-paper-1"
                } hover:ring-2 hover:ring-muted bg-muted/10 ring-muted/40 cursor-pointer sm:text-sm sm:px-2 sm:py-2 sm:gap-1 font-primary`}
              >
                Learn About PlantDx
              </NavLink>
            </div>
          </div>

          <div className="lg:w-1/2 xl:w-2/5 hidden lg:flex items-center justify-center">
            <div
              className="
                relative w-full aspect-square max-w-md
                rounded-3xl
                bg-gradient-to-br from-muted/15 via-paper-1 to-accent/10
                border border-muted/20
                flex items-center justify-center
                overflow-hidden
              "
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 size-20 rounded-2xl bg-muted/15 flex items-center justify-center text-4xl"
              >
                🥭
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute top-16 right-10 size-16 rounded-2xl bg-accent/15 flex items-center justify-center text-3xl"
              >
                🍒
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute bottom-14 left-14 size-16 rounded-2xl bg-muted/15 flex items-center justify-center text-3xl"
              >
                🍇
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute bottom-10 right-16 size-16 rounded-2xl bg-accent/15 flex items-center justify-center text-3xl"
              >
                🍎
              </motion.div>

              <div className="size-28 rounded-full bg-paper-1 border border-muted/30 flex items-center justify-center shadow-[0_10px_35px_color-mix(in_srgb,var(--color-muted)_20%,transparent)]">
                <Leaf className="size-12 text-muted" />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* =====================================================
          AVAILABLE MODELS
      ====================================================== */}

      <FadeIn id="home-models" duration={0.6} delay={0.1}>
        <section className="sm:py-10 sm:px-4 lg:px-8 lg:py-20 xl:px-12 flex flex-col sm:gap-10">
          <div className="flex flex-col text-center sm:gap-2">
            <h1 className="sm:text-xl md:text-2xl lg:text-3xl font-medium text-primary font-primary">
              Choose the Right Model for Your Leaf
            </h1>

            <p className="sm:text-sm lg:text-lg font-medium text-secondary font-secondary">
              Select the model that matches the fruit crop you want
              to analyze.
            </p>
          </div>

          <div className="flex flex-col sm:gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              Icon={MangoIcon}
              title={"Mango Leaf Classification"}
              desc={
                "Analyze mango leaf photos to classify healthy leaves and common mango leaf diseases."
              }
            />

            <InfoCard
              Icon={CherryIcon}
              title={"Cherry Leaf Classification"}
              desc={
                "Analyze cherry leaf photos using the cherry leaf disease classification model."
              }
            />

            <InfoCard
              Icon={GrapeIcon}
              title={"Grape Leaf Classification"}
              desc={
                "Analyze grape leaf photos with the grape leaf disease classification model."
              }
            />

            <InfoCard
              Icon={AppleIcon}
              title={"Apple Leaf Classification"}
              desc={
                "Analyze apple leaf photos using the apple leaf disease classification model."
              }
            />
          </div>
        </section>
      </FadeIn>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <FadeIn id="home-workflow" duration={0.6} delay={0.15}>
        <section className="sm:py-10 sm:px-4 lg:px-8 lg:py-20 xl:px-12 flex flex-col sm:gap-10 bg-paper-1">
          <div className="flex flex-col text-center sm:gap-2">
            <h1 className="sm:text-xl md:text-2xl lg:text-3xl font-medium text-primary font-primary">
              How It Works
            </h1>

            <p className="sm:text-sm lg:text-lg font-medium text-secondary font-secondary">
              Analyze your leaf photos in a few simple steps.
            </p>
          </div>

          <div className="flex flex-col sm:gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-4">
            <StepCard
              faIcon="fa-list-check"
              title={"1. Select a Model"}
              desc={
                "Choose the model that matches your crop — Mango, Cherry, Grape, or Apple leaf classification."
              }
            />

            <StepCard
              faIcon="fa-cloud-arrow-up"
              title={"2. Upload Leaf Photos"}
              desc={
                "Upload clear, well-lit photos of the leaf. Avoid blurry images, heavy overlap, or hard-to-read shots."
              }
            />

            <StepCard
              faIcon="fa-magnifying-glass-chart"
              title={"3. Analyze Leaves"}
              desc={
                "Click Analyze Images and PlantDx processes the uploaded photos using the selected classification model."
              }
            />

            <StepCard
              faIcon="fa-file-circle-check"
              title={"4. View & Download Results"}
              desc={
                "Review the prediction results and confidence on the results page, then access and download individual scan reports from your profile."
              }
            />
          </div>
        </section>
      </FadeIn>

      {/* =====================================================
          PLATFORM FEATURES
      ====================================================== */}

      <FadeIn id="home-features" duration={0.6} delay={0.2}>
        <section className="sm:py-10 sm:px-4 lg:px-8 lg:py-20 xl:px-12 flex flex-col sm:gap-10">
          <div className="flex flex-col text-center sm:gap-2">
            <h1 className="sm:text-xl md:text-2xl lg:text-3xl font-medium text-primary font-primary">
              Built for Simple Leaf Disease Analysis
            </h1>

            <p className="sm:text-sm lg:text-lg font-medium text-secondary font-secondary">
              A single platform for accessing multiple fruit leaf
              classification models and managing your prediction results.
            </p>
          </div>

          <FeatureCard
            points={[
              {
                icon: "fa-layer-group",
                text: "Access dedicated Mango, Cherry, Grape, and Apple classification models from one platform.",
              },
              {
                icon: "fa-images",
                text: "Upload and analyze multiple leaf photos through a simple workflow.",
              },
              {
                icon: "fa-chart-simple",
                text: "View the predicted class and model confidence after analysis.",
              },
              {
                icon: "fa-clock-rotate-left",
                text: "Keep track of previous scans and prediction results through your profile.",
              },
              {
                icon: "fa-file-arrow-down",
                text: "Download individual leaf reports from your prediction history whenever needed.",
              },
            ]}
          />
        </section>
      </FadeIn>

      {/* =====================================================
          AI NOTICE
      ====================================================== */}

      <FadeIn id="home-ai-notice" duration={0.6} delay={0.25}>
        <section className="sm:py-10 sm:px-4 lg:px-8 lg:py-16 xl:px-12 flex flex-col sm:gap-6 bg-paper-1">
          <div className="flex flex-col text-center sm:gap-2">
            <h1 className="sm:text-xl md:text-2xl lg:text-3xl font-medium text-primary font-primary">
              AI-Assisted Results
            </h1>

            <p className="sm:text-sm lg:text-lg font-medium text-secondary font-secondary">
              PlantDx is designed to assist with leaf image classification
              and provide quick model-based predictions.
            </p>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-muted/20 bg-paper-2/20 p-5 sm:p-6 max-w-4xl mx-auto">
            <CircleAlert className="size-6 text-muted shrink-0 mt-0.5" />

            <p className="text-sm sm:text-base text-secondary font-secondary leading-relaxed">
              AI predictions can be affected by photo quality, lighting, and
              other factors. Results should therefore be interpreted
              carefully and should not be treated as a substitute for
              professional agronomic evaluation.
            </p>
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
