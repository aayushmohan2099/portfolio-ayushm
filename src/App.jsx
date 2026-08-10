// src/App.jsx
import React, { useState, useEffect } from "react";
import { LayoutGroup, AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./components/SplashScreen";
import Title from "./components/Title/Title";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ScrollBlurTransition } from "@/components/ui/oc/ScrollBlurTransition";
import { TransitionParent } from "@/components/ui/transitionParent";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [shouldStartMusic, setShouldStartMusic] = useState(false);
  const [isReturning, setIsReturning] = useState(false); // NEW: Controls the return transition

  // Prevent scrolling while splash screen is active
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showSplash]);

  // NEW: Listen for the custom event fired from the Header (Middle.jsx)
  useEffect(() => {
    const handleReturnToSplash = () => {
      // 1. Trigger the TransitionParent overlay to drop down
      setIsReturning(true);

      // 2. Exactly at the midpoint of the animation (when the screen is fully covered),
      // swap the components seamlessly behind the curtain.
      setTimeout(() => {
        setShowSplash(true);
        setShouldStartMusic(false); // Pause/reset music
      }, 600); // 600ms matches the 'in' duration of TransitionParent morph variant

      // 3. Reset the trigger state after the full animation completes so it can be used again
      setTimeout(() => {
        setIsReturning(false);
      }, 1500);
    };

    window.addEventListener("trigger-return-splash", handleReturnToSplash);
    return () =>
      window.removeEventListener("trigger-return-splash", handleReturnToSplash);
  }, []);

  return (
    <div className="bg-background min-h-screen no-scrollbar text-foreground font-sans select-none touch-none">
      <SmoothCursor />

      <LayoutGroup>
        {/* 
          CRITICAL FIX: TransitionParent now listens to `isReturning`.
          It will ONLY fire when navigating BACK to the splash screen.
          changeTheme={1} ensures the theme swaps beautifully mid-transition!
        */}
        <TransitionParent
          trigger={isReturning}
          variant="morph"
          changeTheme={1}
          overlayText="Loading Experience"
        />

        <AnimatePresence>
          {showSplash && (
            <SplashScreen
              onComplete={() => {
                setShouldStartMusic(true);
                setShowSplash(false);
              }}
            />
          )}
        </AnimatePresence>

        {!showSplash && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="title-bg-anim">
              <Title shouldStartMusic={shouldStartMusic} />
            </div>

            {/* <ScrollBlurTransition delay={0.2}>
              <div className="h-screen w-full flex items-center justify-center border-t border-border">
                <h2 className="text-muted-foreground text-2xl font-medium tracking-tight">
                  Experience Section Coming Next...
                </h2>
              </div>
            </ScrollBlurTransition> */}
          </motion.main>
        )}
      </LayoutGroup>
    </div>
  );
}

export default App;
