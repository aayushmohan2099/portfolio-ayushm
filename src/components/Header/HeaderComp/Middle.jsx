// src/components/Header/HeaderComp/Middle.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { NeonFont } from "@/components/ui/oc/NeonFont";

// Import your Display Picture
import dpImage from "@/assets/dp.jpg";

// ==========================================
// CONFIGURATION: HEADER NAVIGATION SECTIONS
// ==========================================
const NAV_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const Middle = () => {
  const { theme, resolvedTheme } = useTheme();
  const [activeSection, setActiveSection] = useState(() => {
    const path = window.location.pathname;
    if (path === "/about") return "about";
    if (path.startsWith("/experience")) return "experience";
    if (path === "/contact-me" || path === "/contact") return "contact";
    return "home";
  });

  // Keep active tab synced if navigation is triggered from outside the header
  useEffect(() => {
    const syncActiveTab = (e) => {
      const payload = e.detail;
      const targetPath = typeof payload === "string" ? payload : payload?.path;
      if (targetPath === "/" || targetPath === "/home")
        setActiveSection("home");
      else if (targetPath === "/about") setActiveSection("about");
      else if (targetPath?.startsWith("/experience"))
        setActiveSection("experience");
      else if (targetPath === "/contact-me" || targetPath === "/contact")
        setActiveSection("contact");
    };

    window.addEventListener("app-navigate", syncActiveTab);
    return () => window.removeEventListener("app-navigate", syncActiveTab);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for the Logo tooltip
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Unified navigation handler to trigger custom route transitions
  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);

    if (sectionId === "about") {
      window.dispatchEvent(
        new CustomEvent("app-navigate", {
          detail: {
            path: "/about",
            variant: "fade",
            changeTheme: 0,
            overlayText: "Wanna know About ME?",
          },
        }),
      );
    } else if (sectionId === "contact") {
      window.dispatchEvent(
        new CustomEvent("app-navigate", {
          detail: {
            path: "/contact-me",
            variant: "draw",
            changeTheme: 0,
            overlayText: "CONNECTING...",
          },
        }),
      );
    } else if (sectionId === "home") {
      window.dispatchEvent(
        new CustomEvent("app-navigate", {
          detail: {
            path: "/home",
            variant: "fade",
            changeTheme: 0,
            overlayText: "Back to Home!",
          },
        }),
      );
    } else if (sectionId === "experience") {
      window.dispatchEvent(
        new CustomEvent("app-navigate", {
          detail: {
            path: "/experience",
            variant: "fade",
            changeTheme: 0,
            overlayText: "Sure! Let me tell you about my Experiences",
          },
        }),
      );
    }
  };

  return (
    <div className="relative h-full w-full min-w-0 flex items-center justify-center px-0.5 sm:px-2 md:px-3 overflow-visible">
      <div className="relative flex h-11 sm:h-14 md:h-16 w-full max-w-5xl items-center justify-between gap-2 md:gap-4 rounded-full border border-border/40 bg-background/85 px-3 sm:px-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-3xl dark:border-white/10 dark:bg-black/65 dark:shadow-[0_8px_32px_rgba(255,255,255,0.04)]">
        {/* --- LEFT AREA: Status Indicator & Logo --- */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 min-w-0">
          {/* DP Profile with Shine and Overlapping Green Dot */}
          <div className="flex items-center sm:pl-1 shrink-0">
            <div className="relative group/dp w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-border/50 overflow-visible cursor-pointer shadow-sm">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-muted">
                <img
                  src={dpImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {/* Coin Shine Hover Effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover/dp:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
              </div>
              {/* Overlapping Green Status Dot[cite: 1] */}
              <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 translate-x-[15%] translate-y-[15%]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 bg-green-500 border-[2px] sm:border-[2.5px] border-background shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              </span>
            </div>
          </div>

          <div className="relative flex h-full items-center z-20 min-w-0">
            {/* CRITICAL: The DESTINATION Layout ID */}
            <motion.button
              layoutId="brand-logo"
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("trigger-return-splash"))
              }
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="flex items-center justify-center z-50 relative cursor-pointer outline-none min-w-0"
              transition={{
                type: "spring",
                mass: 1.2,
                stiffness: 100,
                damping: 20,
              }}
              whileTap={{ scale: 0.96 }}
            >
              <NeonFont
                text="ayushmohan"
                fontSize="clamp(1.1rem, 4vw, 1.85rem)"
                blur="18px"
              />

              {/* Smooth Glassmorphism Tooltip (Desktop) */}
              <AnimatePresence>
                {isLogoHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-4 px-3 py-1.5 rounded-lg bg-background/60 backdrop-blur-md border border-border/30 shadow-[0_4px_20px_rgba(0,0,0,0.15)] pointer-events-none whitespace-nowrap z-50"
                  >
                    <span className="text-xs font-semibold text-foreground/90 tracking-wide">
                      Back to intro?
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* --- CENTER AREA: Desktop Navigation --- */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 relative z-10 shrink-0">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => handleNavigation(section.id)}
              className={`relative px-2.5 lg:px-4 py-3.5 text-xs lg:text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeSection === section.id
                  ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="relative z-10">{section.label}</span>
              {activeSection === section.id && (
                <>
                  <motion.div
                    layoutId="active-nav-line"
                    className="absolute bottom-1 left-1/4 right-1/4 h-[2px] rounded-t-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                  <motion.div
                    layoutId="active-nav-glow"
                    className="absolute inset-0 -z-10 rounded-full bg-blue-500/10 blur-md"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                </>
              )}
            </button>
          ))}
        </nav>

        {/* --- RIGHT AREA: Call to Action (Desktop) & Mobile Hamburger Toggle --- */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop "Let's Connect" Button (Hidden on mobile so it never overlaps the hamburger icon) */}
          <button
            type="button"
            className="hidden md:inline-flex group relative w-fit shrink-0 items-center gap-1.5 lg:gap-2 overflow-hidden whitespace-nowrap rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 lg:px-5 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold text-foreground transition-all duration-300 hover:border-blue-500/60 hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/ayushms/",
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <span className="relative z-10">Let's Connect</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 text-blue-400 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
            <div className="absolute inset-0 -z-10 -translate-x-[100%] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]"></div>
          </button>

          {/* Mobile Hamburger Button - Dedicated 36x36px unobstructed tap target */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="relative z-[60] flex md:hidden flex-col items-center justify-center gap-1.5 w-9 h-9 rounded-full bg-muted/40 hover:bg-muted/80 text-foreground transition-colors cursor-pointer touch-manipulation shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen((prev) => !prev);
            }}
          >
            <span
              className={`h-0.5 w-4 bg-current rounded-full transition-transform duration-300 ${
                isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-4 bg-current rounded-full transition-opacity duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-4 bg-current rounded-full transition-transform duration-300 ${
                isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU (Fixed full-width across mobile screen) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Tap-outside backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[990] bg-black/25 backdrop-blur-[2px] md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-[4.5rem] sm:top-20 left-3 right-3 z-[999] flex flex-col gap-1.5 rounded-2xl border border-border/60 bg-background/95 dark:bg-neutral-950/95 p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:hidden"
            >
              {NAV_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={`mobile-${section.id}`}
                    type="button"
                    onClick={() => handleNavigation(section.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30"
                        : "text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span>{section.label}</span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
                    )}
                  </button>
                );
              })}

              {/* Mobile "Let's Connect" CTA inside Dropdown */}
              <div className="pt-2 mt-1 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.open(
                      "https://www.linkedin.com/in/ayushms/",
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/15 px-4 py-3 text-sm font-semibold text-foreground hover:bg-blue-500/25 transition-all cursor-pointer"
                >
                  <span>Let's Connect</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Middle;
