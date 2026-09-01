import React from 'react'
import { useTheme } from 'next-themes';

export default function Badge({ faIcon, tag }) {
  const {theme, setTheme} = useTheme();

  return (
    <div className={`flex sm:gap-1 ring-1 ring-muted/40 rounded-full py-1 px-2 items-center w-fit ${theme === "light" ? "bg-teal-100/40" : "bg-[#18312E]/70"}`}>
      <i className={`fa-solid ${faIcon} text-muted text-sm`} />
      <p className='sm:text-[10px] md:text-sm font-medium text-muted'>{tag}</p>
    </div>
  )
}
