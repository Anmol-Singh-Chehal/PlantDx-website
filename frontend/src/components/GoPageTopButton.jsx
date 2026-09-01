import React, { useEffect, useState } from "react";
import { LuArrowUp } from "react-icons/lu";
import { useTheme } from "next-themes";

export default function GoPageTopButton() {
  const { theme, setTheme } = useTheme();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShowButton(window.scrollY > 300);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function goToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      onClick={goToTop}
      className={`
        fixed bottom-6 right-6 z-10
        size-12 rounded-full
         
        flex items-center justify-center
        shadow-lg
        transition-all duration-300
        hover:bg-muted cursor-pointer hover:text-ink hover:-translate-y-1
        ${showButton ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
        ${theme == "light" ? "text-primary bg-muted" : "text-paper-1 bg-muted"}
      `}
    >
      <LuArrowUp className="size-6" />
    </button>
  );
}