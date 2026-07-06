// src/App.jsx
import React, { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import Title from "./components/Title/Title";
// import CursorGlow from "./ComponentStyles/App/CursorGlow";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

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
    // REMOVED 'cursor-normal' from the className here
    <div className="bg-black min-h-screen no-scrollbar text-white font-sans">
      {/* 
        ADDED the SmoothCursor component at the top level 
        so it replaces the cursor globally. 
      */}
      <SmoothCursor />

      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* 
        We wrap the main content in a motion.div to fade it in 
        cleanly right as the splash screen disappears.
      */}
      {!showSplash && (
        <main>
          <div className="title-bg-anim">
            <Title />

            {/* Temporary placeholder for scrolling to see the parallax effect */}
            <div className="h-screen w-full flex items-center justify-center border-t border-gray-900">
              <h2 className="text-gray-700 text-2xl">
                Experience Section Coming Next...
              </h2>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
