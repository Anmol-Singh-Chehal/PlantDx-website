import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

const models = {
  Mango: [
    "Leaf disease classification",
  ],
  Cherry: [
    "Leaf disease classification",
  ],
  Grape: [
    "Leaf disease classification",
  ],
  Apple: [
    "Leaf disease classification",
  ],
};

export default function ModelSelector({ value, onChange }) {
  const {theme, setTheme} = useTheme();

  return (
    <div className="flex flex-col gap-2">

      <label className="font-primary text-sm font-semibold text-primary">
        Select a fruit leaf model
      </label>

      <Select value={value} onValueChange={onChange}>

        {/* Trigger */}
        <SelectTrigger
          className="
            w-full
            h-11
            rounded-xl

            border
            border-muted/40

            bg-paper-1
            text-primary

            font-secondary

            outline-none
            ring-0

            hover:border-muted/70

            focus:border-muted
            focus:ring-2
            focus:ring-muted/20
          "
        >
          <SelectValue placeholder="Choose a leaf classification model" />
        </SelectTrigger>


        <SelectContent
          className={`
            border
            border-muted/40

            
            ${theme==="light"? "bg-white": "bg-paper-1"}
            text-primary

            shadow-[0_10px_30px_color-mix(in_srgb,var(--color-muted)_15%,transparent)]
          `}
        >

          {Object.entries(models).map(([category, scans]) => (
            <SelectGroup key={category}>

              <SelectLabel
                className="
                  px-3
                  py-2

                  font-primary
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide

                  text-muted
                "
              >
                {category}
              </SelectLabel>


              {scans.map((scan) => (
                <SelectItem
                  key={scan}
                  value={`${category} — ${scan}`}
                  className="
                    rounded-lg
                    font-secondary
                    text-sm
                    text-secondary

                    cursor-pointer

                    focus:bg-muted/15
                    focus:text-primary

                    data-highlighted:bg-muted/15
                    data-highlighted:text-primary
                  "
                >
                  {scan}
                </SelectItem>
              ))}

            </SelectGroup>
          ))}

        </SelectContent>

      </Select>

    </div>
  );
}