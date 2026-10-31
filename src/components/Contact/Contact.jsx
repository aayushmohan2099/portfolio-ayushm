// src/components/Contact/Contact.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Send,
  Download,
  FileText,
  FileCheck2,
  Mail,
  MapPin,
  Copy,
  Check,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  Terminal,
  User,
  Building2,
  Briefcase,
  Clock,
} from "lucide-react";
import VectorWordmark from "@/components/ui/3d-anatomy";

// Safely resolve resume assets from /src/assets/ (excluding Word temporary ~$ lock files)
const rawAssetFiles = import.meta.glob(
  ["/src/assets/*.{pdf,docx,PDF,DOCX}", "!/src/assets/~*.*"],
  {
    eager: true,
    import: "default",
  },
);

function resolveResumeAsset(filename, fallbackPath) {
  const match = Object.entries(rawAssetFiles).find(([filePath]) =>
    filePath.toLowerCase().endsWith(`/${filename.toLowerCase()}`),
  );
  return match ? match[1] : fallbackPath;
}

const ANATOMY_PHRASES = [
  "THE ANATOMY OF DESIGN",
  "CRAFT MEETS PRECISION",
  "SYSTEMS & MOTION",
  "AYUSH MOHAN",
];

const COLLAB_TYPES = [
  "Full-Time / Engineering Leadership",
  "Project Collaboration",
  "System Architecture & Consulting",
  "Custom Web / App Build",
  "General Inquiry",
];

const TIMELINE_OPTIONS = [
  "Immediate / Urgent",
  "Within 1 Month",
  "1 – 3 Months",
  "Flexible / Exploring",
];

// Crisp Brand SVG Icons for Socials
const GithubSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
  </svg>
);

const TwitterXSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const WhatsAppSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.122.553 4.194 1.604 6.018L.098 24l6.104-1.601a11.977 11.977 0 0 0 5.829 1.503h.005c6.645 0 12.03-5.385 12.03-12.031 0-3.214-1.251-6.236-3.524-8.509C18.268 1.252 15.245 0 12.031 0zm6.565 17.163c-.277.781-1.613 1.491-2.244 1.586-.575.086-1.303.122-2.104-.132-.486-.154-1.109-.359-1.908-.704-3.359-1.45-5.553-4.832-5.721-5.056-.168-.224-1.366-1.817-1.366-3.466 0-1.649.864-2.46 1.171-2.795.307-.336.67-.42.893-.42.223 0 .447.002.642.012.206.01.482-.078.754.576.279.67.949 2.318 1.032 2.486.084.168.14.363.028.587-.112.223-.168.363-.335.558-.168.196-.352.437-.503.587-.168.167-.343.349-.147.684.195.335.868 1.432 1.864 2.32 1.281 1.142 2.361 1.496 2.696 1.664.335.168.53.14.726-.084.195-.224.838-.978 1.061-1.313.223-.335.447-.279.754-.168.307.112 1.955.922 2.29 1.09.335.168.558.251.642.391.084.14.084.81-.193 1.591z" />
  </svg>
);

const GmailSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

const SOCIAL_CHANNELS = [
  {
    id: "github",
    label: "GitHub",
    handle: "@aayushmohan2099",
    href: "https://github.com/aayushmohan2099",
    external: true,
    icon: GithubSvg,
    accent:
      "hover:border-zinc-400/60 hover:shadow-[0_0_25px_rgba(255,255,255,0.12)]",
    iconColor: "text-foreground",
  },
  {
    id: "whatsapp",
    label: "WhatsApp Chat",
    handle: "+91 90448 37993",
    href: "https://wa.me/919044837993?text=Hi%20Ayush!%20I%20just%20explored%20your%20portfolio%20and%20would%20love%20to%20connect.",
    external: true,
    icon: WhatsAppSvg,
    accent:
      "hover:border-emerald-500/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]",
    iconColor: "text-emerald-500",
  },
  {
    id: "gmail",
    label: "Gmail Direct",
    handle: "ayushmohan193@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=ayushmohan193@gmail.com",
    external: true,
    icon: GmailSvg,
    accent:
      "hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]",
    iconColor: "text-red-500",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    handle: "@ayushmohan",
    href: "#",
    external: false,
    icon: TwitterXSvg,
    accent:
      "hover:border-sky-400/60 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]",
    iconColor: "text-foreground",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@ayushmohan",
    href: "#",
    external: false,
    icon: InstagramSvg,
    accent:
      "hover:border-pink-500/60 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]",
    iconColor: "text-pink-500",
  },
];

