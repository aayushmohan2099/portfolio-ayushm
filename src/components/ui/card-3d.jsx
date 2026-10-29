// src/components/ui/card-3d.jsx
import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Theme palettes matching the portfolio's dark/light system & reference accents
const ACCENT_THEMES = {
  emerald: {
    cardBg:
      "linear-gradient(135deg, rgba(16, 185, 129, 0.28) 0%, rgba(5, 150, 105, 0.12) 100%)",
    cardBorder: "rgba(16, 185, 129, 0.35)",
    circleBg: "rgba(16, 185, 129, 0.16)",
    circleBorder: "rgba(52, 211, 153, 0.35)",
    accentText: "text-emerald-600 dark:text-emerald-400",
    badgeText: "text-emerald-600 dark:text-emerald-300",
    glowShadow:
      "rgba(16, 185, 129, 0.22) 25px 40px 28px -30px, rgba(16, 185, 129, 0.14) 0px 20px 25px -5px",
    hoverShadow:
      "rgba(16, 185, 129, 0.35) 30px 50px 30px -35px, rgba(16, 185, 129, 0.2) 0px 25px 35px 0px",
    iconColor: "#34d399",
  },
  blue: {
    cardBg:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.12) 100%)",
    cardBorder: "rgba(59, 130, 246, 0.38)",
    circleBg: "rgba(59, 130, 246, 0.16)",
    circleBorder: "rgba(96, 165, 250, 0.38)",
    accentText: "text-blue-600 dark:text-blue-400",
    badgeText: "text-blue-600 dark:text-blue-300",
    glowShadow:
      "rgba(59, 130, 246, 0.22) 25px 40px 28px -30px, rgba(59, 130, 246, 0.14) 0px 20px 25px -5px",
    hoverShadow:
      "rgba(59, 130, 246, 0.35) 30px 50px 30px -35px, rgba(59, 130, 246, 0.2) 0px 25px 35px 0px",
    iconColor: "#60a5fa",
  },
  violet: {
    cardBg:
      "linear-gradient(135deg, rgba(168, 85, 247, 0.28) 0%, rgba(126, 34, 206, 0.12) 100%)",
    cardBorder: "rgba(168, 85, 247, 0.35)",
    circleBg: "rgba(168, 85, 247, 0.16)",
    circleBorder: "rgba(192, 132, 252, 0.35)",
    accentText: "text-purple-600 dark:text-purple-400",
    badgeText: "text-purple-600 dark:text-purple-300",
    glowShadow:
      "rgba(168, 85, 247, 0.22) 25px 40px 28px -30px, rgba(168, 85, 247, 0.14) 0px 20px 25px -5px",
    hoverShadow:
      "rgba(168, 85, 247, 0.35) 30px 50px 30px -35px, rgba(168, 85, 247, 0.2) 0px 25px 35px 0px",
    iconColor: "#c084fc",
  },
  amber: {
    cardBg:
      "linear-gradient(135deg, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.12) 100%)",
    cardBorder: "rgba(245, 158, 11, 0.35)",
    circleBg: "rgba(245, 158, 11, 0.16)",
    circleBorder: "rgba(251, 191, 36, 0.35)",
    accentText: "text-amber-600 dark:text-amber-400",
    badgeText: "text-amber-600 dark:text-amber-300",
    glowShadow:
      "rgba(245, 158, 11, 0.22) 25px 40px 28px -30px, rgba(245, 158, 11, 0.14) 0px 20px 25px -5px",
    hoverShadow:
      "rgba(245, 158, 11, 0.35) 30px 50px 30px -35px, rgba(245, 158, 11, 0.2) 0px 25px 35px 0px",
    iconColor: "#fbbf24",
  },
};

