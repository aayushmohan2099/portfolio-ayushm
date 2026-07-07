// src/App.jsx
import React, { useState, useEffect } from "react";
import { LayoutGroup, AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./components/SplashScreen";
import Title from "./components/Title/Title";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ScrollBlurTransition } from "@/components/ui/oc/ScrollBlurTransition";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [shouldStartMusic, setShouldStartMusic] = useState(false);

  // Prevent scrolling while splash screen is active
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showSplash]);

  return (
    <div className="bg-background min-h-screen no-scrollbar text-foreground font-sans select-none touch-none">
      <SmoothCursor />

      <LayoutGroup>
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

            <ScrollBlurTransition delay={0.2}>
              <div className="h-screen w-full flex items-center justify-center border-t border-border">
                <h2 className="text-muted-foreground text-2xl font-medium tracking-tight">
                  Experience Section Coming Next...
                </h2>
              </div>
            </ScrollBlurTransition>
          </motion.main>
        )}
      </LayoutGroup>
    </div>
  );
}

export default App;
