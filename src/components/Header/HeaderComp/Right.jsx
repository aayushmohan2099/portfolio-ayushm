// src/components/Header/HeaderComp/Right.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const Right = () => {
  const { theme, setTheme } = useTheme();

  // State for our real-time clock
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Initialize clock timer and prevent SSR hydration errors
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format the date (e.g., "Tue, Jul 7")
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Format the time (e.g., "12:30 PM")
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="h-full w-auto min-w-0 flex items-center justify-end pr-0 sm:pr-1 md:pr-3 pointer-events-auto gap-2 xl:gap-4 shrink-0">
      {/* Sleek Date & Time Display - Shown on xl+ so tablets & compact laptops never crowd the center navbar */}
      {mounted && (
        <div className="hidden xl:flex items-center gap-2.5 text-xs 2xl:text-sm font-medium text-muted-foreground tracking-wide cursor-default select-none whitespace-nowrap transition-colors duration-300">
          <span>{formattedDate}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40"></span>
          <span className="tabular-nums">{formattedTime}</span>
        </div>
      )}

      {/* Theme Toggler */}
      <AnimatedThemeToggler
        variant="circle"
        theme={theme}
        onThemeChange={(newTheme) => setTheme(newTheme)}
      />
    </div>
  );
};

export default Right;
