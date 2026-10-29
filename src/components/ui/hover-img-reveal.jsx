/* eslint-disable */
// src/components/ui/hover-img-reveal.jsx
// Hover Image Reveal — Originkit (Adapted to responsive JSX + Outlined-to-Solid Editorial Rows)

"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 380,
  damping: 38,
  mass: 0.9,
};

export default function HoverImageReveal({
  items = [],
  imageWidth = 420,
  imageHeight = 265,
  rounded = 14,
  offsetX = 140,
  offsetY = -20,
  followStrength = 6,
  transition = DEFAULT_TRANSITION,
  className = "",
  style,
}) {
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const { theme, resolvedTheme } = useTheme();
  const isDark = (theme === "system" ? resolvedTheme : theme) !== "light";

  // Detect mobile/tablet touch viewports for responsive fallback
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Normalize either an array of items or an Originkit-style object
  const list = Array.isArray(items)
    ? items
    : Object.keys(items || {})
        .filter((k) => k.startsWith("item") && k !== "itemCount")
        .map((k) => items[k]);

  const anyActive = hovered !== null;

  // Spring-driven cursor follower
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const stiffness = 80 + followStrength * 8;
  const springCfg = { stiffness, damping: 28, mass: 0.5 };
  const x = useSpring(rawX, springCfg);
  const y = useSpring(rawY, springCfg);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Keep the floating preview card safely inside horizontal container bounds
    const halfW = imageWidth / 2 + 16;
    const targetX = e.clientX - rect.left + offsetX;
    const clampedX = Math.max(halfW, Math.min(rect.width - halfW, targetX));
    const targetY = e.clientY - rect.top + offsetY;

    rawX.set(clampedX);
    rawY.set(targetY);
  };

  // Theme-adaptive stroke colors for the hollow outlined state
  const activeStrokeColor = isDark
    ? "rgba(255, 255, 255, 0.42)"
    : "rgba(15, 23, 42, 0.42)";
  const dimmedStrokeColor = isDark
    ? "rgba(255, 255, 255, 0.22)"
    : "rgba(15, 23, 42, 0.22)";

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(null)}
      style={style}
      className={cn("relative w-full select-none overflow-visible", className)}
    >
      {/* --- FLOATING CURSOR IMAGE FOLLOWER (Desktop / Tablet Landscape) --- */}
      {!isMobile && (
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            x,
            y,
            translateX: "-50%",
            translateY: "-50%",
            width: imageWidth,
            height: imageHeight,
            borderRadius: rounded,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 30,
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{
            opacity: anyActive ? 1 : 0,
            scale: anyActive ? 1 : 0.92,
          }}
          transition={transition}
          className="shadow-[0_28px_70px_rgba(0,0,0,0.55)] border border-white/15 bg-neutral-900"
        >
          {/* Vertical Image Reel Stack */}
          {list.map((item, i) => {
            const src =
              typeof item.image === "string" ? item.image : item.image?.src;
            const yPos =
              hovered === null
                ? "100%"
                : i < hovered
                  ? "-100%"
                  : i > hovered
                    ? "100%"
                    : "0%";

            return (
              <motion.div
                key={item.id || i}
                initial={false}
                animate={{ y: yPos }}
                transition={transition}
                className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-950"
              >
                {src ? (
                  <img
                    src={src}
                    alt={item.image?.alt || item.text || ""}
                    draggable={false}
                    className="w-full h-full object-cover object-top block transition-transform duration-700 scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950" />
                )}

                {/* Subtle vignette for contrast */}
                <div className="absolute inset-0 bg-black/15" />
              </motion.div>
            );
          })}

          {/* Centered Circular "View Project" Overlay Badge */}
          {/* <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{
                scale: anyActive ? 1 : 0.75,
                opacity: anyActive ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-24 h-24 rounded-full bg-neutral-950/85 backdrop-blur-md border border-white/15 flex flex-col items-center justify-center text-center shadow-2xl"
            >
              <span className="text-[11px] font-sans font-medium text-white leading-tight tracking-wide">
                View
                <br />
                Project
              </span>
            </motion.div>
          </div> */}
        </motion.div>
      )}

      {/* --- FULL-WIDTH DIVIDED EDITORIAL PROJECT ROWS --- */}
      <div
        onMouseLeave={() => setHovered(null)}
        className="w-full flex flex-col border-t border-border/60 dark:border-white/10"
      >
        {list.map((item, i) => {
          const isHovered = hovered === i;
          const strokeColor = anyActive
            ? isHovered
              ? activeStrokeColor
              : dimmedStrokeColor
            : activeStrokeColor;
          const src =
            typeof item.image === "string" ? item.image : item.image?.src;

          const rowContent = (
            <div className="w-full py-6 sm:py-8 md:py-9 flex flex-col">
              <div className="w-full flex items-center justify-between gap-4">
                {/* Originkit Vertical Roll Container: Hollow Outline (Top) -> Solid Fill (Bottom) */}
                <div className="relative overflow-hidden py-1">
                  <motion.div
                    initial={false}
                    animate={{
                      y: isHovered ? "-100%" : "0%",
                      x: isHovered ? 10 : 0,
                    }}
                    transition={transition}
                    className="relative flex flex-col"
                  >
                    {/* State 1: Hollow Outlined Typography */}
                    <span
                      style={{
                        WebkitTextStroke: `1.35px ${strokeColor}`,
                        color: "transparent",
                        transition: "-webkit-text-stroke 0.25s ease",
                      }}
                      className="block text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight font-sans leading-[1.08] whitespace-normal sm:whitespace-nowrap"
                    >
                      {item.text}
                    </span>

                    {/* State 2: Solid Filled Typography (Rolls up on Hover) */}
                    <span
                      aria-hidden="true"
                      className="block sm:absolute sm:top-full sm:left-0 w-full text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight font-sans leading-[1.08] text-foreground whitespace-normal sm:whitespace-nowrap hidden sm:block"
                    >
                      {item.text}
                    </span>
                  </motion.div>
                </div>

                {/* Right-Aligned Subtitle Tag (Desktop) & Diagonal Arrow */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  {item.category && (
                    <span
                      className={cn(
                        "hidden lg:inline-block font-mono text-xs uppercase tracking-[0.2em] transition-opacity duration-300",
                        isHovered
                          ? "text-foreground opacity-90"
                          : "text-muted-foreground opacity-45",
                      )}
                    >
                      {item.category}
                    </span>
                  )}

                  <ArrowUpRight
                    className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
                      isHovered
                        ? "text-foreground translate-x-0.5 -translate-y-0.5 opacity-100"
                        : "text-muted-foreground/60 opacity-70",
                    )}
                  />
                </div>
              </div>

              {/* Mobile / Touch Inline Preview Card (Ensures mobile users see the artwork too) */}
              {isMobile && src && (
                <div className="mt-4 w-full h-44 sm:h-56 rounded-xl overflow-hidden border border-border/50 relative group">
                  <img
                    src={src}
                    alt={item.text}
                    draggable={false}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end justify-between p-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/90">
                      {item.category || "Web Experience"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/95 text-neutral-950 text-[11px] font-semibold">
                      View Project ↗
                    </span>
                  </div>
                </div>
              )}
            </div>
          );

          return (
            <div
              key={item.id || i}
              onMouseEnter={() => setHovered(i)}
              className="border-b border-border/60 dark:border-white/10 transition-colors duration-300"
            >
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full no-underline text-inherit cursor-pointer"
                >
                  {rowContent}
                </a>
              ) : (
                <div className="w-full">{rowContent}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

HoverImageReveal.displayName = "Hover Image Reveal";