export function Card3D({
  stepNumber = "01",
  title = "Discover",
  description = "",
  phaseLabel = "PHASE // 01",
  mainIcon: MainIcon,
  miniIcons = [],
  accent = "blue",
  className = "",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const palette = ACCENT_THEMES[accent] || ACCENT_THEMES.blue;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered((prev) => !prev)}
      style={{ perspective: "1000px" }}
      className={cn(
        "group relative w-full max-w-[340px] sm:max-w-none h-[330px] sm:h-[345px] mx-auto select-none",
        className,
      )}
    >
      {/* --- 3D CARD BODY --- */}
      <div
        style={{
          background: palette.cardBg,
          borderColor: palette.cardBorder,
          transformStyle: "preserve-3d",
          transform: isHovered
            ? "rotate3d(1, 1, 0, 26deg)"
            : "rotate3d(0, 0, 0, 0deg)",
          boxShadow: isHovered ? palette.hoverShadow : palette.glowShadow,
        }}
        className="relative h-full w-full rounded-[44px] border transition-all duration-500 ease-in-out"
      >
        {/* --- TOP-RIGHT CONCENTRIC 3D CIRCLES (.logo) --- */}
        <div
          style={{ transformStyle: "preserve-3d" }}
          className="absolute right-0 top-0 pointer-events-none"
        >
          {/* Circle 1 (155px) */}
          <span
            style={{
              background: palette.circleBg,
              borderColor: palette.circleBorder,
              transform: "translate3d(0, 0, 20px)",
              transitionDelay: "0s",
            }}
            className="block absolute aspect-square rounded-full top-[8px] right-[8px] w-[140px] sm:w-[155px] border backdrop-blur-[5px] shadow-[-10px_10px_20px_0px_rgba(0,0,0,0.18)] transition-all duration-500 ease-in-out"
          />

          {/* Circle 2 (125px) */}
          <span
            style={{
              background: palette.circleBg,
              borderColor: palette.circleBorder,
              transform: isHovered
                ? "translate3d(0, 0, 60px)"
                : "translate3d(0, 0, 40px)",
              transitionDelay: "0.12s",
            }}
            className="block absolute aspect-square rounded-full top-[10px] right-[10px] w-[114px] sm:w-[126px] border backdrop-blur-[2px] shadow-[-10px_10px_20px_0px_rgba(0,0,0,0.18)] transition-all duration-500 ease-in-out"
          />

          {/* Circle 3 (98px) */}
          <span
            style={{
              background: palette.circleBg,
              borderColor: palette.circleBorder,
              transform: isHovered
                ? "translate3d(0, 0, 80px)"
                : "translate3d(0, 0, 60px)",
              transitionDelay: "0.24s",
            }}
            className="block absolute aspect-square rounded-full top-[16px] right-[16px] w-[88px] sm:w-[98px] border backdrop-blur-[3px] shadow-[-10px_10px_20px_0px_rgba(0,0,0,0.18)] transition-all duration-500 ease-in-out"
          />

          {/* Circle 4 (72px) */}
          <span
            style={{
              background: palette.circleBg,
              borderColor: palette.circleBorder,
              transform: isHovered
                ? "translate3d(0, 0, 100px)"
                : "translate3d(0, 0, 80px)",
              transitionDelay: "0.36s",
            }}
            className="block absolute aspect-square rounded-full top-[22px] right-[22px] w-[64px] sm:w-[72px] border backdrop-blur-[4px] shadow-[-10px_10px_20px_0px_rgba(0,0,0,0.18)] transition-all duration-500 ease-in-out"
          />

          {/* Circle 5 (46px - Core Icon Holder) */}
          <span
            style={{
              background: palette.circleBg,
              borderColor: palette.circleBorder,
              transform: isHovered
                ? "translate3d(0, 0, 120px)"
                : "translate3d(0, 0, 100px)",
              transitionDelay: "0.48s",
            }}
            className="grid place-content-center absolute aspect-square rounded-full top-[28px] right-[28px] w-[42px] sm:w-[46px] border backdrop-blur-[6px] shadow-[-10px_10px_20px_0px_rgba(0,0,0,0.25)] transition-all duration-500 ease-in-out"
          >
            {MainIcon ? (
              <MainIcon
                className="w-5 h-5"
                style={{ color: palette.iconColor }}
                strokeWidth={2.2}
              />
            ) : (
              <span
                className="text-xs font-mono font-bold"
                style={{ color: palette.iconColor }}
              >
                {stepNumber}
              </span>
            )}
          </span>
        </div>

        {/* --- INNER CURVED FROSTED GLASS PLATE (.glass) --- */}
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: "translate3d(0px, 0px, 25px)",
          }}
          className="absolute inset-[8px] rounded-[48px] rounded-tr-[100%] bg-gradient-to-t from-white/75 to-white/95 dark:from-neutral-950/80 dark:to-neutral-900/90 backdrop-blur-md border-l border-b border-white/80 dark:border-white/15 transition-all duration-500 ease-in-out pointer-events-none"
        />

        {/* --- FOREGROUND TEXT CONTENT (.content) --- */}
        <div
          style={{ transform: "translate3d(0, 0, 26px)" }}
          className="relative pt-[88px] sm:pt-[96px] pr-[48px] sm:pr-[54px] pl-[26px] sm:pl-[28px] pointer-events-none"
        >
          <span
            className={cn(
              "block font-mono text-[11px] font-bold uppercase tracking-[0.25em] mb-1.5",
              palette.accentText,
            )}
          >
            STEP {stepNumber}
          </span>

          <h3 className="block text-foreground font-sans font-extrabold text-xl sm:text-[22px] tracking-tight leading-snug">
            {title}
          </h3>

          <p className="block text-muted-foreground font-sans text-[13.5px] sm:text-[14px] leading-[1.65] mt-3">
            {description}
          </p>
        </div>

        {/* --- BOTTOM FLOATING 3D BADGES & PHASE INDICATOR (.bottom) --- */}
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: "translate3d(0, 0, 26px)",
          }}
          className="absolute bottom-[20px] left-[22px] right-[22px] py-[8px] px-[6px] flex items-center justify-between pointer-events-none"
        >
          {/* 3 Non-Clickable 3D Floating Pillar Badges */}
          <div
            style={{ transformStyle: "preserve-3d" }}
            className="flex items-center gap-2.5"
          >
            {miniIcons.slice(0, 3).map((MiniIcon, idx) => (
              <div
                key={idx}
                style={{
                  transform: isHovered
                    ? "translate3d(0, 0, 50px)"
                    : "translate3d(0, 0, 0px)",
                  transitionDelay: isHovered
                    ? `${0.2 + idx * 0.12}s`
                    : `${idx * 0.06}s`,
                  boxShadow: isHovered
                    ? "rgba(0, 0, 0, 0.35) -5px 18px 12px 0px"
                    : "rgba(0, 0, 0, 0.2) 0px 6px 6px -4px",
                }}
                className="w-[30px] aspect-square rounded-full bg-white dark:bg-neutral-900 border border-border/60 dark:border-white/15 grid place-content-center transition-all duration-300 ease-in-out"
              >
                <MiniIcon
                  className={cn("w-3.5 h-3.5", palette.badgeText)}
                  strokeWidth={2.2}
                />
              </div>
            ))}
          </div>

          {/* Non-Clickable Phase Tag */}
          <div
            style={{
              transform: isHovered
                ? "translate3d(0, 0, 15px)"
                : "translate3d(0, 0, 0px)",
            }}
            className="flex items-center justify-end transition-transform duration-300 ease-in-out"
          >
            <span
              className={cn(
                "font-mono text-[10px] sm:text-[11px] font-bold tracking-widest uppercase",
                palette.accentText,
              )}
            >
              {phaseLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card3D;
