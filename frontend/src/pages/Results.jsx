import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuDownload, LuCircleCheck } from "react-icons/lu";

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    results: apiResponse,
    images = [],
    diseaseType = "Leaf Classification",
  } = location.state || {};

  if (!apiResponse) {
    return (
      <main className="min-h-screen bg-paper-1 flex flex-col items-center justify-center gap-5 px-4 font-primary">
        <h2 className="text-primary text-3xl font-semibold text-center">
          No Results Found
        </h2>

        <button
          onClick={() => navigate("/detection")}
          className="btn-2"
        >
          Go to Detection
        </button>
      </main>
    );
  }

  const results = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse.predictions || [];

  if (results.length === 0) {
    return (
      <main className="min-h-screen bg-paper-1 flex flex-col items-center justify-center gap-5 px-4 font-primary">
        <h2 className="text-primary text-3xl font-semibold text-center">
          No Results Found
        </h2>

        <button
          onClick={() => navigate("/detection")}
          className="btn-2"
        >
          Go to Detection
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper-1 pt-24 pb-16 px-4 lg:px-8 font-primary">
      <section className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/detection")}
          className="flex items-center gap-2 text-secondary hover:text-primary transition mb-6 font-secondary"
        >
          <LuArrowLeft size={19} />
          Scan Another
        </button>

        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-muted uppercase tracking-wider text-xs font-secondary">
            {diseaseType}
          </p>

          <h1 className="text-primary text-3xl md:text-4xl font-semibold">
            Detection Results
          </h1>

          <p className="text-secondary font-secondary text-base max-w-3xl">
            Here are the prediction results generated from your uploaded images.
          </p>
        </div>

        {/* Results */}
        <section className="grid gap-6">

          {results.map((result, index) => {
            const image = images[index];

            return (
              <article
                key={`${result.filename}-${index}`}
                className="bg-paper-2 border border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm"
              >

                {/* Image + Main Result */}
                <div className="grid lg:grid-cols-[42%_58%]">

                  {/* Image */}
                  <div className="h-[260px] sm:h-[300px] lg:h-[330px] bg-black/5 flex items-center justify-center p-3">
                    {image?.preview ? (
                      <img
                        src={image.preview}
                        alt={result.filename}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-secondary text-sm">
                        Image unavailable
                      </div>
                    )}
                  </div>

                  {/* Main result */}
                  <div className="p-5 md:p-7 flex flex-col justify-center gap-5">

                    {/* Filename */}
                    <div>
                      <p className="text-secondary font-secondary text-xs uppercase tracking-wider mb-1">
                        Image
                      </p>

                      <p className="text-primary font-secondary text-base break-all">
                        {result.filename ||
                          image?.filename ||
                          `Image ${index + 1}`}
                      </p>
                    </div>

                    {/* Prediction */}
                    <div>
                      <p className="text-secondary font-secondary text-xs uppercase tracking-wider mb-1">
                        Predicted Class
                      </p>

                      <h2 className="text-primary text-2xl md:text-3xl font-semibold">
                        {String(
                          result.predicted_class || "Unknown"
                        ).replaceAll("_", " ")}
                      </h2>
                    </div>

                    {/* Confidence */}
                    <div className="flex items-center gap-3">
                      <LuCircleCheck
                        size={27}
                        className="text-muted"
                      />

                      <div>
                        <p className="text-secondary text-xs font-secondary">
                          Prediction Confidence
                        </p>

                        <p className="text-primary text-2xl font-semibold">
                          {result.confidence}%
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Class Confidence */}
                <div className="px-5 py-5 md:px-7 md:py-6 border-t border-gray-300 dark:border-gray-700">

                  <h3 className="text-primary text-lg font-semibold mb-4">
                    Class Confidence Scores
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">

                    {Object.entries(
                      result.class_confidence || {}
                    ).map(([className, confidence]) => (

                      <div key={className}>

                        <div className="flex justify-between items-center mb-1.5">

                          <span className="text-primary font-medium font-secondary text-sm capitalize">
                            {className.replaceAll("_", " ")}
                          </span>

                          <span className="text-secondary font-secondary text-sm">
                            {confidence}%
                          </span>

                        </div>

                        <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">

                          <div
                            className="h-full bg-muted rounded-full transition-all"
                            style={{
                              width: `${confidence}%`,
                            }}
                          />

                        </div>

                      </div>

                    ))}

                  </div>
                </div>

              </article>
            );
          })}

        </section>
      </section>
    </main>
  );
}

