/* eslint-disable */
// src/components/ui/depth-gallery.jsx
// Depth Gallery — Originkit (Adapted to responsive JSX + live index sync)

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* -------------------------------------------------------------- constants */

const VIEW_LEAD = 1;
const PERSPECTIVE_RATIO = 3.2;
const GAP_MIN = 0.26;
const GAP_RANGE = 0.9;
const SPREAD_RANGE = 0.6;

const WHEEL_SPAN = 650;
const WHEEL_MIN = 0.4;
const WHEEL_RANGE = 1.6;
const DRAG_GAIN = 1.8;

const VELOCITY_MAX = 0.03;
const VELOCITY_DAMPING = 0.12;

const POINTER_SMOOTHING = 0.08;
const BREATH_SMOOTHING = 0.14;
const DRIFT_SMOOTHING = 0.05;
const BREATH_GAIN = 1.1;

const BREATH_TILT_DEG = 2.6;
const BREATH_SCALE = 0.03;
const DEPTH_INFLUENCE = 0.05;

const BLOB_SOFTEN = 0.35;
const BLOB1_RADIUS = 0.55;
const BLOB2_RADIUS = 0.45;
const GRAIN_RANGE = 0.28;
const SAMPLE_FLOOR = 0.08;
const GRAIN_TILE = 128;

const NEUTRAL_TINT = { r: 96, g: 165, b: 250, a: 1 };

const DEFAULT_MOOD = {
  strength: 7,
  blobSize: 5,
  grain: 3,
};

const DEFAULT_PARALLAX = {
  pointer: 5,
  breath: 5,
  drift: 5,
};

const DEFAULTS = {
  depth: 5,
  spread: 3.5,
  cardWidth: 560,
  cardHeight: 360,
  radius: 16,
  sensitivity: 5,
  smoothing: 6,
};

const PLACEHOLDER_TINTS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
];

/* -------------------------------------------------------------- internals */

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function wrap(value, span) {
  return ((value % span) + span) % span;
}

/* ------------------------------------------------------------------ colour */

function hslToRgb(h, s, l, a = 1) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const lum = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * lum - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lum - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255, a };
}

function rgbToHsl(color) {
  const r = clamp(color.r, 0, 255) / 255;
  const g = clamp(color.g, 0, 255) / 255;
  const b = clamp(color.b, 0, 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: (((h * 60) % 360) + 360) % 360, s: s * 100, l: l * 100 };
}

function parseColor(input, fallback) {
  if (typeof input !== "string") return fallback;
  const value = input.trim().toLowerCase();
  if (!value) return fallback;

  if (value.charAt(0) === "#") {
    const hex = value.slice(1);
    const pair = (i) => parseInt(hex.substr(i * 2, 2), 16);
    const single = (i) => parseInt(hex.charAt(i) + hex.charAt(i), 16);
    if (hex.length === 3 || hex.length === 4) {
      return {
        r: single(0),
        g: single(1),
        b: single(2),
        a: hex.length === 4 ? single(3) / 255 : 1,
      };
    }
    if (hex.length === 6 || hex.length === 8) {
      return {
        r: pair(0),
        g: pair(1),
        b: pair(2),
        a: hex.length === 8 ? pair(3) / 255 : 1,
      };
    }
    return fallback;
  }

  const parts = value.match(/-?[\d.]+/g);
  if (!parts || parts.length < 3) return fallback;
  const n = parts.map(Number);
  if (n.some((v) => !isFinite(v))) return fallback;
  if (value.indexOf("hsl") === 0) {
    return hslToRgb(n[0], n[1], n[2], parts.length > 3 ? n[3] : 1);
  }
  return { r: n[0], g: n[1], b: n[2], a: parts.length > 3 ? n[3] : 1 };
}

function mixRGB(a, b, t) {
  const k = clamp(t, 0, 1);
  return {
    r: mix(a.r, b.r, k),
    g: mix(a.g, b.g, k),
    b: mix(a.b, b.b, k),
    a: mix(a.a, b.a, k),
  };
}

function rgba(color, alpha) {
  return `rgba(${Math.round(clamp(color.r, 0, 255))}, ${Math.round(
    clamp(color.g, 0, 255),
  )}, ${Math.round(clamp(color.b, 0, 255))}, ${clamp(alpha, 0, 1).toFixed(3)})`;
}

function cssColor(color) {
  return rgba(color, color.a);
}

