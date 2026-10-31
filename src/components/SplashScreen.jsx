// src/components/SplashScreen.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextAnimate } from "@/components/ui/text-animate";
import { ParaTypography } from "@/components/ui/oc/ParaTypography";
import { useTheme } from "next-themes";
import { ArrowRightCircle } from "lucide-react";

const SplashScreen = ({ onComplete }) => {
  const [showEnterButton, setShowEnterButton] = useState(false);

  // Bring in theme detection
  const { theme, resolvedTheme } = useTheme();
  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  // Simply wait for the ParaTypography animation to finish before showing the button
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnterButton(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnterClick = () => {
    window.dispatchEvent(new Event("app-entered"));
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }} // Smooth fade out when App.jsx unmounts it
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] w-full h-screen h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center bg-transparent overflow-hidden pointer-events-auto px-3 sm:px-6 py-4 sm:py-6"
    >
      {/* Wrapper ensures text stays centered and scales cleanly within both width and height */}
      <div className="relative z-10 w-full max-w-[96vw] flex items-center justify-center pointer-events-none mb-4 sm:mb-6 md:mb-8 shrink">
        <motion.div
          layoutId="brand-logo"
          className="w-full flex items-center justify-center"
        >
          {/* Renders immediately so the animation is visible from frame 1 */}
          <ParaTypography
            fontFamily="'Vibur', cursive"
            lineGap="1.12"
            strokeWidth="1px"
            lines={[
              {
                text: "HELLO.",
                size: "clamp(1.65rem, min(7.5vw, 9.5dvh), 6.2rem)",
                wordGap: "0.18em",
              },
              {
                text: "I'M ayushmohan.",
                size: "clamp(1.85rem, min(8.8vw, 11.5dvh), 8.2rem)",
                wordGap: "0.16em",
                filledWords: ["ayushmohan."],
              },
              {
                text: "LET'S CREATE",
                size: "clamp(1.6rem, min(7.5vw, 9.5dvh), 6.2rem)",
                wordGap: "0.18em",
              },
              {
                text: "SOMETHING EXTRAORDINARY!",
                size: "clamp(1.05rem, min(4.8vw, 6.2dvh), 4.2rem)",
                wordGap: "0.12em",
                filledWords: ["EXTRAORDINARY!"],
              },
            ]}
          />
        </motion.div>
      </div>

      {/* Enter Button container sits safely below the text with shrink-0 so it is never pushed off-screen */}
      <div className="h-12 sm:h-14 md:h-16 shrink-0 flex items-center justify-center">
        <AnimatePresence>
          {showEnterButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={handleEnterClick}
              className="group relative z-20 flex items-center justify-center overflow-hidden px-6 sm:px-8 py-2.5 sm:py-3 text-foreground font-sans font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[11px] sm:text-xs md:text-sm cursor-pointer pointer-events-auto bg-transparent border-none outline-none whitespace-nowrap"
            >
              {/* Invisible placeholder to maintain the button's exact width during absolute transitions */}
              <span className="invisible flex items-center justify-center">
                Click here to proceed
              </span>

              {/* The Text - Slides up and fades out on hover */}
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full group-hover:opacity-0">
                <TextAnimate animation="blurIn" as="span">
                  Click here to proceed
                </TextAnimate>
              </span>

              {/* The Icon - Slides up from the bottom and fades in on hover */}
              <span className="absolute inset-0 flex items-center justify-center translate-y-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowRightCircle
                  strokeWidth={1}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-foreground"
                />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
