// src/App.jsx
import React, { useState, useEffect } from "react";
import { LayoutGroup, AnimatePresence, motion } from "framer-motion";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { TransitionParent } from "@/components/ui/transitionParent";
import MouseEffects from "@/components/ui/click-effects";

// Pages & Shared Header
import SplashScreen from "./components/SplashScreen";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Title from "./components/Title/Title";
import About from "./components/About/About";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [shouldStartMusic, setShouldStartMusic] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  // Header scroll contraction & manual expansion states
  const [isHeaderContracted, setIsHeaderContracted] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Reset to fully expanded when near top
      if (currentScrollY < 60) {
        setIsHeaderContracted(false);
        setIsManuallyExpanded(false);
      } else if (currentScrollY > 110) {
        if (!isManuallyExpanded) {
          setIsHeaderContracted(true);
        }
        // If user scrolls down significantly after expanding, re-contract
        if (currentScrollY - lastScrollY > 60) {
          setIsManuallyExpanded(false);
          setIsHeaderContracted(true);
        }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isManuallyExpanded]);

  // Initialize route from the actual browser URL, fallback to /home
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname;
    return path === "/" ? "/home" : path;
  });

  const [transConfig, setTransConfig] = useState({
    key: 0,
    variant: "morph",
    changeTheme: 0,
    text: "Loading Experience",
  });

  // Prevent scrolling while splash screen is active
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showSplash]);

  // Listen for custom navigation events fired from Header (Middle.jsx)
  useEffect(() => {
    const handleAppNavigate = (e) => {
      const payload = e.detail;
      const targetPath = typeof payload === "string" ? payload : payload?.path;
      if (!targetPath) return;

      // Prevent re-triggering if already on the requested route
      if (!showSplash && targetPath === currentRoute) return;

      let variant = payload?.variant || "morph";
      const changeTheme = payload?.changeTheme ?? 0;
      const text = payload?.overlayText || "Loading Experience";

      // Force 'morph' exclusively for Splash Screen ("/"), and upgrade 'fade' to 'overlay'
      // so the white flash is replaced with the smooth curtain + overlayText animation
      if (targetPath === "/") {
        variant = "morph";
      } else if (variant === "fade" || variant === "morph") {
        variant = "overlay";
      }

      // 1. Mount a fresh TransitionParent instance in its initial hidden state
      setTransConfig({
        key: Date.now(),
        variant,
        changeTheme,
        text,
      });

      // 2. Wait 50ms for the new variant DOM node to mount before firing animation controls
      setTimeout(() => {
        setIsReturning(true);
      }, 50);

      // 3. Exactly at the midpoint (650ms), swap the views behind the covered screen
      setTimeout(() => {
        if (targetPath === "/") {
          setShowSplash(true);
          setShouldStartMusic(false);
          setCurrentRoute("/home");
          window.history.pushState({}, "", "/");
        } else {
          setShowSplash(false);
          setCurrentRoute(targetPath);
          window.history.pushState({}, "", targetPath);
          window.scrollTo(0, 0);
        }
      }, 650);

      // 4. Reset the trigger after the exit animation finishes
      setTimeout(() => {
        setIsReturning(false);
      }, 1550);
    };

    const handleSplash = () => handleAppNavigate({ detail: "/" });

    window.addEventListener("app-navigate", handleAppNavigate);
    window.addEventListener("trigger-return-splash", handleSplash);

    return () => {
      window.removeEventListener("app-navigate", handleAppNavigate);
      window.removeEventListener("trigger-return-splash", handleSplash);
    };
  }, [currentRoute, showSplash]);

  return (
    <div className="bg-background min-h-screen no-scrollbar text-foreground font-sans select-none touch-none">
      <SmoothCursor />
      <MouseEffects
        interactionMode="sniper"
        color="var(--foreground)"
        showLabel={false}
      />
      <LayoutGroup>
        <TransitionParent
          key={transConfig.key}
          trigger={isReturning}
          variant={transConfig.variant}
          changeTheme={transConfig.changeTheme}
          overlayText={transConfig.text}
        />

        <AnimatePresence>
          {showSplash && (
            <SplashScreen
              onComplete={() => {
                setShouldStartMusic(true);
                setShowSplash(false);
                window.history.pushState({}, "", "/home");
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
            {/* Persistent Global Header across ALL routes */}
            <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
              <div className="w-full min-h-[60px] pointer-events-auto">
                <Header
                  shouldStartMusic={shouldStartMusic}
                  isContracted={isHeaderContracted && !isManuallyExpanded}
                  onExpand={() => setIsManuallyExpanded(true)}
                />
              </div>
            </div>

            {currentRoute === "/home" && (
              <div className="title-bg-anim">
                <Title shouldStartMusic={shouldStartMusic} />
              </div>
            )}

            {currentRoute === "/about" && <About />}

            {/* Global Footer rendered across pages */}
            <Footer />
          </motion.main>
        )}
      </LayoutGroup>
    </div>
  );
}

export default App;
