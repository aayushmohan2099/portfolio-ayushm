// src/components/About/About.jsx
import React from "react";
import Section1 from "./Components/Section1";
import Section2 from "./Components/Section2";
import Section3 from "./Components/Section3";

export default function About() {
  return (
    // touch-auto enables smooth scrolling on mobile; top padding clears the fixed Header from App.jsx
    <div className="relative w-full min-h-screen bg-background text-foreground font-sans overflow-x-hidden touch-auto pt-44 sm:pt-48 md:pt-24">
      {/* Subtle ambient background glow matching the portfolio theme */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.06),transparent_60%)]" />

      <div className="relative z-10 w-full">
        {/* Section 1: Intro Header & Interactive DP */}
        <Section1 />

        {/* Section 2: Personal Journey Scroll Timeline */}
        <Section2 />

        {/* Section 3: How I Work - 3D Engineering Process Cards */}
        <Section3 />
      </div>
    </div>
  );
}
