import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ScanSearch,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import ModelSelector from "@/components/ModelSelector";
import UploadBox from "@/components/UploadBox";
import DetectionTips from "@/components/DetectionTips";
import Badge from "@/components/Badge";
import { useSelector } from "react-redux";

import {
  useMangoLeafClassificationMutation,
  useCherryLeafClassificationMutation,
  useGrapeLeafClassificationMutation,
  useAppleLeafClassificationMutation,
} from "@/services/api.js";

export default function Detection() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  const [
    mangoLeafClassification,
    { isLoading: isMangoLoading },
  ] = useMangoLeafClassificationMutation();

  const [
    cherryLeafClassification,
    { isLoading: isCherryLoading },
  ] = useCherryLeafClassificationMutation();

  const [
    grapeLeafClassification,
    { isLoading: isGrapeLoading },
  ] = useGrapeLeafClassificationMutation();

  const [
    appleLeafClassification,
    { isLoading: isAppleLoading },
  ] = useAppleLeafClassificationMutation();

  const isLoading =
    isMangoLoading ||
    isCherryLoading ||
    isGrapeLoading ||
    isAppleLoading;

  const canAnalyze =
    selectedModel &&
    images.length >= 1 &&
    images.length <= 5;

  const handleAnalyze = async () => {
    if (isLoading) return;

    // User must be authenticated to perform detection
    if (!isAuthenticated) {
      navigate("/log-in");
      alert("Please login first.")
      return;
    }

    // Only continue with detection if the form is valid
    if (!canAnalyze) return;

    setError("");

    try {
      const files = images.map((image) => image.file);

      let response;

      switch (selectedModel) {
        case "Mango — Leaf disease classification":
          response = await mangoLeafClassification(files).unwrap();
          break;

        case "Cherry — Leaf disease classification":
          response = await cherryLeafClassification(files).unwrap();
          break;

        case "Grape — Leaf disease classification":
          response = await grapeLeafClassification(files).unwrap();
          break;

        case "Apple — Leaf disease classification":
          response = await appleLeafClassification(files).unwrap();
          break;

        default:
          throw new Error("Invalid classification model selected.");
      }

      navigate("/results", {
        state: {
          results: response,

          images: images.map((image) => ({
            filename: image.file.name,
            preview: image.preview,
          })),

          diseaseType: selectedModel,
        },
      });

      console.log(response);
    } catch (err) {
      console.error("Detection error:", err);

      setError(
        err?.data?.detail ||
          err?.data?.message ||
          "Something went wrong while analyzing the images."
      );
    }
  };

  return (
    <main
      className="
        min-h-screen
        bg-paper-1
        px-3
        pt-20
        pb-10
        sm:px-5
        sm:pt-22.5
        sm:pb-12
        md:px-8
        lg:px-12
        lg:pt-25
        lg:pb-16
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="flex flex-col gap-4 mb-8"
        >
          <Badge
            faIcon={"fa-leaf"}
            tag={"AI LEAF CLASSIFICATION"}
          />

          <h1
            className="
              font-primary
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-semibold
              tracking-tight
              text-primary
            "
          >
            Analyze a fruit leaf.
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              font-secondary
              text-sm
              sm:text-base
              leading-relaxed
              text-secondary
            "
          >
            Select an appropriate AI model, upload your leaf
            images, and start the analysis workflow.
          </p>
        </motion.section>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <section
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1fr_340px]
            xl:grid-cols-[1fr_380px]
            gap-6
            lg:gap-8
            items-start
          "
        >

          {/* =====================================================
              LEFT PANEL
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="
              rounded-2xl
              border
              border-muted/20
              bg-paper-1
              p-4
              sm:p-6
              lg:p-7
              shadow-[0_8px_30px_color-mix(in_srgb,var(--color-muted)_6%,transparent)]
            "
          >

            {/* Model selection */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: 0.15,
              }}
            >
              <ModelSelector
                value={selectedModel}
                onChange={(value) => {
                  setSelectedModel(value);
                  setError("");
                }}
              />
            </motion.div>

            {/* Selected model */}

            {selectedModel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="
                  mt-4
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-muted/5
                  border
                  border-muted/10
                  px-4
                  py-3
                "
              >
                <div
                  className="
                    size-8
                    shrink-0
                    rounded-lg
                    bg-muted/15
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Sparkles className="size-4 text-muted" />
                </div>

                <div className="min-w-0">
                  <p className="font-secondary text-xs text-secondary">
                    Selected model
                  </p>

                  <p
                    className="
                      truncate
                      font-primary
                      text-sm
                      font-semibold
                      text-primary
                    "
                  >
                    {selectedModel}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Upload */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="mt-5"
            >
              <UploadBox
                images={images}
                setImages={setImages}
              />
            </motion.div>

            {/* Error */}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="
                  mt-4
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/5
                  px-4
                  py-3
                  text-sm
                  text-red-500
                  font-secondary
                "
              >
                {error}
              </motion.div>
            )}

            {/* Analyze */}
            <motion.button
              type="button"
              disabled={!canAnalyze || isLoading}
              onClick={handleAnalyze}
              whileHover={
                canAnalyze && !isLoading
                  ? {
                      y: -2,
                      scale: 1.01,
                    }
                  : {}
              }
              whileTap={
                canAnalyze && !isLoading
                  ? {
                      scale: 0.97,
                    }
                  : {}
              }
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className={`
                group relative mt-5 w-full overflow-hidden
                rounded-2xl px-5 py-3.5
                font-primary text-sm font-semibold
                transition-all duration-300
                ${
                  canAnalyze && !isLoading
                    ? `
                      cursor-pointer
                      bg-muted
                      ${
                        theme === "light"
                          ? "text-white"
                          : "text-paper-1"
                      }
                      shadow-[0_8px_25px_color-mix(in_srgb,var(--color-muted)_22%,transparent)]
                      hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--color-muted)_35%,transparent)]
                    `
                    : `
                      cursor-not-allowed
                      bg-muted/10
                      ${
                        theme === "dark"
                          ? "text-white/40"
                          : "text-primary/40"
                      }
                    `
                }
              `}
            >
              {/* Animated shine */}
              {canAnalyze && !isLoading && (
                <motion.span
                  className="
                    absolute inset-y-0 -left-1/2 w-1/3
                    skew-x-[-20deg]
                    bg-white/10
                  "
                  animate={{
                    left: ["-40%", "130%"],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Loading progress */}
              {isLoading && (
                <motion.span
                  className="
                    absolute bottom-0 left-0 h-[2px]
                    bg-current/60
                  "
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                {isLoading ? (
                  <>
                    {/* Spinner */}
                    <motion.span
                      className="
                        size-4 rounded-full
                        border-2 border-current/25
                        border-t-current
                      "
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <span>Analyzing Images...</span>

                    {/* Animated dots */}
                    <span className="flex gap-0.5">
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="size-1 rounded-full bg-current/70"
                          animate={{
                            opacity: [0.25, 1, 0.25],
                            y: [0, -2, 0],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: dot * 0.15,
                          }}
                        />
                      ))}
                    </span>
                  </>
                ) : (
                  <>
                    <motion.span
                      className="flex items-center justify-center"
                      animate={
                        canAnalyze
                          ? {
                              scale: [1, 1.05, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ScanSearch className="size-4" />
                    </motion.span>

                    <span>
                      {canAnalyze ? "Analyze Images" : "Analyze Images"}
                    </span>

                    <ArrowRight
                      className="
                        size-4
                        transition-transform duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </span>
            </motion.button>

            {/* Helper text */}

            <p
              className="
                mt-3
                text-center
                font-secondary
                text-xs
                text-secondary/70
              "
            >
              {!selectedModel
                ? "Select a model to continue."
                : images.length === 0
                ? "Upload at least one image to continue."
                : images.length >= 5
                ? "Maximum 5 images selected."
                : `${images.length} image${
                    images.length !== 1 ? "s" : ""
                  } selected.`}
            </p>

          </motion.div>

          {/* =====================================================
              DETECTION TIPS
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.65,
              delay: 0.2,
              ease: "easeOut",
            }}
          >
            <DetectionTips />
          </motion.div>

        </section>
      </div>
    </main>
  );
}