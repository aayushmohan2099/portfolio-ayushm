// src/components/SplashScreen.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextAnimate } from "@/components/ui/text-animate";
import { NeonFont } from "@/components/ui/oc/NeonFont";
import { useTheme } from "next-themes";

const SplashScreen = ({ onComplete }) => {
  const [showEnterButton, setShowEnterButton] = useState(false);

  // Bring in theme detection
  const { theme, resolvedTheme } = useTheme();
  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://cdn.simpleicons.org";
    document.head.appendChild(link);

    const audioPreload = new Audio();
    audioPreload.src = "/music/01.mp3";
    audioPreload.preload = "auto";

    const loadingTimer = setTimeout(() => {
      setShowEnterButton(true);
    }, 1000);

    return () => {
      document.head.removeChild(link);
      clearTimeout(loadingTimer);
    };
  }, []);

  const handleEnterClick = () => {
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }} // Smooth fade out when App.jsx unmounts it
      transition={{ duration: 0.8, ease: "easeInOut" }}
      // Changed bg-black to bg-background to respect global theme
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden pointer-events-auto"
    >
      {/* Removed the hardcoded 'dark' class so NeonFont can adapt naturally */}
      <div className="relative z-10 flex flex-col items-center mb-[300px] justify-center w-full pointer-events-none">
        {/* CRITICAL: The ORIGIN Layout ID */}
        <motion.div layoutId="brand-logo">
          {/* Mobile */}
          <div className="block md:hidden scale-50 origin-center">
            <NeonFont text="ayushmohan" fontSize="15vh" blur="120px" />
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <NeonFont text="ayushmohan" fontSize="15vh" blur="120px" />
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence>
          {showEnterButton && (
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                scale: 1.05,
                // Adapt the hover glow based on the active theme
                filter: isDark
                  ? "brightness(120%) drop-shadow(0 0 10px rgba(255,255,255,0.8))"
                  : "drop-shadow(0 0 10px rgba(0,0,0,0.3))",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring" }}
              onClick={handleEnterClick}
              // Changed text-white to text-foreground to match the theme
              className="relative z-20 mt-[300px] px-8 py-3 text-foreground font-medium tracking-widest uppercase text-sm cursor-pointer pointer-events-auto bg-transparent border-none outline-none"
              style={{
                "--glow": isDark
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(0, 0, 0, 0.7)",
                "--blur": "12px",
                "--box-blur": "calc(0.5 * var(--blur))",
                // Remove text-shadow in light mode to match NeonFont behavior
                textShadow: isDark ? "0 0 var(--blur) var(--glow)" : "none",
              }}
            >
              <TextAnimate animation="blurIn" as="span">
                Enter Experience
              </TextAnimate>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
