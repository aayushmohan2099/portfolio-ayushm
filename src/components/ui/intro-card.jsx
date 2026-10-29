// src/components/ui/intro-card.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function IntroCard({
  activeTabId,
  activeLabel,
  indexNumber = "01",
  children,
  className = "",
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    isHovered: false,
  });

  // Maps cursor position across the 5x5 tracker matrix (matching Uiverse 00Kubi angles)
  // while allowing inner <a> links to remain 100% clickable!
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width; // 0 to 1
    const relY = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Quantize into 5x5 grid steps like tr-1..tr-25 for authentic cyber-tracker feel
    const col = Math.min(4, Math.max(0, Math.floor(relX * 5))); // 0..4
    const row = Math.min(4, Math.max(0, Math.floor(relY * 5))); // 0..4

    const rotateXValues = [14, 7, 0, -7, -14];
    const rotateYValues = [-8, -4, 0, 4, 8];

    setTilt({
      rotateX: rotateXValues[row],
      rotateY: rotateYValues[col],
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1100px" }}
      className={cn(
        "cyber-intro-container relative w-full min-h-[360px] sm:min-h-[420px] md:min-h-[470px] transition-all duration-200 select-none",
        className,
      )}
    >
      {/* Scoped Uiverse 00Kubi Keyframes & Particle Rules */}
      <style>{`
        @keyframes cyberLineGrow {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(0); opacity: 0; }
        }
        @keyframes cyberScanMove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes cyberParticleFloat {
          0% { transform: translate(0, 0); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translate(calc(var(--x, 0) * 34px), calc(var(--y, 0) * 34px)); opacity: 0; }
        }
        .cyber-line-1 { animation: cyberLineGrow 3.5s linear infinite; transform-origin: left; }
        .cyber-line-2 { animation: cyberLineGrow 3.5s linear infinite 1s; transform-origin: right; }
        .cyber-line-3 { animation: cyberLineGrow 3.5s linear infinite 2s; transform-origin: left; }
        .cyber-line-4 { animation: cyberLineGrow 3.5s linear infinite 1.5s; transform-origin: right; }
        .cyber-scan-active { animation: cyberScanMove 3.2s linear infinite; }
        .cyber-particle-active { animation: cyberParticleFloat 2.4s infinite; }
      `}</style>

      {/* --- MAIN 3D CYBER CARD (#card) --- */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) rotateZ(0deg)`,
          transition: tilt.isHovered
            ? "transform 130ms ease-out, filter 300ms ease, box-shadow 300ms ease"
            : "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), filter 300ms ease, box-shadow 300ms ease",
        }}
        className={cn(
          "relative w-full h-full min-h-[360px] sm:min-h-[420px] md:min-h-[470px] rounded-[24px] sm:rounded-[28px] overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-14 border-2 transition-colors duration-300",
          "bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 dark:from-[#121214] dark:via-[#18181c] dark:to-[#101014]",
          "border-neutral-800/80 dark:border-white/10",
          "shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_0_24px_rgba(0,0,0,0.35)]",
          tilt.isHovered &&
            "brightness-105 border-blue-500/40 dark:border-blue-400/30",
        )}
      >
        {/* Subtle Dot-Matrix Pattern from Reference Image */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Top-Right Folded Note Corner Accent (Matches Reference Screenshot) */}
        <div className="pointer-events-none absolute top-0 right-0 w-9 h-9 sm:w-11 sm:h-11 z-20">
          <div
            className="w-full h-full bg-neutral-700/40 dark:bg-white/10 backdrop-blur-md border-b border-l border-white/15 rounded-bl-xl"
            style={{
              clipPath: "polygon(0 0, 0 100%, 100% 100%)",
            }}
          />
        </div>

        {/* Center Radial Aura (#card::before equivalent) */}
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] blur-2xl transition-opacity duration-300",
            tilt.isHovered ? "opacity-90" : "opacity-30",
          )}
          style={{
            background:
              "radial-gradient(circle at center, rgba(0, 255, 170, 0.08) 0%, rgba(59, 130, 246, 0.07) 45%, transparent 75%)",
          }}
        />

        {/* Diagonal Glare Sweep (.card-glare) */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-300",
            tilt.isHovered ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Horizontal Cyber Lines (.cyber-lines) */}
        <div className="pointer-events-none absolute inset-0">
          <span
            className="cyber-line-1 absolute top-[20%] left-0 w-full h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(92, 103, 255, 0.28), transparent)",
            }}
          />
          <span
            className="cyber-line-2 absolute top-[42%] right-0 w-full h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0, 255, 170, 0.22), transparent)",
            }}
          />
          <span
            className="cyber-line-3 absolute top-[65%] left-0 w-full h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(92, 103, 255, 0.28), transparent)",
            }}
          />
          <span
            className="cyber-line-4 absolute top-[84%] right-0 w-full h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0, 162, 255, 0.24), transparent)",
            }}
          />
        </div>

        {/* Glowing Ambient Orbs (.glowing-elements) */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={cn(
              "absolute -top-8 -left-8 w-36 h-36 rounded-full blur-2xl transition-opacity duration-300",
              tilt.isHovered ? "opacity-100" : "opacity-35",
            )}
            style={{
              background:
                "radial-gradient(circle at center, rgba(0, 255, 170, 0.25) 0%, rgba(0, 255, 170, 0) 70%)",
            }}
          />
          <div
            className={cn(
              "absolute top-1/2 -right-10 -translate-y-1/2 w-40 h-40 rounded-full blur-2xl transition-opacity duration-300",
              tilt.isHovered ? "opacity-100" : "opacity-35",
            )}
            style={{
              background:
                "radial-gradient(circle at center, rgba(59, 130, 246, 0.28) 0%, rgba(59, 130, 246, 0) 70%)",
            }}
          />
          <div
            className={cn(
              "absolute -bottom-8 left-[30%] w-36 h-36 rounded-full blur-2xl transition-opacity duration-300",
              tilt.isHovered ? "opacity-100" : "opacity-35",
            )}
            style={{
              background:
                "radial-gradient(circle at center, rgba(168, 85, 247, 0.24) 0%, rgba(168, 85, 247, 0) 70%)",
            }}
          />
        </div>

        {/* Floating Cyber Particles (.card-particles) */}
        <div className="pointer-events-none absolute inset-0">
          {[
            { top: "38%", left: "18%", x: 1, y: -1 },
            { top: "62%", right: "18%", x: -1, y: -1 },
            { top: "22%", left: "45%", x: 0.6, y: 1 },
            { top: "78%", right: "38%", x: -0.6, y: 1 },
            { top: "32%", left: "68%", x: 1, y: 0.6 },
            { top: "72%", right: "62%", x: -1, y: 0.6 },
          ].map((p, i) => (
            <span
              key={i}
              style={{
                top: p.top,
                left: p.left,
                right: p.right,
                "--x": p.x,
                "--y": p.y,
              }}
              className={cn(
                "absolute w-1.5 h-1.5 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa] opacity-0",
                tilt.isHovered && "cyber-particle-active",
              )}
            />
          ))}
        </div>

        {/* 4 Corner HUD Brackets (.corner-elements) */}
        <div className="pointer-events-none absolute inset-0">
          <span
            className={cn(
              "absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 transition-all duration-300",
              tilt.isHovered
                ? "border-[#5c67ff] shadow-[0_0_10px_rgba(92,103,255,0.6)]"
                : "border-[#5c67ff]/30",
            )}
          />
          <span
            className={cn(
              "absolute top-3.5 right-12 w-4 h-4 border-t-2 border-r-2 transition-all duration-300",
              tilt.isHovered
                ? "border-[#00ffaa] shadow-[0_0_10px_rgba(0,255,170,0.5)]"
                : "border-[#5c67ff]/30",
            )}
          />
          <span
            className={cn(
              "absolute bottom-3.5 left-3.5 w-4 h-4 border-b-2 border-l-2 transition-all duration-300",
              tilt.isHovered
                ? "border-[#00ffaa] shadow-[0_0_10px_rgba(0,255,170,0.5)]"
                : "border-[#5c67ff]/30",
            )}
          />
          <span
            className={cn(
              "absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 transition-all duration-300",
              tilt.isHovered
                ? "border-[#5c67ff] shadow-[0_0_10px_rgba(92,103,255,0.6)]"
                : "border-[#5c67ff]/30",
            )}
          />
        </div>

        {/* Vertical Scan Line (.scan-line) */}
        <div
          className="cyber-scan-active pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(92, 103, 255, 0.08), transparent)",
          }}
        />

        {/* --- TOP SUBTLE CYBER HEADER --- */}
        <div className="relative z-30 flex items-center justify-between gap-4 mb-6 pr-8">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-neutral-400">
              PROFILE // {indexNumber} — {activeLabel}
            </span>
          </div>

          <span
            className={cn(
              "hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.22em] px-2.5 py-0.5 rounded-full border transition-all duration-300",
              tilt.isHovered
                ? "border-[#00ffaa]/50 text-[#00ffaa] bg-[#00ffaa]/10"
                : "border-white/10 text-neutral-500",
            )}
          >
            {tilt.isHovered ? "3D MATRIX ACTIVE" : "HOVER MATRIX"}
          </span>
        </div>

        {/* --- MAIN EDITORIAL CONTENT BODY (Large Modern Typography) --- */}
        <div className="relative z-30 my-auto py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabId}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl sm:text-2xl md:text-[1.75rem] lg:text-[2.1rem] font-normal text-neutral-300/95 font-sans leading-[1.5] sm:leading-[1.48] tracking-tight"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- BOTTOM CYBER SUBTITLE FOOTER --- */}
        <div className="relative z-30 flex items-center justify-between pt-6 mt-4 border-t border-white/5 text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase text-neutral-500">
          <span>AYUSH.M // SYS_INTRO</span>
          <div>
            <span>INTERACTIVE</span>
            <span className="ml-1.5 font-bold bg-gradient-to-r from-[#00ffaa] via-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
              CYBER NODE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntroCard;
