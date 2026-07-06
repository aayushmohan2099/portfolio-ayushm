// src/App.jsx
import React, { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import Title from "./components/Title/Title";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ScrollBlurTransition } from "@/components/ui/oc/ScrollBlurTransition";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Optional: Prevent scrolling while splash screen is active
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showSplash]);

  return (
    <div className="bg-background min-h-screen no-scrollbar text-foreground font-sans">
      {/* Global Smooth Cursor */}
      <SmoothCursor />

      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {!showSplash && (
        <main>
          {/* Section 1: The Title Area */}
          <ScrollBlurTransition delay={0.1}>
            <div className="title-bg-anim">
              <Title />
            </div>
          </ScrollBlurTransition>

          {/* Section 2: Experience Placeholder */}
          {/* We add a slight delay so it staggers in naturally if you scroll fast */}
          <ScrollBlurTransition delay={0.2}>
            <div className="h-screen w-full flex items-center justify-center border-t border-border">
              <h2 className="text-muted-foreground text-2xl font-medium tracking-tight">
                Experience Section Coming Next...
              </h2>
            </div>
          </ScrollBlurTransition>

          {/* 
            In the future, simply wrap any new sections you build like this:
            <ScrollBlurTransition>
               <ProjectsSection />
            </ScrollBlurTransition>
          */}
        </main>
      )}
    </div>
  );
}

export default App;
