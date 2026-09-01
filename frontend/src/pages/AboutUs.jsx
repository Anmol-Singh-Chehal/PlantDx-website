import React from "react";
import {
  LuBrain,
  LuCode,
  LuScanSearch,
  LuShieldCheck,
  LuHeartPulse,
  LuSparkles,
  LuGithub,
  LuGraduationCap,
  LuDatabase,
  LuLayers,
  LuFileText,
} from "react-icons/lu";

import InfoCard from "@/components/InfoCard";
import FadeIn from "@/components/FadeIn";

export default function AboutUs() {
  const technologies = [
    "Python",
    "PyTorch",
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "React",
    "FastAPI",
    "MongoDB",
  ];

  const goals = [
    {
      icon: LuScanSearch,
      title: "Leaf Image Analysis",
      desc: "PlantDx provides dedicated classification workflows for Mango, Cherry, Grape, and Apple leaf images across multiple fruit crops.",
    },
    {
      icon: LuBrain,
      title: "AI & Computer Vision",
      desc: "The project explores deep learning and computer vision techniques to build practical AI-based leaf disease classification systems.",
    },
    {
      icon: LuShieldCheck,
      title: "Responsible AI",
      desc: "The platform is designed as an AI-assisted research and educational tool, with results intended to support analysis rather than replace professional agronomic evaluation.",
    },
  ];

  return (
    <main
      className="
        min-h-screen
        bg-paper-1
        px-4
        py-12
        sm:px-6
        sm:py-14
        md:px-10
        lg:px-16
        lg:py-20
        mt-15
      "
    >
      <div className="max-w-6xl mx-auto">

        {/* =====================================================
            HERO / CREATOR SECTION
        ====================================================== */}

        <FadeIn duration={0.7}>
          <section
            className="
              grid
              grid-cols-1
              lg:grid-cols-[1.2fr_0.8fr]
              gap-10
              lg:gap-16
              items-center
            "
          >
            {/* Introduction */}

            <div className="flex flex-col gap-5">

              <div
                className="
                  w-fit
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-muted/20
                  bg-muted/10
                  px-3
                  py-1.5
                "
              >
                <LuSparkles className="size-4 text-muted" />

                <span
                  className="
                    text-xs
                    sm:text-sm
                    font-primary
                    font-medium
                    text-muted
                  "
                >
                  About PlantDx
                </span>
              </div>

              <h1
                className="
                  font-primary
                  font-semibold
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  leading-tight
                  text-primary
                "
              >
                Exploring the future of{" "}
                <span className="text-muted">
                  AI-assisted leaf disease detection.
                </span>
              </h1>

              <p
                className="
                  max-w-2xl
                  font-secondary
                  text-sm
                  sm:text-base
                  lg:text-lg
                  leading-relaxed
                  text-secondary
                "
              >
                PlantDx is a plant health platform developed to
                explore how artificial intelligence, deep learning, and
                computer vision can be applied to fruit leaf
                disease classification.
              </p>

              <p
                className="
                  max-w-2xl
                  font-secondary
                  text-sm
                  sm:text-base
                  leading-relaxed
                  text-secondary
                "
              >
                The platform brings multiple specialized AI models into
                a single workflow, allowing users to analyze suitable
                Mango, Cherry, Grape, and Apple leaf photos for tasks
                such as early disease and health classification.
              </p>
            </div>

            {/* Creator Card */}

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-muted/20
                bg-paper-1
                p-6
                sm:p-8
                shadow-[0_10px_40px_color-mix(in_srgb,var(--color-muted)_10%,transparent)]
              "
            >
              <div
                className="
                  absolute
                  -right-16
                  -top-16
                  size-40
                  rounded-full
                  bg-muted/10
                "
              />

              <div
                className="
                  relative
                  flex
                  flex-col
                  items-center
                  text-center
                  gap-4
                "
              >
                <div
                  className="
                    size-24
                    sm:size-28
                    flex
                    items-center
                    justify-center
                    rounded-full
                    bg-muted/15
                    border
                    border-muted/30
                    shadow-[0_5px_25px_color-mix(in_srgb,var(--color-muted)_15%,transparent)]
                  "
                >
                  <LuCode
                    className="
                      size-10
                      sm:size-12
                      text-muted
                    "
                  />
                </div>

                <div>
                  <h2
                    className="
                      font-primary
                      text-xl
                      sm:text-2xl
                      font-semibold
                      text-primary
                    "
                  >
                    Anmol Singh
                  </h2>

                  <p
                    className="
                      mt-1
                      font-secondary
                      text-sm
                      text-muted
                    "
                  >
                    Computer Science Student & AI Developer
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    font-secondary
                    text-sm
                    text-secondary
                  "
                >
                  <LuGraduationCap className="size-4 text-muted" />

                  Exploring AI, ML & Computer Vision
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    font-secondary
                    text-sm
                    text-secondary
                  "
                >
                  <LuHeartPulse className="size-4 text-muted" />

                  Building PlantDx
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href="#"
                    className="
                      size-10
                      flex
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-muted/20
                      bg-muted/10
                      text-secondary
                      hover:bg-muted
                      hover:text-white
                      transition-all
                    "
                    aria-label="GitHub"
                  >
                    <LuGithub className="size-5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* =====================================================
            PROJECT
        ====================================================== */}

        <FadeIn duration={0.7} delay={0.1}>
          <section
            id="project"
            className="
              mt-20
              sm:mt-24
            "
          >
            <div className="max-w-3xl">

              <span
                className="
                  font-primary
                  text-sm
                  font-semibold
                  uppercase
                  tracking-widest
                  text-muted
                "
              >
                The Project
              </span>

              <h2
                className="
                  mt-2
                  font-primary
                  font-semibold
                  text-2xl
                  sm:text-3xl
                  text-primary
                "
              >
                Why PlantDx was built
              </h2>

              <p
                className="
                  mt-4
                  font-secondary
                  text-sm
                  sm:text-base
                  leading-relaxed
                  text-secondary
                "
              >
                PlantDx was developed as an exploration of the
                intersection between artificial intelligence and
                plant health imaging. The project focuses on creating a
                unified platform where different fruit leaf classification
                tasks can be connected with specialized models.
              </p>

              <p
                className="
                  mt-4
                  font-secondary
                  text-sm
                  sm:text-base
                  leading-relaxed
                  text-secondary
                "
              >
                Instead of building a separate application for every
                fruit crop, PlantDx brings multiple models and
                workflows together into one interface, making it easier
                to upload leaf photos, perform predictions, review confidence
                scores, and access previous results.
              </p>
            </div>

            <div
              className="
                mt-8
                grid
                grid-cols-1
                lg:grid-cols-3
                gap-4
              "
            >
              {goals.map((goal) => {
                const Icon = goal.icon;

                return (
                  <InfoCard
                    key={goal.title}
                    Icon={Icon}
                    title={goal.title}
                    desc={goal.desc}
                  />
                );
              })}
            </div>
          </section>
        </FadeIn>

        {/* =====================================================
            LEAF CLASSIFICATION WORKFLOW
        ====================================================== */}

        <FadeIn duration={0.7} delay={0.1}>
          <section
            className="
              mt-20
              sm:mt-24
            "
          >
            <div
              className="
                rounded-3xl
                border
                border-muted/20
                bg-paper-2/30
                p-6
                sm:p-8
                lg:p-10
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-8
                  lg:gap-12
                  items-center
                "
              >
                <div>

                  <span
                    className="
                      font-primary
                      text-sm
                      font-semibold
                      uppercase
                      tracking-widest
                      text-muted
                    "
                  >
                    Leaf Classification
                  </span>

                  <h2
                    className="
                      mt-2
                      font-primary
                      font-semibold
                      text-2xl
                      sm:text-3xl
                      text-primary
                    "
                  >
                    Multiple fruit crops in one platform
                  </h2>

                  <p
                    className="
                      mt-4
                      font-secondary
                      text-sm
                      sm:text-base
                      leading-relaxed
                      text-secondary
                    "
                  >
                    PlantDx provides dedicated classification
                    workflows for different fruit leaf crops.
                    Users can select the appropriate model and submit
                    suitable leaf photos for AI-assisted analysis.
                  </p>

                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                  "
                >
                  <div
                    className="
                      rounded-2xl
                      border
                      border-muted/20
                      bg-paper-1
                      p-4
                    "
                  >
                    <LuScanSearch className="size-6 text-muted" />

                    <h3
                      className="
                        mt-3
                        font-primary
                        font-semibold
                        text-primary
                      "
                    >
                      Mango
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-secondary
                        text-secondary
                      "
                    >
                      Mango leaf disease classification.
                    </p>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      border
                      border-muted/20
                      bg-paper-1
                      p-4
                    "
                  >
                    <LuBrain className="size-6 text-muted" />

                    <h3
                      className="
                        mt-3
                        font-primary
                        font-semibold
                        text-primary
                      "
                    >
                      Cherry
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-secondary
                        text-secondary
                      "
                    >
                      Cherry leaf disease classification.
                    </p>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      border
                      border-muted/20
                      bg-paper-1
                      p-4
                    "
                  >
                    <LuHeartPulse className="size-6 text-muted" />

                    <h3
                      className="
                        mt-3
                        font-primary
                        font-semibold
                        text-primary
                      "
                    >
                      Grape
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-secondary
                        text-secondary
                      "
                    >
                      Grape leaf disease classification.
                    </p>
                  </div>

                  <div
                    className="
                      rounded-2xl
                      border
                      border-muted/20
                      bg-paper-1
                      p-4
                    "
                  >
                    <LuFileText className="size-6 text-muted" />

                    <h3
                      className="
                        mt-3
                        font-primary
                        font-semibold
                        text-primary
                      "
                    >
                      Results & Reports
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-secondary
                        text-secondary
                      "
                    >
                      Review predictions and access saved reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* =====================================================
            TECHNOLOGY
        ====================================================== */}

        <FadeIn duration={0.7} delay={0.1}>
          <section
            id="technology"
            className="
              mt-20
              sm:mt-24
            "
          >
            <div
              className="
                rounded-3xl
                border
                border-muted/20
                bg-paper-2/30
                p-6
                sm:p-8
                lg:p-10
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-8
                  lg:gap-12
                  items-center
                "
              >
                <div>

                  <span
                    className="
                      font-primary
                      text-sm
                      font-semibold
                      uppercase
                      tracking-widest
                      text-muted
                    "
                  >
                    Technology
                  </span>

                  <h2
                    className="
                      mt-2
                      font-primary
                      font-semibold
                      text-2xl
                      sm:text-3xl
                      text-primary
                    "
                  >
                    Built with modern AI and web technologies
                  </h2>

                  <p
                    className="
                      mt-4
                      font-secondary
                      text-sm
                      sm:text-base
                      leading-relaxed
                      text-secondary
                    "
                  >
                    The platform combines deep learning, machine
                    learning, computer vision, and modern web
                    technologies to create an end-to-end leaf
                    classification workflow.
                  </p>

                  <p
                    className="
                      mt-4
                      font-secondary
                      text-sm
                      sm:text-base
                      leading-relaxed
                      text-secondary
                    "
                  >
                    AI models are developed using Python and PyTorch,
                    while FastAPI provides the backend API and React
                    powers the interactive frontend experience.
                  </p>

                </div>

                {/* Technologies */}

                <div className="flex flex-wrap gap-3">
                  {technologies.map((technology) => (
                    <span
                      key={technology}
                      className="
                        rounded-full
                        border
                        border-muted/20
                        bg-paper-1
                        px-4
                        py-2
                        font-secondary
                        text-sm
                        font-medium
                        text-secondary
                        transition-all
                        hover:border-muted/50
                        hover:text-muted
                        hover:-translate-y-0.5
                      "
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* =====================================================
            PLATFORM ARCHITECTURE
        ====================================================== */}

        <FadeIn duration={0.7} delay={0.1}>
          <section className="mt-20 sm:mt-24">

            <div className="text-center max-w-3xl mx-auto">

              <span
                className="
                  font-primary
                  text-sm
                  font-semibold
                  uppercase
                  tracking-widest
                  text-muted
                "
              >
                Platform
              </span>

              <h2
                className="
                  mt-2
                  font-primary
                  font-semibold
                  text-2xl
                  sm:text-3xl
                  text-primary
                "
              >
                From image upload to prediction
              </h2>

              <p
                className="
                  mt-4
                  font-secondary
                  text-sm
                  sm:text-base
                  leading-relaxed
                  text-secondary
                "
              >
                PlantDx connects the frontend, backend services,
                AI classification models, and prediction history into
                a single workflow.
              </p>

            </div>

            <div
              className="
                mt-8
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-4
              "
            >

              <div
                className="
                  rounded-2xl
                  border
                  border-muted/20
                  bg-paper-2/30
                  p-5
                "
              >
                <LuLayers className="size-6 text-muted" />

                <h3
                  className="
                    mt-3
                    font-primary
                    font-semibold
                    text-primary
                  "
                >
                  Select Model
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    font-secondary
                    text-secondary
                  "
                >
                  Select the classification model appropriate for
                  your fruit leaf.
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-muted/20
                  bg-paper-2/30
                  p-5
                "
              >
                <LuDatabase className="size-6 text-muted" />

                <h3
                  className="
                    mt-3
                    font-primary
                    font-semibold
                    text-primary
                  "
                >
                  Upload Images
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    font-secondary
                    text-secondary
                  "
                >
                  Submit suitable leaf photos through the
                  platform interface.
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-muted/20
                  bg-paper-2/30
                  p-5
                "
              >
                <LuBrain className="size-6 text-muted" />

                <h3
                  className="
                    mt-3
                    font-primary
                    font-semibold
                    text-primary
                  "
                >
                  AI Analysis
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    font-secondary
                    text-secondary
                  "
                >
                  The selected model processes the image and
                  generates a classification prediction.
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-muted/20
                  bg-paper-2/30
                  p-5
                "
              >
                <LuFileText className="size-6 text-muted" />

                <h3
                  className="
                    mt-3
                    font-primary
                    font-semibold
                    text-primary
                  "
                >
                  View Results
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    font-secondary
                    text-secondary
                  "
                >
                  Review predictions and confidence and access
                  previous results from your profile.
                </p>
              </div>

            </div>
          </section>
        </FadeIn>

        {/* =====================================================
            VISION
        ====================================================== */}

        <FadeIn duration={0.7} delay={0.1}>
          <section
            className="
              mt-20
              sm:mt-24
              text-center
              pb-8
            "
          >
            <div
              className="
                mx-auto
                size-12
                flex
                items-center
                justify-center
                rounded-full
                bg-muted/10
                border
                border-muted/20
              "
            >
              <LuHeartPulse className="size-6 text-muted" />
            </div>

            <h2
              className="
                mt-5
                font-primary
                font-semibold
                text-2xl
                sm:text-3xl
                text-primary
              "
            >
              The vision behind PlantDx
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-2xl
                font-secondary
                text-sm
                sm:text-base
                leading-relaxed
                text-secondary
              "
            >
              PlantDx is an ongoing exploration of how responsible
              artificial intelligence can be used in fruit leaf disease
              analysis. The goal is not to replace agronomists or plant
              pathologists, but to build useful AI-assisted tools
              for research, education, and experimentation.
            </p>

            <p
              className="
                mx-auto
                mt-4
                max-w-2xl
                font-secondary
                text-sm
                sm:text-base
                leading-relaxed
                text-secondary
              "
            >
              As the project evolves, the focus remains on improving
              model performance, expanding supported fruit crops,
              and creating a simple and reliable user experience.
            </p>
          </section>
        </FadeIn>

      </div>
    </main>
  );
}