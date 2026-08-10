// src/components/ui/transitionParent.jsx
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTheme } from "next-themes";

// --------------------------------------------------------
// EXACT GSAP EASING CURVES TRANSLATED FOR FRAMER MOTION
// --------------------------------------------------------
const hopEase = [0.56, 0, 0.35, 0.98];
const sineEase = [0.37, 0, 0.63, 1];

// --------------------------------------------------------
// SVG PATHS (Calculated for seamless Top-to-Bottom Sweep)
// --------------------------------------------------------
const PATH_START = "M 0 0 V 0 Q 50 0 100 0 V 0 z"; // Flat top, 0 height
const PATH_MID_IN = "M 0 0 V 50 Q 50 100 100 50 V 0 z"; // Curve dipping down
const PATH_FULL = "M 0 0 V 100 Q 50 100 100 100 V 0 z"; // Full screen

// Seamlessly chained paths for the exit
const PATH_FULL_ALT = "M 0 100 V 0 Q 50 0 100 0 V 100 z"; // Full screen (from bottom)
const PATH_MID_OUT = "M 0 100 V 50 Q 50 0 100 50 V 100 z"; // Curve retracting up
const PATH_END = "M 0 100 V 100 Q 50 100 100 100 V 100 z"; // Flat bottom, 0 height

const DRAW_PATH =
  "m0 0c3.36 0.06 6.6-2.82 7.07-7.07 0.59-4.19-1.79-9.6-7.07-12.93-5.18-3.4-13.27-4.43-21.21-1.21-7.92 3.09-15.48 10.7-18.79 21.21-3.42 10.46-2.3 23.68 4.64 35.36 6.83 11.64 19.57 21.35 35.36 24.64 15.69 3.43 34.14 0.2 49.5-10.5 15.38-10.52 27.21-28.47 30.5-49.5 3.43-20.92-1.92-44.6-16.36-63.64-14.2-19.1-37.37-33.1-63.64-36.36-26.16-3.45-55.05 4.06-77.78 22.22-22.82 17.9-38.98 46.25-42.22 77.78-3.48 31.43 6.2 65.49 28.08 91.92 21.58 26.55 55.16 44.87 91.92 48.08 36.66 3.5 75.94-8.33 106.07-33.93 30.27-25.28 50.74-64.07 53.93-106.07 3.53-41.9-10.46-86.4-39.79-120.21-28.97-33.99-72.97-56.62-120.21-59.79-47.13-3.56-96.85 12.6-134.35 45.65-37.71 32.65-62.51 81.88-65.65 134.35-3.55 52.4 14.72 107.29 51.51 148.49 36.35 41.41 90.75 68.41 148.49 71.51 57.63 3.58 117.75-16.86 162.63-57.37 45.14-40.03 74.29-99.66 77.37-162.63 3.62-62.86-19.02-128.21-63.22-176.78-43.73-48.85-108.57-80.17-176.78-83.22-68.13-3.64-138.65 21.15-190.92 69.08-52.57 47.43-86.06 117.45-89.08 190.92-3.66 73.36 23.29 149.1 74.94 205.06 51.12 56.3 126.35 91.94 205.06 94.94 78.6 3.69 159.56-25.42 219.2-80.8 60.03-54.8 97.82-135.26 100.8-219.2 3.72-83.84-27.56-170.01-86.65-233.35-58.51-63.77-144.14-103.69-233.35-106.65-89.07-3.71-180.46 29.68-247.49 92.51-67.51 62.18-109.54 153.08-112.51 247.49-3.74 94.33 31.82 190.91 98.37 261.63 65.88 71.23 161.96 115.43 261.63 118.37 99.57 3.76 201.36-33.95 275.77-104.23 74.96-69.57 121.31-170.86 124.23-275.77";

// --------------------------------------------------------
// VARIANT ANIMATION DICTIONARIES
// --------------------------------------------------------
const morphVariants = {
  initial: { d: PATH_START },
  in: {
    d: [PATH_START, PATH_MID_IN, PATH_FULL],
    transition: { duration: 0.6, ease: sineEase, times: [0, 0.5, 1] },
  },
  out: {
    d: [PATH_FULL_ALT, PATH_MID_OUT, PATH_END],
    transition: { duration: 0.6, ease: sineEase, times: [0, 0.5, 1] },
  },
};

const curtainVariants = {
  initial: { clipPath: "inset(0% 0% 100% 0%)" },
  in: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.6, ease: hopEase },
  },
  out: {
    clipPath: "inset(100% 0% 0% 0%)",
    transition: { duration: 0.6, ease: hopEase },
  },
};

const overlayVariants = {
  initial: { clipPath: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)" },
  in: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    transition: { duration: 0.6, ease: hopEase },
  },
  out: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    transition: { duration: 0.6, ease: hopEase },
  },
};

