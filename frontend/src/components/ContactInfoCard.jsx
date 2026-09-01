import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function ContactInfoCard() {
  const {theme, setTheme} = useTheme();
  const contactItems = [
    {
      icon: MapPin,
      title: "Office",
      text: "Plot 12, AgriTech Park, Patiala, Punjab 147001, India",
    },
    {
      icon: Phone,
      title: "Phone",
      text: "+91 98765 43210",
    },
    {
      icon: Mail,
      title: "Email",
      text: "hello@leafscanai.example",
    },
  ];

  return (
    <div className="flex flex-col gap-5">

      <div
        className="
          relative overflow-hidden
          rounded-2xl
          border border-muted/20
          bg-paper-1
          p-5 sm:p-6
          shadow-[0_8px_30px_color-mix(in_srgb,var(--color-muted)_8%,transparent)]
        "
      >

        <div
          className="
            absolute
            -right-6 -top-6
            size-28
            rounded-full
            bg-muted/10
            flex items-center justify-center
          "
        >
          <i className="fa-solid fa-bone text-muted/30 text-5xl rotate-45" />
        </div>

        <div className="relative z-10">

          <div className="flex items-center gap-3 mb-6">

            <div>
              <h2 className="font-primary text-xl font-semibold text-primary">
                Contact Information
              </h2>

              <p className="font-secondary text-sm text-secondary">
                We'd love to hear from you.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">

            {contactItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    flex items-start gap-4
                    group
                  "
                >
                  <div
                    className="
                      size-10
                      shrink-0
                      rounded-xl
                      bg-muted/10
                      border border-muted/10
                      flex items-center justify-center
                      transition-all duration-300
                      group-hover:bg-muted/20
                      group-hover:border-muted/20
                    "
                  >
                    <Icon className="size-5 text-muted" />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-primary font-semibold text-primary">
                      {item.title}
                    </h3>

                    <p className="font-secondary text-sm leading-relaxed text-secondary">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-muted/15" />

          {/* Availability */}
          <div className="flex items-center gap-3">

            <div
              className="
                size-9
                rounded-full
                bg-muted/10
                flex items-center justify-center
              "
            >
              <Clock className="size-4 text-muted" />
            </div>

            <div>
              <p className="font-primary text-sm font-semibold text-primary">
                Research Support
              </p>

              <p className="font-secondary text-xs text-secondary">
                Monday - Friday · 9:00 AM - 6:00 PM
              </p>
            </div>

          </div>

        </div>
      </div>


      <div
        className="
          rounded-2xl
          bg-muted
          p-5 sm:p-6
          relative overflow-hidden
        "
      >

        <div className="relative z-10">

          <div className="flex items-center justify-between">

            <div>
              <p className={`font-secondary text-xs uppercase tracking-[0.18em] ${theme==="light" ? "text-primary": "text-paper-1/70"} font-semibold`}>
                Need assistance?
              </p>

              <h3 className={`mt-1 ${theme==="light" ? "text-white": "text-paper-1"} font-primary text-xl font-semibold`}>
                Talk to our team
              </h3>
            </div>

            <div
              className="
                size-11
                rounded-full
                bg-primary/40
                flex items-center justify-center
              "
            >
              <ArrowUpRight className={`size-5 ${theme==="light" ? "text-white": " text-paper-1"}`} />
            </div>

          </div>

          <p className={`mt-3 max-w-sm font-secondary text-sm font-medium  leading-relaxed ${theme==="light" ? "text-white/90": "text-paper-1/80 "}`}>
            Have questions about leaf image analysis or our research
            platform? Our team is here to help.
          </p>

        </div>

        <div className="absolute -right-8 -bottom-12 size-32 rounded-full bg-white/10" />
        <div className="absolute right-8 -bottom-16 size-24 rounded-full bg-white/5" />

      </div>

    </div>
  );
}