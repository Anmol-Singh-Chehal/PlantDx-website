import React from 'react'

export default function InfoCard({ Icon, title, desc}) {
  return (
    <div
      className="
        group

        rounded-2xl

        border
        border-muted/15

        bg-paper-1

        p-5

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-muted/40
        hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--color-muted)_10%,transparent)]
      "
    >

      <div
        className="
          size-10

          flex
          items-center
          justify-center

          rounded-xl

          bg-muted/10

          border
          border-muted/15

          transition-all

          group-hover:bg-muted/20
        "
      >
        <Icon className="size-5 text-muted" />
      </div>


      <h3
        className="
          mt-4

          font-primary
          font-semibold

          text-primary
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-2

          font-secondary
          text-sm

          leading-relaxed

          text-secondary
        "
      >
        {desc}
      </p>

    </div>
  )
}