const overlayTextVariants = {
  initial: { y: "50%", opacity: 0 },
  in: { y: "0%", opacity: 1, transition: { duration: 0.4, delay: 0.2 } },
  out: { y: "-120%", opacity: 0, transition: { duration: 0.3 } },
};

const drawVariants = {
  initial: { pathLength: 0, strokeWidth: 100, opacity: 1 },
  in: {
    pathLength: 1,
    strokeWidth: [100, 1000],
    transition: { duration: 0.8, ease: sineEase },
  },
  out: {
    pathLength: [1, 1, 0],
    strokeWidth: [1000, 100, 100],
    opacity: [1, 1, 0],
    transition: { duration: 0.8, ease: sineEase },
  },
};

const fadeVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.6 } },
  out: { opacity: 0, transition: { duration: 0.6 } },
};

export function TransitionParent({
  children,
  trigger = false,
  variant = "morph", // Options: "morph", "curtain", "overlay", "draw", "fade"
  overlayText = "INITIALIZING...",
  changeTheme = 0, // NEW: 1 to swap theme on transition, 0 to keep current theme
  className = "",
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const controls = useAnimation();

  // We lock the colors at the start of the transition so they don't flicker when the theme swaps
  const [overlayColors, setOverlayColors] = useState({
    fill: "transparent",
    stroke: "transparent",
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (trigger && !isTransitioning) {
      setIsTransitioning(true);

      const runTransition = async () => {
        const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

        // Logic: If Dark theme (black bg), the overlay is White with a Black stroke.
        // This ensures the curved border is perfectly contrasted against the background!
        setOverlayColors({
          fill: isDark ? "#ffffff" : "#000000",
          stroke: isDark ? "#000000" : "#ffffff",
        });

        // 1. Enter Phase: The overlay expands to cover the screen
        await controls.start("in");

        // 2. Midpoint: Swap the Theme (ONLY if changeTheme prop is truthy)
        if (changeTheme) {
          setTheme(isDark ? "light" : "dark");
        }

        // 3. Wait a tiny beat to let the DOM flush the new global CSS colors
        await new Promise((resolve) => setTimeout(resolve, 50));

        // 4. Exit Phase: The overlay retracts, revealing the new theme
        await controls.start("out");
      };

      runTransition();
    } else if (!trigger && isTransitioning) {
      // CRITICAL FIX: Unlock the transition ONLY when App.jsx turns the trigger back to false.
      // This prevents the useEffect from double-firing when setTheme updates the dependencies!
      setIsTransitioning(false);
    }
  }, [
    trigger,
    theme,
    resolvedTheme,
    setTheme,
    controls,
    isTransitioning,
    changeTheme,
  ]);

  // Renders the specific overlay based on the variant prop
  const renderOverlay = () => {
    switch (variant) {
      case "morph":
        return (
          <motion.div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center">
            <motion.svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full absolute inset-0"
            >
              <motion.path
                variants={morphVariants}
                initial="initial"
                animate={controls}
                fill={overlayColors.fill}
                stroke={overlayColors.stroke}
                strokeWidth="0.5" // Provides the sharp visible edge
                vectorEffect="non-scaling-stroke"
              />
            </motion.svg>
          </motion.div>
        );

      case "curtain":
        return (
          <motion.div
            className="fixed inset-0 z-[99999] pointer-events-none"
            style={{ backgroundColor: overlayColors.fill }}
            variants={curtainVariants}
            initial="initial"
            animate={controls}
          />
        );

      case "overlay":
        return (
          <motion.div
            className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center"
            style={{ backgroundColor: overlayColors.fill }}
            variants={overlayVariants}
            initial="initial"
            animate={controls}
          >
            <div className="overflow-hidden">
              <motion.h1
                variants={overlayTextVariants}
                initial="initial"
                animate={controls}
                style={{ color: overlayColors.stroke }}
                className="text-3xl md:text-5xl font-bold uppercase tracking-widest px-4"
              >
                {overlayText}
              </motion.h1>
            </div>
          </motion.div>
        );

      case "draw":
        return (
          <motion.div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-360 -360 760 760"
              preserveAspectRatio="xMidYMid slice"
              className="w-[125%] h-full"
            >
              <motion.path
                d={DRAW_PATH}
                fill="none"
                stroke={overlayColors.fill}
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={drawVariants}
                initial="initial"
                animate={controls}
              />
            </motion.svg>
          </motion.div>
        );

      case "fade":
        return (
          <motion.div
            className="fixed inset-0 z-[99999] pointer-events-none"
            style={{ backgroundColor: overlayColors.fill }}
            variants={fadeVariants}
            initial="initial"
            animate={controls}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 1. The Global Overlay that sweeps the screen */}
      {renderOverlay()}

      {/* 2. The Children (Your Page Content) */}
      {children}
    </div>
  );
}
