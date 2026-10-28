// src/components/Title/HeaderComp/Right.jsx
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

    // Cleanup the timer on unmount
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
    // Flexbox aligns the clock and toggler to the right side with a professional gap
    <div className="h-full w-full flex items-center justify-end pr-4 pointer-events-auto gap-6">
      {/* Sleek Date & Time Display */}
      {mounted && (
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground tracking-wide cursor-default select-none transition-colors duration-300">
          <span>{formattedDate}</span>
          {/* Subtle separator dot */}
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40"></span>
          {/* tabular-nums ensures the width doesn't jitter when seconds/minutes change */}
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