export default function Contact() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = (theme === "system" ? resolvedTheme : theme) !== "light";

  // Interactive phrase state for the WebGL Vector Wordmark
  const [activePhrase, setActivePhrase] = useState(ANATOMY_PHRASES[0]);

  // Form State for Pre-Typed Email Composer
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    collabType: COLLAB_TYPES[0],
    timeline: TIMELINE_OPTIONS[1],
    subject: "",
    message: "",
  });

  const [copiedEmail, setCopiedEmail] = useState(false);

  // Resolve resume paths
  const pdfResumeUrl = useMemo(
    () => resolveResumeAsset("resume.pdf", "/src/assets/resume.pdf"),
    [],
  );
  const atsResumeUrl = useMemo(
    () => resolveResumeAsset("ats_resume.docx", "/src/assets/ats_resume.docx"),
    [],
  );

  // Build formatted Subject & Body from user form inputs
  const draftedMail = useMemo(() => {
    const senderName = formData.name.trim() || "Prospective Collaborator";
    const orgPart = formData.organization.trim()
      ? ` (${formData.organization.trim()})`
      : "";
    const subjectLine =
      formData.subject.trim() ||
      `[${formData.collabType}] Inquiry from ${senderName}${orgPart}`;

    const bodyLines = [
      `Hi Ayush,`,
      ``,
      formData.message.trim() ||
        `I recently explored your portfolio and would love to discuss a potential collaboration / opportunity with you.`,
      ``,
      `---`,
      `COLLABORATION BRIEF:`,
      `• Name: ${senderName}`,
      `• Reply Email: ${formData.email.trim() || "Not specified"}`,
      `• Organization: ${formData.organization.trim() || "Independent / N/A"}`,
      `• Inquiry Type: ${formData.collabType}`,
      `• Target Timeline: ${formData.timeline}`,
      `---`,
      ``,
      `Best regards,`,
      `${senderName}`,
    ].join("\n");

    const encodedTo = encodeURIComponent("ayushmohan193@gmail.com");
    const encodedSubject = encodeURIComponent(subjectLine);
    const encodedBody = encodeURIComponent(bodyLines);

    return {
      subjectLine,
      bodyLines,
      gmailUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`,
      mailtoUrl: `mailto:ayushmohan193@gmail.com?subject=${encodedSubject}&body=${encodedBody}`,
    };
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Primary submit handler: Redirects to Gmail with pre-typed draft (and triggers mailto on mobile)
  const handleDraftSubmit = (e) => {
    e.preventDefault();
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent,
    );
    if (isMobileDevice) {
      window.location.href = draftedMail.mailtoUrl;
    } else {
      window.open(draftedMail.gmailUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText("ayushmohan193@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground font-sans overflow-x-hidden touch-auto pt-40 sm:pt-44 md:pt-28 pb-24 select-none">
      {/* Subtle Ambient Background Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_18%,rgba(56,189,248,0.07),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ====================================================================
            SECTION 1: THE ANATOMY OF DESIGN (WebGL Vector Wordmark Showcase)
        ==================================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 sm:mb-28"
        >
          {/* Top Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                </span>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-muted-foreground">
                  Artistic Engineering // WebGL Shader
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground font-sans leading-[1.08]">
                The Anatomy of Design
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-md leading-relaxed">
              Move your cursor (or touch & drag) across the vector canvas to
              expose the underlying Bézier geometry, dot-matrix skeleton, and
              real-time spatial coordinates.
            </p>
          </div>

          {/* Interactive WebGL Vector Wordmark Stage */}
          <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border border-border/70 dark:border-white/10 bg-[#05070B] shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
            {/* Subtle Architectural Grid Underlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <VectorWordmark
              text={activePhrase}
              background="transparent"
              textColor="#FFFFFF"
              shade="#38bdf8"
              accent="rgba(56, 189, 248, 0.72)"
              reach={320}
              speed={50}
              damping={60}
              handles={{ size: 96, spread: 26, labels: true }}
            />

            {/* Top-Left Shader Telemetry HUD */}
            <div className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/75">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>GLSL // VECTOR_ATLAS_INSPECTOR</span>
            </div>

            {/* Bottom Interactive Phrase Switcher Pills */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {ANATOMY_PHRASES.map((phrase) => {
                  const isSelected = activePhrase === phrase;
                  return (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => setActivePhrase(phrase)}
                      className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? "bg-sky-400 text-neutral-950 border-sky-400 font-bold shadow-[0_0_16px_rgba(56,189,248,0.5)]"
                          : "bg-black/60 text-white/70 border-white/15 hover:text-white hover:border-white/35 backdrop-blur-md"
                      }`}
                    >
                      {phrase}
                    </button>
                  );
                })}
              </div>

              <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-white/45">
                HOVER TO DECONSTRUCT
              </span>
            </div>
          </div>
        </motion.section>

        {/* ====================================================================
            SECTION 2: COLLABORATION FORM, RESUME VAULT & SOCIAL COMMAND CENTER
        ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* --- LEFT COLUMN (5 Cols): Resume Downloads, Direct Contact & Socials --- */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col space-y-8"
          >
            {/* Intro Copy */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-blue-500 dark:text-blue-400 font-semibold">
                INITIATE TRANSMISSION
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-sans">
                Let's build something extraordinary.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Whether you're hiring for an engineering leadership role,
                architecting a complex platform, or looking to collaborate on a
                new product — my inbox is always open.
              </p>
            </div>

            {/* --- DUAL RESUME DOWNLOAD VAULT (PDF + ATS DOCX) --- */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/70 dark:border-white/10 bg-card/60 dark:bg-neutral-900/55 backdrop-blur-xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-foreground font-semibold flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  Curriculum Vitae / Resume
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  UPDATED 2026
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Download my standard visual portfolio (For collaborators) (PDF) or my resume (For recruiters) (DOCX).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. Standard Visual PDF Resume */}
                <a
                  href={pdfResumeUrl}
                  download="Ayush_M_Srivastava_Portfolio.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-sans font-semibold text-xs sm:text-sm shadow-[0_0_24px_rgba(59,130,246,0.35)] transition-all duration-300 cursor-pointer no-underline"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>Portfolio (PDF)</span>
                  </span>
                  <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </a>

                {/* 2. ATS-Optimized DOCX Resume */}
                <a
                  href={atsResumeUrl}
                  download="Ayush_M_Srivastava_Resume.docx"
                  className="group flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-border/80 dark:border-white/15 bg-background/80 hover:border-blue-400/60 hover:bg-blue-500/10 text-foreground font-sans font-semibold text-xs sm:text-sm transition-all duration-300 cursor-pointer no-underline"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Resume (.DOCX)</span>
                  </span>
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* --- DIRECT EMAIL & LOCATION PILL --- */}
            <div className="p-5 rounded-2xl border border-border/60 dark:border-white/10 bg-card/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Direct Inbox
                </span>
                <p className="text-sm sm:text-base font-bold text-foreground font-mono break-all">
                  ayushmohan193@gmail.com
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Lucknow, Uttar Pradesh, India</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-mono uppercase tracking-wider text-foreground transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            {/* --- SOCIAL CHANNELS MATRIX --- */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                Social & Direct Channels
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SOCIAL_CHANNELS.map((item) => {
                  const IconComponent = item.icon;
                  const isPlaceholder = item.href === "#";

                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (isPlaceholder) e.preventDefault();
                      }}
                      className={`group flex items-center justify-between p-3.5 rounded-2xl border border-border/60 dark:border-white/10 bg-card/50 dark:bg-neutral-900/45 backdrop-blur-md transition-all duration-300 no-underline ${item.accent}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-muted/60 dark:bg-white/[0.06] border border-border/50 flex items-center justify-center shrink-0">
                          <IconComponent
                            className={`w-4 h-4 ${item.iconColor}`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-foreground leading-tight truncate">
                            {item.label}
                          </p>
                          <p className="text-[11px] font-mono text-muted-foreground truncate">
                            {item.handle}
                          </p>
                        </div>
                      </div>

                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT COLUMN (7 Cols): Pre-Typed Email Composer Form --- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 w-full"
          >
            <form
              onSubmit={handleDraftSubmit}
              className="p-6 sm:p-8 md:p-10 rounded-3xl border border-border/70 dark:border-white/10 bg-card/70 dark:bg-neutral-900/65 backdrop-blur-2xl shadow-2xl space-y-6"
            >
              {/* Form Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border/60 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="font-mono text-xs uppercase tracking-[0.22em] text-foreground font-semibold">
                    Interactive Mail Composer
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  TO: ayushmohan193@gmail.com
                </span>
              </div>

              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Your Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/80 dark:bg-black/50 border border-border/80 dark:border-white/15 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500 transition-colors select-text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Your Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/80 dark:bg-black/50 border border-border/80 dark:border-white/15 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500 transition-colors select-text"
                  />
                </div>
              </div>

              {/* Row 2: Organization & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Company / Organization</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Startup, Agency, or Team"
                    value={formData.organization}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-background/80 dark:bg-black/50 border border-border/80 dark:border-white/15 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500 transition-colors select-text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Target Timeline</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {TIMELINE_OPTIONS.map((opt) => {
                      const active = formData.timeline === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleInputChange("timeline", opt)}
                          className={`px-2.5 py-2 rounded-lg text-[11px] font-mono transition-all cursor-pointer border truncate ${
                            active
                              ? "bg-blue-500/15 border-blue-500/60 text-blue-400 font-semibold"
                              : "bg-background/50 border-border/60 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 3: Collaboration Type Selector Pills */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>What are we collaborating on?</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLLAB_TYPES.map((type) => {
                    const isSelected = formData.collabType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange("collabType", type)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? "bg-foreground text-background border-foreground font-semibold shadow-sm"
                            : "bg-background/60 text-muted-foreground border-border/70 hover:text-foreground hover:border-foreground/40"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Custom Subject Line */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  <span>Subject Line (Auto-generated if left blank)</span>
                </label>
                <input
                  type="text"
                  placeholder={draftedMail.subjectLine}
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background/80 dark:bg-black/50 border border-border/80 dark:border-white/15 text-sm text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:border-blue-500 transition-colors select-text"
                />
              </div>

              {/* Row 5: Message Body */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Project Details / Message *</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about the role, project scope, architecture goals, or how we can work together..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background/80 dark:bg-black/50 border border-border/80 dark:border-white/15 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500 transition-colors resize-y select-text"
                />
              </div>

              {/* Live Pre-Typed Draft Preview Accordion */}
              <div className="p-4 rounded-2xl bg-background/70 dark:bg-black/45 border border-border/60 dark:border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <span>LIVE DRAFT PREVIEW</span>
                  <span className="text-emerald-400">READY TO DISPATCH</span>
                </div>
                <p className="text-xs font-mono text-foreground/90 truncate">
                  <span className="text-muted-foreground">Subject: </span>
                  {draftedMail.subjectLine}
                </p>
              </div>

              {/* Submit Actions: Direct Gmail Redirect + Native Mailto */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-sans font-semibold text-sm tracking-wide shadow-[0_0_28px_rgba(59,130,246,0.4)] transition-all duration-300 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Open Pre-Typed Draft in Gmail</span>
                </button>

                <a
                  href={draftedMail.mailtoUrl}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-border/80 dark:border-white/15 bg-background/80 hover:bg-muted text-foreground font-mono text-xs uppercase tracking-wider transition-colors no-underline"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Default Mail App</span>
                </a>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
