// src/components/About/Components/Section2.jsx
import React from "react";
import { ScrollTimeline } from "@/components/ui/scroll-timeline";

const AYUSH_JOURNEY_EVENTS = [
  {
    id: "01",
    year: "01",
    tag: "ORIGIN // LUCKNOW",
    title: "Roots in Lucknow",
    description:
      "I grew up in Lucknow — a city where centuries-old architectural symmetry and timeless tehzeeb stand alongside rapid modern transformation. Being raised in that contrast shaped how I observe the world and how I build. It taught me that the most enduring creations balance deep structural integrity with effortless grace — a philosophy that quietly guides every system and interface I design today.",
  },
  {
    id: "02",
    year: "02",
    tag: "SPARK // CURIOSITY",
    title: "It All Starts with Curiosity",
    description:
      "Long before I wrote production software, I was drawn to how digital worlds make people feel. From dissecting operating systems during my BCA days at Lucknow University to losing myself in richly crafted interactive games, I realized code wasn't just cold logic. Behind every screen is a stage — a space where motion, timing, and architecture come together to create something immersive and alive.",
  },
  {
    id: "03",
    year: "03",
    tag: "SHIFT // PURPOSE",
    title: "From Tinkering to Making",
    description:
      "When the pandemic brought the physical world to a sudden standstill, the digital realm became humanity's lifeline. In that stillness, my curiosity turned into conviction. While building health and vaccination management workflows, I saw firsthand how software lingers, scales, and quietly supports real lives in moments of uncertainty. That realization pulled me deeper into full-stack engineering.",
  },
  {
    id: "04",
    year: "04",
    tag: "EVOLUTION // SYSTEMS",
    title: "Stepping Into Systems Architecture",
    description:
      "While pursuing my MCA in AI/ML & Web Development and stepping into fast-paced EdTech engineering, I learned the difference between code that merely runs and systems that endure. Working across search engines, analytical pipelines, and interactive React ecosystems taught me to zoom out — thinking not just about isolated features, but about data integrity, user trust, and operational scale.",
  },
  {
    id: "05",
    year: "05",
    tag: "PHILOSOPHY // CRAFT",
    title: "Embracing Craft as Care",
    description:
      "Across nearly three years of building private platforms and large-scale public digital ecosystems, I've come to see engineering as a practice of care. Whether architecting an offline-first mobile app for field cadres in low-network villages or refining a 60fps micro-interaction, I find joy in stripping away friction — making complex systems simpler, more resilient, and more human.",
  },
  {
    id: "06",
    year: "06",
    tag: "HORIZON // NEXT",
    title: "The Future is Now",
    description:
      "Today, I stand at the intersection of full-stack systems architecture and creative frontend engineering. Equipped with a toolkit spanning scalable APIs, intelligent data workflows, and fluid motion design, I'm always eager to keep learning — ready to collaborate with ambitious teams, solve hard problems, and engineer digital experiences that leave a lasting mark.",
  },
];

export default function Section2() {
  return (
    <section className="relative w-full bg-background text-foreground">
      {/* Subtle top divider glow */}
      <div className="max-w-4xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-60" />

      <ScrollTimeline
        events={AYUSH_JOURNEY_EVENTS}
        // eyebrow="SCROLL"
        title="MY JOURNEY INTO ENGINEERING"
        subtitle="From taking things apart out of curiosity to architecting production ecosystems with intention."
        cardAlignment="alternating"
        cardVariant="glass"
        progressIndicator={true}
        parallaxIntensity={0.08}
        progressLineWidth={2}
      />
    </section>
  );
}
