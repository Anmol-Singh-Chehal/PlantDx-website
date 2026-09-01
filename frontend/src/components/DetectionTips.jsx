import React from "react";
import {
  ShieldCheck,
  Image,
  ScanLine,
  CircleAlert,
} from "lucide-react";

export default function DetectionTips() {
  const tips = [
    {
      icon: Image,
      text: "Use a clear, well-lit photo of a single leaf.",
    },
    {
      icon: ScanLine,
      text: "Make sure the whole leaf, including its edges, is visible.",
    },
    {
      icon: CircleAlert,
      text: "Avoid heavily blurred, cropped, or overlapping leaves.",
    },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* Tips */}
      <div
        className="
          rounded-2xl
          border border-muted/20
          bg-paper-1
          p-5 sm:p-6
        "
      >

        <div className="flex items-center gap-3 mb-5">

          <div
            className="
              size-10
              rounded-xl
              bg-muted/10
              flex
              items-center
              justify-center
            "
          >
            <ScanLine className="size-5 text-muted" />
          </div>

          <div>
            <h2 className="font-primary text-lg font-semibold text-primary">
              Image quality tips
            </h2>

            <p className="font-secondary text-xs text-secondary">
              Get better analysis results
            </p>
          </div>

        </div>


        <div className="flex flex-col gap-4">

          {tips.map((tip, index) => {

            const Icon = tip.icon;

            return (
              <div
                key={index}
                className="flex items-start gap-3"
              >

                <Icon
                  className="
                    size-4
                    shrink-0
                    mt-1
                    text-muted
                  "
                />

                <p
                  className="
                    font-secondary
                    text-sm
                    leading-relaxed
                    text-secondary
                  "
                >
                  {tip.text}
                </p>

              </div>
            );
          })}

        </div>

      </div>


      {/* Privacy card */}
      <div
        className="
          rounded-2xl
          border border-muted/20
          bg-muted/5
          p-5 sm:p-6
        "
      >

        <div className="flex items-start gap-3">

          <div
            className="
              size-10
              shrink-0
              rounded-xl
              bg-muted/15
              flex
              items-center
              justify-center
            "
          >
            <ShieldCheck className="size-5 text-muted" />
          </div>

          <div>

            <h3
              className="
                font-primary
                text-base
                font-semibold
                text-primary
              "
            >
              Your data matters
            </h3>

            <p
              className="
                mt-1
                font-secondary
                text-xs
                leading-relaxed
                text-secondary
              "
            >
              Uploaded images are handled securely and are not
              shared with third parties.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}