function toHex(color) {
  const part = (v) =>
    Math.round(clamp(v, 0, 255))
      .toString(16)
      .padStart(2, "0");
  return `#${part(color.r)}${part(color.g)}${part(color.b)}`.toUpperCase();
}

function moodFromTint(tint) {
  const { h, s, l } = rgbToHsl(tint);
  const groundL = clamp(16 + l * 0.22, 10, 38);
  const groundS = clamp(s * 0.42, 0, 52);
  return {
    background: hslToRgb(h, groundS, groundL),
    blob1: hslToRgb(h, clamp(s * 0.72, 0, 86), clamp(groundL + 14, 0, 75)),
    blob2: hslToRgb(h + 28, clamp(s * 0.58, 0, 76), clamp(groundL + 8, 0, 70)),
  };
}

/* ------------------------------------------------------------- item shapes */

function resolveSrc(value) {
  if (!value) return null;
  if (typeof value === "string") return value || null;
  const src = value.src;
  return typeof src === "string" && src ? src : null;
}

function imageOf(item) {
  if (item && typeof item === "object" && "image" in item)
    return resolveSrc(item.image);
  return resolveSrc(item);
}

function offsetOf(item) {
  if (item && typeof item === "object" && "offsetY" in item) {
    const offset = item.offsetY;
    return typeof offset === "number" && isFinite(offset) ? offset : 0;
  }
  return 0;
}

function tintOf(item) {
  if (item && typeof item === "object" && typeof item.tint === "string") {
    return item.tint;
  }
  return null;
}

function placeholderFill(tint) {
  const { h, s, l } = rgbToHsl(tint);
  const near = `hsl(${h.toFixed(0)} ${clamp(s, 24, 82).toFixed(0)}% ${clamp(
    l + 10,
    18,
    72,
  ).toFixed(0)}%)`;
  const far = `hsl(${(h + 34).toFixed(0)} ${clamp(s * 0.8, 16, 70).toFixed(
    0,
  )}% ${clamp(l - 18, 8, 45).toFixed(0)}%)`;
  return `linear-gradient(145deg, ${near}, ${far})`;
}

function blobLayer(color, cx, cy, radius) {
  const x = (cx * 100).toFixed(2);
  const y = ((1 - cy) * 100).toFixed(2);
  const r = (radius * 100).toFixed(2);
  return `radial-gradient(ellipse ${r}% ${r}% at ${x}% ${y}%, ${rgba(
    color,
    0.55,
  )} 0%, ${rgba(color, 0.38)} 25%, ${rgba(color, 0.2)} 50%, ${rgba(
    color,
    0.06,
  )} 75%, ${rgba(color, 0)} 100%)`;
}

