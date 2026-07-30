// src/components/ui/oc/ParaTypography.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ParaTypography({
  // Default configuration perfectly replicating your reference image
  lines = [
    { text: "A CREATOR OF", size: "5.5vw", wordGap: "0.15em" },
    {
      text: "SOUND. FROM PURE",
      size: "7.5vw",
      wordGap: "0.1em",
      filledWords: ["SOUND."],
    },
    { text: "NOISE TO MELODY,", size: "6vw", wordGap: "0.15em" },
    { text: "EVERYDAY LIFE", size: "6vw", wordGap: "0.15em" },
    {
      text: "IS HER SYMPHONY.",
      size: "7.5vw",
      wordGap: "0.1em",
      filledWords: ["SYMPHONY."],
    },
  ],
  lightColor = "#000000",
  darkColor = "#ffffff",
  lineGap = "0.85", // Controls the vertical tightness between lines
  strokeWidth = "1.5px", // Thickness of the outline
  fontFamily = "'Playfair Display', serif", // High-contrast serif to match the image exactly
  className = "",
}) {
  const { theme, resolvedTheme } = useTheme();

  // Determine active theme (handling 'system' default)
  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";
  const activeColor = isDark ? darkColor : lightColor;

  // Animation Sequence: "entering" (Slide-In) -> "filled" (Color Outline) -> "kinetic" (Mouse Hover Pulse)
  const [stage, setStage] = useState("entering");

  // Pre-calculate global character indices to maintain the fluid delay cascade across words and lines
  let charCounter = 0;
  const processedLines = lines.map((line) => {
    const words = line.text.split(" ");
    const processedWords = words.map((word) => {
      const chars = word.split("").map((char) => {
        return { char, index: charCounter++ };
      });
      return { wordText: word, chars, filledWords: line.filledWords || [] };
    });
    return { ...line, words: processedWords };
  });

  const totalChars = charCounter;

  // Handle the automatic chaining of animation stages
  useEffect(() => {
    // 1. Calculate when the slide-in entrance animation will fully finish
    // Updated timings: 50ms stagger per char + 1200ms base transition duration
    const entranceDurationMs = totalChars * 50 + 1200;

    // 2. Wait exactly 1 second (1000ms) AFTER the text has completely rendered before triggering the fill
    const fillTimer = setTimeout(() => {
      setStage("filled");

      // 3. Shortly after filling (allowing 1.5s for the slower CSS fill transition), activate the Kinetic Hover classes
      const kineticTimer = setTimeout(() => {
        setStage("kinetic");
      }, 1500);

      return () => clearTimeout(kineticTimer);
    }, entranceDurationMs + 200); // 1-second delay added here

    return () => clearTimeout(fillTimer);
  }, [totalChars]);

  return (
    <div
      // CRITICAL FIX: pointer-events-auto added here to override the parent SplashScreen's pointer block!
      className={`flex flex-col items-center justify-center select-none pointer-events-auto ${className}`}
    >
      <style>{`
        /* IMPORT VARIABLE FONT FOR KINETIC WEIGHT ANIMATION */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Vibur&display=swap');

        .typo-wrapper {
          --typo-color: ${activeColor};
          --typo-stroke: ${strokeWidth};
          --typo-line-gap: ${lineGap};
          --hover-padding: calc(1em / 12); /* Magic UI padding calculation */
          
          font-family: ${fontFamily};
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .typo-line {
          line-height: var(--typo-line-gap);
          white-space: nowrap;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .typo-word {
          display: inline-flex; /* Required for framer-motion transforms on children */
          font-weight: 400;
          /* SURGICAL CHANGE: Slower, different transition (2s ease-in-out) for the color filling */
          transition: color 1s ease-in-out, -webkit-text-stroke 1s ease-in-out;
        }

        /* OUTLINE MODE: Transparent inside, solid border */
        .typo-outline {
          color: transparent;
          -webkit-text-stroke: var(--typo-stroke) var(--typo-color);
        }

        /* FILLED MODE: Solid inside, stroke matches to keep weight consistent */
        .typo-fill {
          color: var(--typo-color);
          -webkit-text-stroke: var(--typo-stroke) var(--typo-color);
        }
      `}</style>

      <div className="typo-wrapper">
        {processedLines.map((line, lineIndex) => (
          <div
            key={`line-${lineIndex}`}
            className="typo-line"
            style={{ fontSize: line.size || "5vw" }}
          >
            {line.words.map((wordObj, wordIndex) => {
              // Check if this exact word is flagged to be filled
              const isFilledTarget = new Set(wordObj.filledWords).has(
                wordObj.wordText,
              );

              // Apply the fill ONLY if we have passed the "entering" stage
              const applyFill =
                (stage === "filled" || stage === "kinetic") && isFilledTarget;
              const wordClass = applyFill ? "typo-fill" : "typo-outline";

              return (
                <span
                  key={`word-${lineIndex}-${wordIndex}`}
                  className={`typo-word ${wordClass}`}
                  style={{
                    marginRight:
                      wordIndex === line.words.length - 1
                        ? "0"
                        : line.wordGap || "0.2em",
                  }}
                >
                  {wordObj.chars.map((charObj) => {
                    // EXACT MAGIC UI LOGIC: We inject Magic UI sibling selector hover logic ONLY when in kinetic stage.
                    const kineticClasses =
                      stage === "kinetic"
                        ? "[will-change:font-weight,padding,-webkit-text-stroke-width] [transition:font-weight_0.4s,_padding_0.4s,_-webkit-text-stroke-width_0.4s] hover:[padding-inline:var(--hover-padding)] hover:font-[900] hover:[-webkit-text-stroke-width:calc(var(--typo-stroke)*2.5)] has-[+span+span:hover]:font-[400] has-[+span:hover]:[padding-inline:var(--hover-padding)] has-[+span:hover]:font-[600] has-[+span:hover]:[-webkit-text-stroke-width:calc(var(--typo-stroke)*1.5)] [:hover+&]:[padding-inline:var(--hover-padding)] [:hover+&]:font-[600] [:hover+&]:[-webkit-text-stroke-width:calc(var(--typo-stroke)*1.5)] [:hover+span+&]:font-[400]"
                        : "";

                    return (
                      <motion.span
                        key={`char-${charObj.index}`}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={
                          stage === "entering"
                            ? {
                                // SURGICAL CHANGE: Slower stagger and longer, smoother curve
                                delay: charObj.index * 0.05,
                                ease: [0.25, 1, 0.5, 1], // Smooth custom cubic-bezier
                                duration: 1.2,
                              }
                            : { duration: 0.5 }
                        }
                        className={`inline-block ${kineticClasses}`}
                      >
                        {/* Ensures actual spaces don't get truncated by inline-flex */}
                        {charObj.char === " " ? "\u00A0" : charObj.char}
                      </motion.span>
                    );
                  })}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
