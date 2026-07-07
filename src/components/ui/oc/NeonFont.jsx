// src/components/ui/oc/NeonFont.jsx
import React from "react";
import { useTheme } from "next-themes";

export function NeonFont({
  text = "AyushMohan",
  lightColor = "#000000", // Blu-ish for light mode
  darkColor = "#ffffff", // White for dark mode
  blur = "100px",
  fontSize = "19vh",
  blinkSpeed1 = "2s",
  blinkSpeed2 = "3s",
  className = "",
}) {
  const { theme, resolvedTheme } = useTheme();

  // Determine if we are in dark mode (handling 'system' default)
  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  // Select the active glow color based on the theme
  const activeColor = isDark ? darkColor : lightColor;

  // We split the text into an array so we can wrap random letters in <span> to apply the blink animation
  const letters = text.split("");

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      {/* We inject a scoped stylesheet to handle the complex CSS keyframes 
        while preserving the dynamic colors via CSS variables.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vibur&display=swap');
        
        .neon-wrapper {
          --neon-color: ${activeColor};
          --neon-blur: ${blur};
          font-family: 'Vibur', cursive;
          font-size: ${fontSize};
          font-weight: 400;
          color: ${isDark ? "#fee" : "var(--neon-color)"};
          text-shadow: ${
            isDark
              ? "0 -40px var(--neon-blur), 0 0 2px, 0 0 1em var(--neon-color), 0 0 0.5em var(--neon-color), 0 0 0.1em var(--neon-color), 0 10px 3px #000"
              : "none"
          };
        }

        .neon-wrapper span {
          animation: blink linear infinite ${blinkSpeed1};
        }
        
        .neon-wrapper span:nth-of-type(2) {
          animation: blink linear infinite ${blinkSpeed2};
        }

        @keyframes blink {
          78% { color: inherit; text-shadow: inherit; }
          79% { color: #333; }
          80% { text-shadow: none; }
          81% { color: inherit; text-shadow: inherit; }
          82% { color: #333; text-shadow: none; }
          83% { color: inherit; text-shadow: inherit; }
          92% { color: #333; text-shadow: none; }
          92.5% { color: inherit; text-shadow: inherit; }
        }
      `}</style>

      <div className="neon-wrapper">
        {letters.map((char, index) => {
          // Wrap specific index letters in spans to trigger the blinking effect
          // e.g., the 2nd and 4th letters blink
          if (index === 1 || index === 3) {
            return <span key={index}>{char}</span>;
          }
          return <React.Fragment key={index}>{char}</React.Fragment>;
        })}
      </div>
    </div>
  );
}