function sampleTint(src) {
  return new Promise((resolve) => {
    const probe = new window.Image();
    probe.crossOrigin = "anonymous";
    probe.onerror = () => resolve(null);
    probe.onload = () => {
      try {
        const size = 12;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(probe, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0;
        let g = 0;
        let b = 0;
        let weight = 0;
        for (let i = 0; i < data.length; i += 4) {
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          const max = Math.max(pr, pg, pb);
          const min = Math.min(pr, pg, pb);
          const w = (max - min) / 255 + SAMPLE_FLOOR;
          r += pr * w;
          g += pg * w;
          b += pb * w;
          weight += w;
        }
        if (weight <= 0) {
          resolve(null);
          return;
        }
        resolve(toHex({ r: r / weight, g: g / weight, b: b / weight, a: 1 }));
      } catch {
        resolve(null);
      }
    };
    probe.src = src;
  });
}

const tintCache = new Map();

/* -------------------------------------------------------------- component */

export default function DepthGallery({
  images = [],
  background = "#090A0F",
  depth = DEFAULTS.depth,
  spread = DEFAULTS.spread,
  cardWidth = DEFAULTS.cardWidth,
  cardHeight = DEFAULTS.cardHeight,
  radius = DEFAULTS.radius,
  mood,
  parallax,
  sensitivity = DEFAULTS.sensitivity,
  smoothing = DEFAULTS.smoothing,
  activeTargetIndex = null,
  onActiveChange,
  style,
}) {
  const atmosphere = { ...DEFAULT_MOOD, ...mood };
  const response = { ...DEFAULT_PARALLAX, ...parallax };

  const containerRef = useRef(null);
  const groundRef = useRef(null);
  const plateNodes = useRef([]);
  const target = useRef(0);
  const current = useRef(0);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const lastReportedFocus = useRef(-1);
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const [tints, setTints] = useState({});
  const [grain, setGrain] = useState(null);
  const [containerSize, setContainerSize] = useState({
    width: 900,
    height: 540,
  });

  // Measure container dynamically so cards scale down cleanly on mobile/tablet
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Responsive card dimensions preserving aspect ratio on smaller screens
  const aspect = cardHeight / Math.max(cardWidth, 1);
  const effectiveCardWidth = Math.min(
    cardWidth,
    Math.max(240, containerSize.width * 0.78),
  );
  const effectiveCardHeight = Math.min(
    cardHeight,
    Math.max(160, effectiveCardWidth * aspect),
  );

  // Jump smoothly when parent selects a specific plate index
  useEffect(() => {
    if (typeof activeTargetIndex === "number" && isFinite(activeTargetIndex)) {
      const count = Math.max(plates.length, 1);
      const currentSlot = Math.round(target.current);
      const currentMod = wrap(currentSlot, count);
      let diff = activeTargetIndex - currentMod;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      target.current = currentSlot + diff;
    }
  }, [activeTargetIndex]);

  const sources = useMemo(() => {
    const list = [];
    const items = Array.isArray(images) ? images : [];
    items.forEach((item) => {
      const src = imageOf(item);
      if (src && list.indexOf(src) === -1) list.push(src);
    });
    return list;
  }, [images]);

  const sourceKey = sources.join("|");

  useEffect(() => {
    if (!sources.length) return;
    let alive = true;

    const cached = {};
    sources.forEach((src) => {
      const hit = tintCache.get(src);
      if (hit) cached[src] = hit;
    });
    if (Object.keys(cached).length) {
      setTints((prev) => ({ ...prev, ...cached }));
    }

    sources
      .filter((src) => !tintCache.has(src))
      .forEach((src) => {
        sampleTint(src).then((hex) => {
          if (!hex) return;
          tintCache.set(src, hex);
          if (!alive) return;
          setTints((prev) =>
            prev[src] === hex ? prev : { ...prev, [src]: hex },
          );
        });
      });

    return () => {
      alive = false;
    };
  }, [sourceKey]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = GRAIN_TILE;
    canvas.height = GRAIN_TILE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const noise = ctx.createImageData(GRAIN_TILE, GRAIN_TILE);
    for (let i = 0; i < noise.data.length; i += 4) {
      const value = Math.round(Math.random() * 255);
      noise.data[i] = value;
      noise.data[i + 1] = value;
      noise.data[i + 2] = value;
      noise.data[i + 3] = 255;
    }
    ctx.putImageData(noise, 0, 0);
    setGrain(canvas.toDataURL());
  }, []);

  const plates = useMemo(() => {
    const items = Array.isArray(images) ? images : [];
    const resolved = items.map((item, idx) => {
      const src = imageOf(item);
      const fallbackHex =
        tintOf(item) || PLACEHOLDER_TINTS[idx % PLACEHOLDER_TINTS.length];
      const tint = parseColor(
        src && tints[src] ? tints[src] : fallbackHex,
        NEUTRAL_TINT,
      );
      return {
        src,
        fill: placeholderFill(tint),
        offsetY: offsetOf(item),
        label: item && typeof item === "object" ? item.label || "" : "",
        mood: moodFromTint(tint),
      };
    });

    const list = resolved.length
      ? resolved
      : PLACEHOLDER_TINTS.map((swatch) => {
          const tint = parseColor(swatch, NEUTRAL_TINT);
          return {
            src: null,
            fill: placeholderFill(tint),
            offsetY: 0,
            label: "",
            mood: moodFromTint(tint),
          };
        });

    return list.length === 1 ? [list[0], { ...list[0] }] : list;
  }, [images, tints]);

  const perspective = Math.max(effectiveCardWidth, 120) * PERSPECTIVE_RATIO;
  const gap = perspective * (GAP_MIN + (clamp(depth, 0, 10) / 10) * GAP_RANGE);
  const scaleK = (perspective + gap) / perspective;
  const plateWidth = Math.max(effectiveCardWidth, 1) * scaleK;
  const plateHeight = Math.max(effectiveCardHeight, 1) * scaleK;
  const wheelToSlot =
    (WHEEL_MIN + (clamp(sensitivity, 0, 10) / 10) * WHEEL_RANGE) / WHEEL_SPAN;

  const frame = useRef(null);
  frame.current = {
    plates,
    count: plates.length,
    gap,
    scaleK,
    spreadPx: (clamp(spread, 0, 10) / 10) * SPREAD_RANGE * effectiveCardWidth,
    ease: 0.16 - (clamp(smoothing, 0, 10) / 10) * 0.135,
    wheelToSlot,
    dragToSlot: wheelToSlot * DRAG_GAIN,
    pointerAmount:
      (clamp(response.pointer, 0, 10) / 10) * 0.11 * effectiveCardWidth,
    driftAmount:
      (clamp(response.drift, 0, 10) / 10) * 0.035 * effectiveCardHeight,
    breathTilt: (clamp(response.breath, 0, 10) / 5) * BREATH_TILT_DEG,
    breathScale: (clamp(response.breath, 0, 10) / 5) * BREATH_SCALE,
    ground: parseColor(background, { r: 9, g: 10, b: 15, a: 1 }),
    moodStrength: clamp(atmosphere.strength, 0, 10) / 10,
    blob1Radius: BLOB1_RADIUS * (0.5 + clamp(atmosphere.blobSize, 0, 10) / 10),
    blob2Radius: BLOB2_RADIUS * (0.5 + clamp(atmosphere.blobSize, 0, 10) / 10),
  };

  useEffect(() => {
    let raf = 0;
    let started = 0;
    let previous = current.current;
    let velocity = 0;
    let breath = 0;
    let drift = 0;
    const pointer = { x: 0, y: 0 };

    const place = (f, index, slot, opacity, ahead) => {
      const node = plateNodes.current[index];
      if (!node) return;
      const distance = ahead + VIEW_LEAD;
      const z = -distance * f.gap;
      const influence = opacity * (1 + distance * DEPTH_INFLUENCE);
      const side = wrap(slot, 2) === 0 ? -1 : 1;
      const x =
        side * f.spreadPx * f.scaleK + pointer.x * f.pointerAmount * influence;
      const y =
        pointer.y * f.pointerAmount * 0.5 * influence + drift * f.driftAmount;
      const lean = breath * opacity;
      const tiltX = -pointer.y * f.breathTilt * lean;
      const tiltY = pointer.x * f.breathTilt * lean;
      const pulse = 1 + f.breathScale * lean;

      node.style.visibility = "visible";
      node.style.opacity = opacity.toFixed(3);
      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
        2,
      )}px, ${z.toFixed(2)}px) rotateX(${tiltX.toFixed(
        3,
      )}deg) rotateY(${tiltY.toFixed(3)}deg) scale(${pulse.toFixed(4)})`;
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const f = frame.current;
      if (!f || f.count < 2) return;
      if (!started) started = now;
      const time = (now - started) * 0.001;

      current.current += (target.current - current.current) * f.ease;

      const span = f.count % 2 === 0 ? f.count : f.count * 2;
      if (current.current < -span || current.current > span) {
        const laps = Math.floor(current.current / span) * span;
        current.current -= laps;
        target.current -= laps;
        previous -= laps;
      }
      const position = current.current;

      const raw = position - previous;
      previous = position;
      velocity += (raw - velocity) * VELOCITY_DAMPING;
      if (Math.abs(velocity) < 1e-6) velocity = 0;
      const speed = clamp(Math.abs(velocity) / VELOCITY_MAX, 0, 1);
      const signed = clamp(velocity / VELOCITY_MAX, -1, 1);

      breath += (speed * BREATH_GAIN - breath) * BREATH_SMOOTHING;
      drift += (signed - drift) * DRIFT_SMOOTHING;
      pointer.x += (pointerTarget.current.x - pointer.x) * POINTER_SMOOTHING;
      pointer.y += (pointerTarget.current.y - pointer.y) * POINTER_SMOOTHING;

      const slot = Math.floor(position);
      const blend = position - slot;
      const focus = wrap(slot, f.count);
      const following = wrap(slot + 1, f.count);

      // Report focused plate index when it changes
      const activeVisualIndex = blend > 0.55 ? following : focus;
      if (activeVisualIndex !== lastReportedFocus.current) {
        lastReportedFocus.current = activeVisualIndex;
        if (onActiveChangeRef.current) {
          onActiveChangeRef.current(activeVisualIndex);
        }
      }

      // Cross-fade the atmospheric room ground & drifting blobs
      if (groundRef.current) {
        const m1 = f.plates[focus].mood;
        const m2 = f.plates[following].mood;
        const bgTint = mixRGB(m1.background, m2.background, blend);
        const roomGround = mixRGB(f.ground, bgTint, f.moodStrength);
        const b1 = mixRGB(
          roomGround,
          mixRGB(m1.blob1, m2.blob1, blend),
          1 - BLOB_SOFTEN,
        );
        const b2 = mixRGB(
          roomGround,
          mixRGB(m1.blob2, m2.blob2, blend),
          1 - BLOB_SOFTEN,
        );

        const cx1 = 0.5 + Math.sin(time * 0.45) * 0.22;
        const cy1 = 0.5 + Math.cos(time * 0.35) * 0.18;
        const cx2 = 0.5 + Math.cos(time * 0.38 + 1.4) * 0.24;
        const cy2 = 0.5 + Math.sin(time * 0.42 + 2.1) * 0.2;

        groundRef.current.style.backgroundColor = cssColor(roomGround);
        groundRef.current.style.backgroundImage = `${blobLayer(
          b1,
          cx1,
          cy1,
          f.blob1Radius,
        )}, ${blobLayer(b2, cx2, cy2, f.blob2Radius)}`;
      }

      for (let i = 0; i < f.count; i += 1) {
        if (i === focus || i === following) continue;
        const node = plateNodes.current[i];
        if (!node || node.style.visibility === "hidden") continue;
        node.style.visibility = "hidden";
        node.style.opacity = "0";
      }
      place(f, focus, slot, 1 - blend, -blend);
      place(f, following, slot + 1, blend, 1 - blend);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onWheel = (event) => {
      const f = frame.current;
      if (!f) return;
      event.preventDefault();
      const delta =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY;
      target.current += delta * f.wheelToSlot;
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    let active = null;
    let lastY = 0;

    const onDown = (event) => {
      if (active !== null) return;
      active = event.pointerId;
      lastY = event.clientY;
      node.setPointerCapture(event.pointerId);
    };
    const onMove = (event) => {
      if (active !== event.pointerId) return;
      const f = frame.current;
      const dy = event.clientY - lastY;
      lastY = event.clientY;
      if (!f) return;
      target.current -= dy * f.dragToSlot;
    };
    const onUp = (event) => {
      if (active !== event.pointerId) return;
      active = null;
      if (node.hasPointerCapture(event.pointerId))
        node.releasePointerCapture(event.pointerId);
    };

    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);
    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
    };
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onMove = (event) => {
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return;
      pointerTarget.current.x =
        ((event.clientX - box.left) / box.width) * 2 - 1;
      pointerTarget.current.y = -(
        ((event.clientY - box.top) / box.height) * 2 -
        1
      );
    };
    const onLeave = () => {
      pointerTarget.current.x = 0;
      pointerTarget.current.y = 0;
    };
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background,
        cursor: "grab",
        touchAction: "pan-x",
        userSelect: "none",
        ...style,
      }}
    >
      {/* Atmospheric room ground & drifting shader-like blobs */}
      <div
        ref={groundRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: background,
          pointerEvents: "none",
          transition: "background-color 120ms linear",
        }}
      />

      {/* Film grain overlay */}
      {grain && atmosphere.grain > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${grain})`,
            backgroundSize: `${GRAIN_TILE}px ${GRAIN_TILE}px`,
            opacity: (clamp(atmosphere.grain, 0, 10) / 10) * GRAIN_RANGE,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      ) : null}

      {/* 3D Perspective Corridor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: `${perspective}px`,
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          pointerEvents: "none",
        }}
      >
        {plates.map((plate, i) => (
          <div
            key={`plate-${i}-${plate.src || "fill"}`}
            ref={(el) => {
              plateNodes.current[i] = el;
            }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: plateWidth,
              height: plateHeight,
              marginLeft: -plateWidth / 2,
              marginTop: -plateHeight / 2,
              borderRadius: Math.max(radius, 0) * scaleK,
              overflow: "hidden",
              background: plate.fill || undefined,
              boxShadow:
                "0 25px 60px -15px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.12)",
              backfaceVisibility: "hidden",
              visibility: "hidden",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            {plate.src ? (
              <img
                src={plate.src}
                alt={plate.label || ""}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  objectPosition: `50% ${50 - (plate.offsetY / 250) * 50}%`,
                  pointerEvents: "none",
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/90">
                <span className="font-mono text-xs uppercase tracking-[0.25em] opacity-70 mb-2">
                  PLAYGROUND ARCHIVE
                </span>
                <span className="font-sans text-xl sm:text-2xl font-bold tracking-tight">
                  {plate.label || "Interactive Build"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

DepthGallery.displayName = "Depth Gallery";
