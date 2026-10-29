// src\components\ui\3d-bend-carousel.jsx
"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CarouselMedia({ item, isActive = true, alt, className }) {
  const videoRef = useRef(null);
  const [loadedVideoSrc, setLoadedVideoSrc] = useState(null);
  const [failedVideoSrc, setFailedVideoSrc] = useState(null);

  const videoSrc = item?.video;
  const thumbnailSrc =
    item?.thumbnail ?? item?.poster ?? item?.image ?? item?.media;
  const imageSrc = item?.image ?? item?.media ?? thumbnailSrc;

  const hasVideo = Boolean(videoSrc);
  const hasVideoError = failedVideoSrc === videoSrc;
  const isVideoReady = loadedVideoSrc === videoSrc && !hasVideoError;

  useEffect(() => {
    const video = videoRef.current;

    if (!hasVideo || !video || hasVideoError) return;

    if (!isActive) {
      video.pause();
      return;
    }

    const playPromise = video.play();
    playPromise?.catch(() => {});
  }, [hasVideo, hasVideoError, isActive, videoSrc]);

  if (!hasVideo) {
    return imageSrc ? (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        loading="lazy"
        draggable={false}
      />
    ) : null;
  }

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none",
        className,
      )}
    >
      {thumbnailSrc && (
        <img
          src={thumbnailSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable={false}
          className={cn(
            "absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-300 ease-out",
            isVideoReady ? "opacity-0" : "opacity-100",
          )}
        />
      )}

      {!hasVideoError && (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          poster={thumbnailSrc || undefined}
          muted
          defaultMuted
          loop
          playsInline
          preload={isActive ? "auto" : "metadata"}
          aria-label={alt}
          onLoadedData={() => setLoadedVideoSrc(videoSrc)}
          onCanPlay={() => setLoadedVideoSrc(videoSrc)}
          onError={() => {
            setLoadedVideoSrc(null);
            setFailedVideoSrc(videoSrc);
          }}
          className={cn(
            "absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ease-out",
            isVideoReady || !thumbnailSrc ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}

export const ThreeDBendCarousel = forwardRef(
  (
    {
      items: rawItems = [],
      images,
      itemWidth = 640,
      aspectRatio = 16 / 9,
      gap = -60,
      perspective = 1100,
      bendAngle = 35,
      depth = 360,
      curveDirection = "concave",
      orientation = "horizontal",
      height = 560,
      width = "100%",
      damping = 0.085,
      momentumFactor = 120,
      snap = true,
      loop = true,
      grayscaleInactive = true,
      activeScale = 1.05,
      minOpacity = 0.28,
      enableDrag = true,
      enableWheel = false,
      enableKeyboard = true,
      autoPlay = false,
      autoPlayInterval = 5000,
      pauseOnHover = true,
      showControls = true,
      showIndicators = true,
      showGlare = true,
      className,
      cardClassName,
      onActiveChange,
      onItemClick,
      renderItem,
    },
    ref,
  ) => {
    const formattedItems = useMemo(() => {
      if (rawItems && rawItems.length > 0) {
        return rawItems.map((item, idx) => {
          if (typeof item === "string") {
            return {
              id: idx,
              image: item,
              title: `Item ${idx + 1}`,
              badge: `${idx + 1 < 10 ? "0" : ""}${idx + 1}`,
            };
          }
          return item;
        });
      }
      if (images && images.length > 0) {
        return images.map((src, idx) => ({
          id: idx,
          image: src,
          title: `Slide ${idx + 1}`,
          badge: `${idx + 1 < 10 ? "0" : ""}${idx + 1}`,
        }));
      }
      return [];
    }, [rawItems, images]);

    const count = formattedItems.length;
    const itemHeight = itemWidth / aspectRatio;
    const isVertical = orientation === "vertical";
    const itemDimension = isVertical ? itemHeight : itemWidth;
    const step = itemDimension + gap;

    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const glareRefs = useRef([]);

    const currentOffsetRef = useRef(0);
    const targetOffsetRef = useRef(0);
    const isDraggingRef = useRef(false);
    const isHoveringRef = useRef(false);
    const dragStartCoordRef = useRef(0);
    const dragStartOffsetRef = useRef(0);
    const lastCoordRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);
    const rafIdRef = useRef(null);
    const wheelDebounceTimerRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const activeIndexRef = useRef(0);

    useEffect(() => {
      activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const updateTransforms = useCallback(() => {
      if (!containerRef.current || count === 0) return;

      const containerDim = isVertical
        ? containerRef.current.clientHeight || 560
        : containerRef.current.clientWidth || 900;

      const centerOffset = containerDim / 2;
      const currentOffset = currentOffsetRef.current;
      const totalSpan = count * step;

      let nearestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        let deltaPixels = i * step - currentOffset;

        if (loop && totalSpan > 0) {
          deltaPixels =
            (((deltaPixels % totalSpan) + totalSpan * 1.5) % totalSpan) -
            totalSpan / 2;
        }

        const distFromCenter = Math.abs(deltaPixels);
        if (distFromCenter < minDistance) {
          minDistance = distFromCenter;
          nearestIndex = i;
        }

        const viewThreshold = Math.max(1, centerOffset * 0.9);
        const normalized = Math.max(
          -1.6,
          Math.min(1.6, deltaPixels / viewThreshold),
        );
        const absNorm = Math.abs(normalized);

        const curveSign = curveDirection === "concave" ? 1 : -1;
        const rotateAngle = -normalized * bendAngle * curveSign;
        const translateZ = -absNorm * depth;

        const opacity = Math.max(minOpacity, 1 - Math.pow(absNorm * 0.72, 1.3));
        const scale = Math.max(
          0.82,
          activeScale - absNorm * (activeScale - 0.9),
        );

        const zIndex = Math.round(100 - absNorm * 50);

        let transformOrigin = "center center";
        if (isVertical) {
          if (normalized > 0.04) transformOrigin = "top center";
          else if (normalized < -0.04) transformOrigin = "bottom center";
        } else {
          if (normalized > 0.04) transformOrigin = "left center";
          else if (normalized < -0.04) transformOrigin = "right center";
        }

        if (isVertical) {
          el.style.transform = `translate3d(-50%, calc(-50% + ${deltaPixels}px), ${translateZ}px) rotateX(${rotateAngle}deg) scale(${scale})`;
        } else {
          el.style.transform = `translate3d(calc(-50% + ${deltaPixels}px), -50%, ${translateZ}px) rotateY(${rotateAngle}deg) scale(${scale})`;
        }

        el.style.transformOrigin = transformOrigin;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = `${zIndex}`;

        if (grayscaleInactive) {
          const grayPercent = Math.min(100, Math.pow(absNorm, 1.3) * 100);
          const brightness = Math.max(0.55, 1 - absNorm * 0.35);
          el.style.filter = `grayscale(${grayPercent.toFixed(1)}%) brightness(${brightness.toFixed(2)})`;
        }

        const glareEl = glareRefs.current[i];
        if (glareEl && showGlare) {
          const glareOpacity = Math.max(0, 0.45 - absNorm * 0.45);
          const glareAngle = isVertical
            ? 180 + rotateAngle * 2
            : 90 + rotateAngle * 2;
          glareEl.style.opacity = `${glareOpacity.toFixed(3)}`;
          glareEl.style.background = `linear-gradient(${glareAngle}deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 45%, transparent 70%)`;
        }
      }

      if (nearestIndex !== activeIndexRef.current) {
        activeIndexRef.current = nearestIndex;
        setActiveIndex(nearestIndex);
        onActiveChange?.(nearestIndex);
      }
    }, [
      count,
      isVertical,
      step,
      loop,
      curveDirection,
      bendAngle,
      depth,
      minOpacity,
      activeScale,
      grayscaleInactive,
      showGlare,
      onActiveChange,
    ]);

    const tick = useCallback(() => {
      const diff = targetOffsetRef.current - currentOffsetRef.current;

      if (Math.abs(diff) > 0.05 || isDraggingRef.current) {
        currentOffsetRef.current += diff * damping;
        updateTransforms();
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        currentOffsetRef.current = targetOffsetRef.current;
        updateTransforms();
        rafIdRef.current = null;
      }
    }, [damping, updateTransforms]);

    const wakeRaf = useCallback(() => {
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    }, [tick]);

    const snapToNearest = useCallback(() => {
      if (!snap || count === 0) return;
      const rawTarget = targetOffsetRef.current;
      const targetCard = Math.round(rawTarget / step);
      let newTarget = targetCard * step;

      if (!loop) {
        newTarget = Math.max(0, Math.min((count - 1) * step, newTarget));
      }

      targetOffsetRef.current = newTarget;
      wakeRaf();
    }, [snap, count, step, loop, wakeRaf]);

    const goTo = useCallback(
      (index) => {
        if (count === 0) return;
        const normalizedTarget = Math.max(0, Math.min(count - 1, index));

        if (loop) {
          const currentVirtual = Math.round(currentOffsetRef.current / step);
          const currentMod = ((currentVirtual % count) + count) % count;
          let diff = normalizedTarget - currentMod;

          if (diff > count / 2) diff -= count;
          if (diff < -count / 2) diff += count;

          targetOffsetRef.current = (currentVirtual + diff) * step;
        } else {
          targetOffsetRef.current = normalizedTarget * step;
        }
        wakeRaf();
      },
      [count, loop, step, wakeRaf],
    );

    const next = useCallback(() => {
      if (loop) {
        targetOffsetRef.current += step;
      } else {
        const nextIdx = Math.min(count - 1, activeIndexRef.current + 1);
        targetOffsetRef.current = nextIdx * step;
      }
      wakeRaf();
    }, [loop, step, count, wakeRaf]);

    const prev = useCallback(() => {
      if (loop) {
        targetOffsetRef.current -= step;
      } else {
        const prevIdx = Math.max(0, activeIndexRef.current - 1);
        targetOffsetRef.current = prevIdx * step;
      }
      wakeRaf();
    }, [loop, step, wakeRaf]);

    useImperativeHandle(
      ref,
      () => ({
        next,
        prev,
        goTo,
        togglePlay: () => setIsPlaying((p) => !p),
        getActiveIndex: () => activeIndexRef.current,
      }),
      [next, prev, goTo],
    );

    const handleDragStart = (e) => {
      if (!enableDrag) return;

      isDraggingRef.current = true;
      const clientCoord =
        "touches" in e
          ? isVertical
            ? e.touches[0].clientY
            : e.touches[0].clientX
          : isVertical
            ? e.clientY
            : e.clientX;

      dragStartCoordRef.current = clientCoord;
      dragStartOffsetRef.current = targetOffsetRef.current;
      lastCoordRef.current = clientCoord;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;

      wakeRaf();
    };

    useEffect(() => {
      const handleDragMove = (e) => {
        if (!isDraggingRef.current) return;

        const clientCoord =
          "touches" in e
            ? isVertical
              ? e.touches[0].clientY
              : e.touches[0].clientX
            : isVertical
              ? e.clientY
              : e.clientX;

        const delta = dragStartCoordRef.current - clientCoord;
        let newTarget = dragStartOffsetRef.current + delta;

        if (!loop) {
          const maxOffset = (count - 1) * step;
          if (newTarget < 0) {
            newTarget = newTarget * 0.35;
          } else if (newTarget > maxOffset) {
            newTarget = maxOffset + (newTarget - maxOffset) * 0.35;
          }
        }

        targetOffsetRef.current = newTarget;

        const now = performance.now();
        const dt = now - lastTimeRef.current;
        if (dt > 8) {
          const dCoord = lastCoordRef.current - clientCoord;
          velocityRef.current = dCoord / dt;
          lastCoordRef.current = clientCoord;
          lastTimeRef.current = now;
        }

        wakeRaf();
      };

      const handleDragEnd = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        const momentum = velocityRef.current * momentumFactor;
        targetOffsetRef.current += momentum;

        snapToNearest();
        wakeRaf();
      };

      window.addEventListener("mousemove", handleDragMove, { passive: true });
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove, { passive: true });
      window.addEventListener("touchend", handleDragEnd);

      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }, [isVertical, loop, count, step, momentumFactor, snapToNearest, wakeRaf]);

    useEffect(() => {
      if (!isPlaying) return;

      const interval = setInterval(() => {
        if (pauseOnHover && isHoveringRef.current) return;
        if (isDraggingRef.current) return;
        next();
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }, [isPlaying, pauseOnHover, autoPlayInterval, next]);

    useEffect(() => {
      updateTransforms();

      const container = containerRef.current;
      if (!container) return;

      const observer = new ResizeObserver(() => {
        updateTransforms();
      });
      observer.observe(container);

      return () => {
        observer.disconnect();
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    }, [updateTransforms]);

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        onMouseEnter={() => {
          isHoveringRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false;
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className={cn(
          "relative overflow-hidden select-none outline-none group w-full",
          "flex items-center justify-center",
          "cursor-grab active:cursor-grabbing",
          className,
        )}
        style={{
          width,
          height,
          perspective: `${perspective}px`,
          perspectiveOrigin: "50% 50%",
        }}
        aria-label="3D Featured Work Carousel"
      >
        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {formattedItems.map((item, index) => {
            const isCenter = activeIndex === index;

            return (
              <div
                key={item.id ?? index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCenter) {
                    item.onClick?.();
                    onItemClick?.(item, index);
                  } else {
                    goTo(index);
                  }
                }}
                className={cn(
                  "absolute top-1/2 left-1/2 rounded-2xl overflow-hidden",
                  "shadow-[0_20px_50px_rgba(0,0,0,0.4)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.85)]",
                  "border border-border/50 bg-card",
                  "pointer-events-auto cursor-pointer",
                  "transition-[border-color,box-shadow] duration-300",
                  isCenter && "ring-1 ring-blue-500/40 border-blue-500/50",
                  cardClassName,
                )}
                style={{
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                  willChange: "transform, opacity, filter",
                  backfaceVisibility: "hidden",
                }}
              >
                {renderItem ? (
                  renderItem(item, index, isCenter)
                ) : (
                  <div className="relative w-full h-full flex flex-col justify-end overflow-hidden group/card">
                    <CarouselMedia
                      item={item}
                      isActive={isCenter}
                      alt={item.title || `Slide ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    <div className="relative z-10 p-5 text-white">
                      {item.title && (
                        <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {showGlare && (
                      <div
                        ref={(el) => {
                          glareRefs.current[index] = el;
                        }}
                        className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                        style={{ mixBlendMode: "overlay" }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showControls && (
          <div
            className="absolute z-30 inset-x-2 sm:inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Previous Project"
              className="pointer-events-auto p-3 rounded-full backdrop-blur-xl bg-background/60 dark:bg-black/60 border border-border/50 text-foreground shadow-xl hover:scale-110 active:scale-95 hover:border-blue-500/60 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next Project"
              className="pointer-events-auto p-3 rounded-full backdrop-blur-xl bg-background/60 dark:bg-black/60 border border-border/50 text-foreground shadow-xl hover:scale-110 active:scale-95 hover:border-blue-500/60 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {showIndicators && count > 1 && (
          <div
            className="absolute top-6 left-6 z-30 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/50 border border-white/15 text-white shadow-lg text-xs font-mono font-medium tracking-wider">
              <span>{(activeIndex + 1).toString().padStart(2, "0")}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60">
                {count.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

ThreeDBendCarousel.displayName = "ThreeDBendCarousel";

export default ThreeDBendCarousel;
