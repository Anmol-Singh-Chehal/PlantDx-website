import React from 'react'

export default function FeatureCard({ points }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1">
      {points.map((point, index) => (
        <div
          key={index}
          className="
            group
            flex items-center gap-4
            py-4
            border-b border-muted/15
            transition-all duration-300
            hover:px-3
            hover:border-muted/40
          "
        >

          <div
            className="
              size-10
              shrink-0
              flex items-center justify-center
              rounded-full
              bg-muted/10
              transition-all duration-300
              group-hover:bg-muted
            "
          >
            <i
              className={`
                fa-solid ${point.icon}
                text-muted
                text-base
                transition-colors duration-300
                group-hover:text-white
              `}
            ></i>
          </div>

          <p
            className="
              flex-1
              text-sm lg:text-[16px]
              font-medium
              font-secondary
              text-secondary
              leading-relaxed
              transition-colors duration-300
              group-hover:text-primary
            "
          >
            {point.text}
          </p>

        </div>
      ))}
    </div>
  )
}