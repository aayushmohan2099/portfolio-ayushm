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
    }, 2800);

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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-transparent overflow-hidden pointer-events-auto px-4"
    >
      {/* Wrapper ensures text stays centered and prevents overlap natively via Flexbox */}
      <div className="relative z-10 w-full flex justify-center pointer-events-none mb-10">
        <motion.div
          layoutId="brand-logo"
          className="w-full flex items-center justify-center min-h-[30vh]"
        >
          {/* Renders immediately so the animation is visible from frame 1 */}
          <ParaTypography
            fontFamily="'Vibur', cursive"
            lineGap="1.2"
            strokeWidth="1px"
            lines={[
              {
                text: "HELLO.",
                size: "clamp(3.5rem, 9vw, 7rem)",
                wordGap: "0.2em",
              },
              {
                text: "I'M ayushmohan.",
                size: "clamp(4.5rem, 12vw, 10rem)",
                wordGap: "0.2em",
                filledWords: ["ayushmohan."],
              },
              {
                text: "LET'S CREATE",
                size: "clamp(3.5rem, 9vw, 7rem)",
                wordGap: "0.2em",
              },
              {
                text: "SOMETHING EXTRAORDINARY!",
                size: "clamp(2.2rem, 6vw, 5rem)",
                wordGap: "0.15em",
                filledWords: ["EXTRAORDINARY!"],
              },
            ]}
          />
        </motion.div>
      </div>

      {/* Enter Button container sits safely below the text, natively stacking */}
      <div className="h-16 flex items-center justify-center">
        <AnimatePresence>
          {showEnterButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={handleEnterClick}
              className="group relative z-20 flex items-center justify-center overflow-hidden px-8 py-3 text-foreground font-sans font-light tracking-[0.25em] uppercase text-xs md:text-sm cursor-pointer pointer-events-auto bg-transparent border-none outline-none"
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
                  className="w-8 h-8 md:w-10 md:h-10 text-foreground"
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
