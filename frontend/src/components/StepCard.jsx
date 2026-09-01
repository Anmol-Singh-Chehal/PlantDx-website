import React from 'react'
import { useTheme } from 'next-themes';

export default function StepCard({ faIcon, title, desc }) {
  const {theme, setTheme} = useTheme(); 
  return (
    <div
      className={`
        group
        flex flex-col
        gap-4
        p-5
        ${theme === "light" ? "bg-white": "bg-paper-2"}
        rounded-2xl
        border border-muted/20
        transition-all duration-300
        hover:border-muted/40
        hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--color-muted)_12%,transparent)]
      `}
    >

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div
            className="
              size-11
              flex items-center justify-center
              rounded-lg
              bg-muted
              transition-transform duration-300
              group-hover:rotate-3
            "
          >
            <i
              className={`fa-solid ${faIcon} text-lg text-white`}
            ></i>
          </div>

          <h2 className="text-lg lg:text-xl font-medium font-primary text-primary">
            {title}
          </h2>
        </div>

        <span
          className="
            size-2
            rounded-full
            bg-muted/30
            transition-all duration-300
            group-hover:bg-muted
          "
        />

      </div>

      <div className="h-px w-full bg-muted/15" />

      <p
        className="
          text-sm lg:text-[16px]
          font-medium
          font-secondary
          text-secondary
          leading-relaxed
        "
      >
        {desc}
      </p>

    </div>
  )
}