/* eslint-disable */
// src/components/Experience/Experience.jsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  MapPin,
  Calendar,
  Sparkles,
  Building2,
  Layers,
  Globe2,
} from "lucide-react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  Color,
  Mesh,
  Group,
  InstancedMesh,
  Matrix4,
  Raycaster,
  Vector2,
  TubeGeometry,
  CatmullRomCurve3,
  Vector3,
  CanvasTexture,
} from "three";
import { geoEquirectangular, geoPath } from "d3-geo";

// Company Logos
import technoLogo from "@/assets/jobs/techno.png";
import upsrlmLogo from "@/assets/jobs/upsrlm.png";
import edukhojLogo from "@/assets/jobs/edukhoj.png";

// ============================================================================
// 1. ORIGINKIT 3D GLOBE ENGINE (Converted to Pure JSX + Touch Support)
// ============================================================================

function parseColorToRgba(input) {
  if (!input || input.trim() === "") return { r: 0, g: 0, b: 0, a: 0 };
  const str = input.trim();
  const rgbaMatch = str.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i,
  );
  if (rgbaMatch) {
    const r = Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255;
    const g = Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255;
    const b = Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255;
    const a =
      rgbaMatch[4] !== undefined
        ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4])))
        : 1;
    return { r, g, b, a };
  }
  const hex = str.replace(/^#/, "");
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: 1,
    };
  }
  if (hex.length === 4) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: parseInt(hex[3] + hex[3], 16) / 255,
    };
  }
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function mapLinear(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function mapSpeedUiToInternal(ui) {
  if (ui === 0) return 0;
  const clamped = Math.max(0, Math.min(10, ui));
  return mapLinear(clamped, 0, 10, 0, 0.9);
}
function mapDensityUiToSpacing(ui) {
  const clamped = Math.max(1, Math.min(10, ui));
  return mapLinear(clamped, 1, 10, 24, 8);
}
function mapScaleUiToMultiplier(ui) {
  const clamped = Math.max(1, Math.min(20, ui));
  return mapLinear(clamped, 1, 20, 0.2, 2);
}
function mapDotSizeUiToMultiplier(ui) {
  const clamped = Math.max(1, Math.min(10, ui));
  return mapLinear(clamped, 1, 10, 0.1, 0.5);
}
function mapMarkerDotSizeUiToMultiplier(ui) {
  const clamped = Math.max(0, Math.min(100, ui));
  return mapLinear(clamped, 0, 100, 0.1, 2.5);
}
function normalizeSmoothing(ui) {
  return Math.max(0, Math.min(1, ui / 10));
}
function mapDragSpeedUiToSensitivity(ui) {
  return mapLinear(Math.max(0, Math.min(10, ui)), 0, 10, 0.001, 0.02);
}
function mapDetailToStepSize(ui) {
  const clamped = Math.max(1, Math.min(10, ui));
  return mapLinear(clamped, 1, 10, 10, 1);
}

function simplifyRing(ring, detail) {
  if (ring.length < 2) return ring;
  if (detail >= 10) return ring;
  const stepSize = Math.max(1, Math.floor(mapDetailToStepSize(detail)));
  const simplified = [];
  simplified.push(ring[0]);
  for (let i = stepSize; i < ring.length - 1; i += stepSize) {
    const idx = Math.min(i, ring.length - 1);
    simplified.push(ring[idx]);
  }
  const lastPoint = ring[ring.length - 1];
  const firstPoint = ring[0];
  const isClosed =
    Math.abs(lastPoint[0] - firstPoint[0]) < 1e-4 &&
    Math.abs(lastPoint[1] - firstPoint[1]) < 1e-4;
  if (!isClosed) {
    simplified.push(lastPoint);
  }
  return simplified.length >= 2 ? simplified : ring;
}

function latLngToPosition(lat, lng) {
  const latRad = lat * (Math.PI / 180);
  const lngRad = lng * (Math.PI / 180);
  const x = Math.cos(latRad) * Math.sin(lngRad);
  const y = Math.sin(latRad);
  const z = Math.cos(latRad) * Math.cos(lngRad);
  return { x, y, z };
}

export function Globe({
  speed = 2,
  smoothing = 8,
  dots = { color: "#ffffff", size: 5, density: 8, allDots: false },
  fill = "dots",
  fillColor = "#ffffff",
  scale = 9.5,
  stopOnHover = true,
  markerConfig = { markers: [], color: "#38bdf8", size: 45 },
  direction = "right",
  initialLatitude = 22,
  initialLongitude = -81,
  oceanColor = "#05070B",
  outlineColor = "#38bdf8",
  showOutline = true,
  graticuleColor = "rgba(56, 189, 248, 0.16)",
  showGrid = true,
  outlineWidth = 1.2,
  dragSpeed = 5,
  detail = 6,
  style,
}) {
  const containerRef = useRef(null);
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const dotColor = dots.color;
  const dotSize = dots.size;
  const density = dots.density;
  const allDots = dots.allDots;
  const gridWidth = 1;
  const smoothingN = normalizeSmoothing(smoothing);

  const baseRotationSpeed = mapSpeedUiToInternal(speed);
  const rotationSpeed =
    direction === "left" ? -baseRotationSpeed : baseRotationSpeed;
  const dotSpacing = mapDensityUiToSpacing(density);
  const dotSizeMultiplier = mapDotSizeUiToMultiplier(dotSize);
  const markerRadiusMultiplier = mapMarkerDotSizeUiToMultiplier(
    markerConfig.size,
  );
  const scaleMultiplier = mapScaleUiToMultiplier(scale);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerWidth =
      container.clientWidth || container.offsetWidth || 500;
    const containerHeight =
      container.clientHeight || container.offsetHeight || 500;

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      50,
      containerWidth / containerHeight,
      0.1,
      1e3,
    );
    const baseRadius = 1;
    const globeRadius = baseRadius * scaleMultiplier;
    const cameraDistance = 2.5 / scaleMultiplier;
    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = "srgb";
    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.opacity = "0";
    canvas.style.visibility = "hidden";
    canvas.style.transition = "opacity 0.6s ease";
    container.appendChild(canvas);

    const resolvedOceanColor = oceanColor;
    const resolvedOutlineColor = outlineColor;
    const resolvedDotColor = dotColor;
    const resolvedMarkerColor = markerConfig.color;
    const resolvedGraticuleColor = graticuleColor;
    const resolvedFillColor = fillColor;
    const oceanRgba = parseColorToRgba(resolvedOceanColor);
    const outlineRgba = parseColorToRgba(resolvedOutlineColor);
    const dotRgba = parseColorToRgba(resolvedDotColor);
    const graticuleRgba = parseColorToRgba(resolvedGraticuleColor);
    const fillRgba = parseColorToRgba(resolvedFillColor);

    const oceanGeometry = new SphereGeometry(globeRadius, 64, 64);
    const oceanColorObj = resolvedOceanColor
      ? new Color(oceanRgba.r, oceanRgba.g, oceanRgba.b)
      : new Color(0, 0, 0);
    const oceanMaterial = new MeshBasicMaterial({
      color: oceanColorObj,
      transparent: oceanRgba.a < 1 || oceanRgba.a === 0,
      opacity: oceanRgba.a,
    });
    const oceanMesh = new Mesh(oceanGeometry, oceanMaterial);

    const continentOutlineGroup = new Group();
    const graticuleGroup = new Group();

    if (showGrid && resolvedGraticuleColor && graticuleRgba.a > 0) {
      const graticuleColorObj = new Color(
        graticuleRgba.r,
        graticuleRgba.g,
        graticuleRgba.b,
      );
      const graticuleMaterial = new MeshBasicMaterial({
        color: graticuleColorObj,
        transparent: graticuleRgba.a < 1 || graticuleRgba.a === 0,
        opacity: graticuleRgba.a,
      });
      const gridSpacing = 15;
      for (let lat = -90; lat <= 90; lat += gridSpacing) {
        const positions = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
          const lng = (i / segments) * 360 - 180;
          const pos = latLngToPosition(lat, lng);
          positions.push(
            pos.x * globeRadius,
            pos.y * globeRadius,
            pos.z * globeRadius,
          );
        }
        if (positions.length >= 6) {
          const points = [];
          for (let i = 0; i < positions.length; i += 3) {
            points.push(
              new Vector3(positions[i], positions[i + 1], positions[i + 2]),
            );
          }
          if (points.length >= 2) {
            const curve = new CatmullRomCurve3(points);
            const radius = (gridWidth / 10) * 0.01;
            const tubeGeometry = new TubeGeometry(
              curve,
              points.length * 2,
              radius,
              6,
              false,
            );
            const tubeMesh = new Mesh(tubeGeometry, graticuleMaterial);
            tubeMesh.renderOrder = 0;
            graticuleGroup.add(tubeMesh);
          }
        }
      }
      for (let lng = -180; lng < 180; lng += gridSpacing) {
        const positions = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
          const lat = (i / segments) * 180 - 90;
          const pos = latLngToPosition(lat, lng);
          positions.push(
            pos.x * globeRadius,
            pos.y * globeRadius,
            pos.z * globeRadius,
          );
        }
        if (positions.length >= 6) {
          const points = [];
          for (let i = 0; i < positions.length; i += 3) {
            points.push(
              new Vector3(positions[i], positions[i + 1], positions[i + 2]),
            );
          }
          if (points.length >= 2) {
            const curve = new CatmullRomCurve3(points);
            const radius = (gridWidth / 10) * 0.01;
            const tubeGeometry = new TubeGeometry(
              curve,
              points.length * 2,
              radius,
              6,
              false,
            );
            const tubeMesh = new Mesh(tubeGeometry, graticuleMaterial);
            tubeMesh.renderOrder = 0;
            graticuleGroup.add(tubeMesh);
          }
        }
      }
    }

    let dotInstances = null;
    let markerMeshes = [];
    let isDisposed = false;

    const updateMarkers = () => {
      markerMeshes.forEach((mesh) => globeGroup.remove(mesh));
      markerMeshes = [];
      if (markerConfig.markers && markerConfig.markers.length > 0) {
        const markerSize = 0.01 * markerRadiusMultiplier;
        const markerGeometry = new SphereGeometry(markerSize, 16, 16);
        const markerColorObj = resolvedMarkerColor
          ? new Color(resolvedMarkerColor)
          : new Color(1, 1, 1);
        const markerMaterial = new MeshBasicMaterial({
          color: markerColorObj,
        });
        markerConfig.markers.forEach((marker) => {
          if (
            !marker ||
            typeof marker.lat !== "number" ||
            typeof marker.lng !== "number"
          )
            return;
          const pos = latLngToPosition(marker.lat, marker.lng);
          const markerMesh = new Mesh(markerGeometry, markerMaterial.clone());
          markerMesh.position.set(
            pos.x * globeRadius,
            pos.y * globeRadius,
            pos.z * globeRadius,
          );
          globeGroup.add(markerMesh);
          markerMeshes.push(markerMesh);
        });
      }
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/50m/physical/ne_50m_land.json",
        );
        if (!response.ok) throw new Error("Failed to load land data");
        const landFeatures = await response.json();
        if (isDisposed) return;

        while (continentOutlineGroup.children.length > 0) {
          continentOutlineGroup.remove(continentOutlineGroup.children[0]);
        }

        if (showOutline && outlineColor && outlineRgba.a > 0) {
          const outlineColorObj = new Color(
            outlineRgba.r,
            outlineRgba.g,
            outlineRgba.b,
          );
          const outlineMaterial = new MeshBasicMaterial({
            color: outlineColorObj,
            transparent: outlineRgba.a < 1,
            opacity: outlineRgba.a,
            depthTest: true,
            depthWrite: true,
          });
          const projection = geoEquirectangular();
          const pathGenerator = geoPath().projection(projection);

          landFeatures.features.forEach((feature) => {
            const featureType =
              feature.properties?.featurecla || feature.properties?.type || "";
            const featureName = feature.properties?.name || "";
            if (
              featureType.toLowerCase().includes("graticule") ||
              featureType.toLowerCase().includes("grid") ||
              featureType.toLowerCase().includes("line") ||
              featureName.toLowerCase().includes("graticule") ||
              featureName.toLowerCase().includes("grid") ||
              featureName.toLowerCase().includes("line")
            ) {
              return;
            }
            const pathString = pathGenerator(feature);
            if (!pathString) return;
            const commands = pathString.match(/[ML][^MLZ]*/g) || [];
            if (commands.length === 0) return;

            const geometry = feature.geometry;
            if (!geometry || !geometry.coordinates) return;

            const processRing = (ring) => {
              if (ring.length < 2) return;
              const simplifiedRing = simplifyRing(ring, detail);
              const positions = [];
              simplifiedRing.forEach((coord) => {
                const [lng, lat] = coord;
                const pos = latLngToPosition(lat, lng);
                positions.push(
                  pos.x * globeRadius,
                  pos.y * globeRadius,
                  pos.z * globeRadius,
                );
              });
              if (positions.length >= 6) {
                const points = [];
                for (let i = 0; i < positions.length; i += 3) {
                  points.push(
                    new Vector3(
                      positions[i],
                      positions[i + 1],
                      positions[i + 2],
                    ),
                  );
                }
                if (
                  points.length > 0 &&
                  points[0].distanceTo(points[points.length - 1]) > 0.001
                ) {
                  points.push(points[0].clone());
                }
                if (points.length >= 2) {
                  const curve = new CatmullRomCurve3(points);
                  const radius = (outlineWidth / 10) * 0.01;
                  const tubeGeometry = new TubeGeometry(
                    curve,
                    points.length * 2,
                    radius,
                    6,
                    false,
                  );
                  const tubeMesh = new Mesh(tubeGeometry, outlineMaterial);
                  tubeMesh.renderOrder = 0;
                  continentOutlineGroup.add(tubeMesh);
                }
              }
            };

            if (
              geometry.type === "Polygon" &&
              geometry.coordinates.length > 0
            ) {
              processRing(geometry.coordinates[0]);
            } else if (geometry.type === "MultiPolygon") {
              geometry.coordinates.forEach((polygon) => {
                if (polygon.length > 0) {
                  processRing(polygon[0]);
                }
              });
            }
          });
        }

        const bitmapWidth = 2048;
        const bitmapHeight = 1024;
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = bitmapWidth;
        offscreenCanvas.height = bitmapHeight;
        const ctx = offscreenCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (!ctx) throw new Error("Canvas not supported");
        const projection = geoEquirectangular().fitSize(
          [bitmapWidth, bitmapHeight],
          { type: "Sphere" },
        );
        const pathGenerator = geoPath().projection(projection).context(ctx);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, bitmapWidth, bitmapHeight);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        landFeatures.features.forEach((feature) => {
          pathGenerator(feature);
        });
        ctx.fill();
        const imageData = ctx.getImageData(0, 0, bitmapWidth, bitmapHeight);
        const pixels = imageData.data;
        const isOnLand = (lng, lat) => {
          const x = Math.round(((lng + 180) / 360) * bitmapWidth) % bitmapWidth;
          const y = Math.round(((90 - lat) / 180) * bitmapHeight);
          const clampedY = Math.max(0, Math.min(bitmapHeight - 1, y));
          const idx = (clampedY * bitmapWidth + x) * 4;
          return pixels[idx] > 128;
        };

        if (fill === "solid") {
          const texW = 1024;
          const texH = 512;
          const fillCanvas = document.createElement("canvas");
          fillCanvas.width = texW;
          fillCanvas.height = texH;
          const fctx = fillCanvas.getContext("2d");
          const img = fctx.createImageData(texW, texH);
          const data = img.data;
          const fr = Math.round(fillRgba.r * 255);
          const fg = Math.round(fillRgba.g * 255);
          const fb = Math.round(fillRgba.b * 255);
          const fa = Math.round((fillRgba.a || 1) * 255);
          for (let ty = 0; ty < texH; ty++) {
            for (let tx = 0; tx < texW; tx++) {
              const u = tx / texW;
              const v = ty / texH;
              let lng = (u - 0.25) * 360;
              lng = ((((lng + 180) % 360) + 360) % 360) - 180;
              const lat = (v - 0.5) * 180;
              const onLand = allDots || isOnLand(lng, lat);
              const idx = (ty * texW + tx) * 4;
              if (onLand) {
                data[idx] = fr;
                data[idx + 1] = fg;
                data[idx + 2] = fb;
                data[idx + 3] = fa;
              } else {
                data[idx + 3] = 0;
              }
            }
          }
          fctx.putImageData(img, 0, 0);
          const fillTexture = new CanvasTexture(fillCanvas);
          fillTexture.flipY = false;
          fillTexture.needsUpdate = true;
          const fillGeometry = new SphereGeometry(globeRadius * 1.002, 64, 64);
          const fillMaterial = new MeshBasicMaterial({
            map: fillTexture,
            transparent: true,
          });
          dotInstances = new Mesh(fillGeometry, fillMaterial);
          globeGroup.add(dotInstances);
        } else {
          const dotCoordinates = [];
          const baseStep = dotSpacing * 0.08;
          for (let lat = -90; lat <= 90; lat += baseStep) {
            const latRad = (Math.abs(lat) * Math.PI) / 180;
            const cosLat = Math.cos(latRad);
            const lngStep =
              cosLat > 0.01 ? baseStep / Math.max(0.3, cosLat) : 360;
            for (let lng = -180; lng < 180; lng += lngStep) {
              if (allDots || isOnLand(lng, lat)) {
                dotCoordinates.push([lng, lat]);
              }
            }
          }

          if (dotCoordinates.length > 0) {
            const dotGeometry = new SphereGeometry(
              0.01 * dotSizeMultiplier,
              4,
              4,
            );
            const dotColorObj = new Color(dotRgba.r, dotRgba.g, dotRgba.b);
            const dotMaterial = new MeshBasicMaterial({
              color: dotColorObj,
              transparent: dotRgba.a < 1 || dotRgba.a === 0,
              opacity: dotRgba.a,
            });
            const instanced = new InstancedMesh(
              dotGeometry,
              dotMaterial,
              dotCoordinates.length,
            );
            const matrix = new Matrix4();
            for (let i = 0; i < dotCoordinates.length; i++) {
              const [lng, lat] = dotCoordinates[i];
              const pos = latLngToPosition(lat, lng);
              matrix.makeScale(1, 1, 1);
              matrix.setPosition(
                pos.x * globeRadius,
                pos.y * globeRadius,
                pos.z * globeRadius,
              );
              instanced.setMatrixAt(i, matrix);
            }
            instanced.instanceMatrix.needsUpdate = true;
            dotInstances = instanced;
            globeGroup.add(dotInstances);
          }
        }

        updateMarkers();
        renderer.render(scene, camera);
        canvas.style.opacity = "1";
        canvas.style.visibility = "visible";
        setIsLoading(false);
      } catch (err) {
        if (!isDisposed) {
          setError("Failed to load land map data");
          setIsLoading(false);
        }
      }
    };

    const initialLongitudeRad = (initialLongitude * Math.PI) / 180;
    const initialLatitudeRad = (initialLatitude * Math.PI) / 180;
    const rotation = { x: initialLongitudeRad, y: initialLatitudeRad };
    const targetRotation = {
      x: initialLongitudeRad,
      y: initialLatitudeRad,
    };
    const velocity = { x: 0, y: 0 };
    let isDragging = false;
    let isHovering = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let animationFrameId = null;
    const lerpFactor =
      smoothingN === 0 ? 1 : mapLinear(smoothingN, 0, 1, 0.4, 0.03);
    const velocityDecay = mapLinear(smoothingN, 0, 1, 0.7, 0.96);

    const globeGroup = new Group();
    globeGroup.rotation.y = initialLongitudeRad;
    globeGroup.rotation.x = initialLatitudeRad;
    scene.add(globeGroup);
    globeGroup.add(oceanMesh);
    if (showGrid && graticuleColor && graticuleRgba.a > 0) {
      globeGroup.add(graticuleGroup);
    }
    globeGroup.add(continentOutlineGroup);
    markerMeshes.forEach((mesh) => globeGroup.add(mesh));

    const animate = () => {
      if (isDisposed) return;
      let needsRender = false;
      const threshold = 0.0005;
      if (!isDragging && rotationSpeed !== 0 && (!stopOnHover || !isHovering)) {
        targetRotation.x += rotationSpeed * 0.01;
      }
      if (!isDragging && smoothingN > 0) {
        if (
          Math.abs(velocity.x) > threshold ||
          Math.abs(velocity.y) > threshold
        ) {
          targetRotation.x += velocity.x;
          targetRotation.y += velocity.y;
          targetRotation.y = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, targetRotation.y),
          );
          velocity.x *= velocityDecay;
          velocity.y *= velocityDecay;
        } else {
          velocity.x = 0;
          velocity.y = 0;
        }
      }
      const dx = targetRotation.x - rotation.x;
      const dy = targetRotation.y - rotation.y;
      if (
        Math.abs(dx) > threshold ||
        Math.abs(dy) > threshold ||
        rotationSpeed !== 0 ||
        isDragging
      ) {
        rotation.x += dx * lerpFactor;
        rotation.y += dy * lerpFactor;
        rotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.y));
        needsRender = true;
      }
      if (needsRender || rotationSpeed !== 0 || isDragging) {
        globeGroup.rotation.y = rotation.x;
        globeGroup.rotation.x = rotation.y;
        renderer.render(scene, camera);
      }
      const hasVelocity =
        Math.abs(velocity.x) > threshold || Math.abs(velocity.y) > threshold;
      const hasLerpDelta = Math.abs(dx) > threshold || Math.abs(dy) > threshold;
      const needsContinue =
        isDragging || rotationSpeed !== 0 || hasVelocity || hasLerpDelta;
      if (needsContinue) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = null;
      }
    };

    const startAnimation = () => {
      if (animationFrameId === null && !isDisposed) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    if (rotationSpeed !== 0) {
      startAnimation();
    }

    const handlePointerDown = (clientX, clientY) => {
      isDragging = true;
      velocity.x = 0;
      velocity.y = 0;
      lastMouseX = clientX;
      lastMouseY = clientY;
      startAnimation();
    };

    const handlePointerMove = (clientX, clientY) => {
      if (!isDragging) return;
      const sensitivity = mapDragSpeedUiToSensitivity(dragSpeed);
      const dx = clientX - lastMouseX;
      const dy = clientY - lastMouseY;
      targetRotation.x += dx * sensitivity;
      targetRotation.y += dy * sensitivity;
      targetRotation.y = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, targetRotation.y),
      );
      velocity.x = dx * sensitivity * 0.3;
      velocity.y = dy * sensitivity * 0.3;
      lastMouseX = clientX;
      lastMouseY = clientY;
    };

    const handleMouseDown = (event) => {
      handlePointerDown(event.clientX, event.clientY);
      const handleMouseMoveDrag = (moveEvent) => {
        handlePointerMove(moveEvent.clientX, moveEvent.clientY);
      };
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMoveDrag);
        document.removeEventListener("mouseup", handleMouseUp);
        isDragging = false;
      };
      document.addEventListener("mousemove", handleMouseMoveDrag);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      handlePointerDown(event.touches[0].clientX, event.touches[0].clientY);
    };
    const handleTouchMove = (event) => {
      if (!isDragging || event.touches.length !== 1) return;
      handlePointerMove(event.touches[0].clientX, event.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    const raycaster = new Raycaster();
    const mouse = new Vector2();
    const handleMouseMove = (event) => {
      if (!stopOnHover) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(oceanMesh);
      isHovering = intersects.length > 0;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    const resizeObserver = new ResizeObserver(() => {
      if (isDisposed) return;
      const newWidth = container.clientWidth || container.offsetWidth || 500;
      const newHeight = container.clientHeight || container.offsetHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      const newCameraDistance = 2.5 / scaleMultiplier;
      camera.position.set(0, 0, newCameraDistance);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    loadWorldData();

    return () => {
      isDisposed = true;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      resizeObserver.disconnect();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [
    speed,
    smoothing,
    fill,
    fillColor,
    allDots,
    density,
    dotSize,
    dotColor,
    scale,
    stopOnHover,
    direction,
    initialLatitude,
    initialLongitude,
    oceanColor,
    outlineColor,
    showOutline,
    graticuleColor,
    showGrid,
    outlineWidth,
    dragSpeed,
    detail,
    rotationSpeed,
    dotSpacing,
    dotSizeMultiplier,
    markerRadiusMultiplier,
    scaleMultiplier,
  ]);

  const containerStyle = {
    ...style,
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (error) {
    return (
      <div style={containerStyle}>
        <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground font-mono text-xs">
          <Globe2 className="w-8 h-8 text-blue-400 mb-2 animate-pulse" />
          <span>GLOBAL TELEMETRY ONLINE</span>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={containerStyle} />;
}

// ============================================================================
// 2. COMPANY EXPERIENCE DATA (Left: TechnoHorizon, Middle: UPSRLM, Right: Edukhoj)
// ============================================================================

const EXPERIENCE_COMPANIES = [
  {
    id: "technohorizon",
    position: "left",
    shortName: "TechnoHorizon",
    name: "TechnoHorizon Co. Ltd.",
    role: "Software Developer",
    period: "11/2024 – Present",
    location: "Lucknow, IN",
    isLatest: false,
    badge: "CORE ENGINEERING",
    logo: technoLogo,
    route: "/experience/technohorizon",
    beamColorPrimary: "#38bdf8", // Sky Cyan
    beamColorSecondary: "#fbbf24", // Amber Gold
    accentBorder: "hover:border-sky-400/60",
    accentGlow: "rgba(56, 189, 248, 0.28)",
    summary:
      "Software Developer spearheading enterprise architecture, full-stack product delivery, and state-scale digital transformation initiatives.",
    highlights: [
      "Lead Architect for PMU–IT Unit technical deliverables",
      "Full-Stack React.js, React Native & Django REST ecosystems",
      "High-availability database & cloud deployment pipelines",
    ],
  },
  {
    id: "upsrlm",
    position: "center",
    shortName: "UPSRLM",
    name: "UPSRLM (PMU–IT Unit)",
    fullName: "Uttar Pradesh State Rural Livelihood Mission",
    role: "Lead Software Developer — PMU–IT",
    period: "11/2024 – Present",
    location: "Lucknow, IN",
    isLatest: true,
    badge: "LATEST // STATE MISSION",
    logo: upsrlmLogo,
    route: "/experience/upsrlm",
    beamColorPrimary: "#ff1f71", // Neon Rose/Magenta
    beamColorSecondary: "#38bdf8", // Cyan
    accentBorder: "hover:border-emerald-400/70",
    accentGlow: "rgba(16, 185, 129, 0.32)",
    summary:
      "Architected & engineered Pragati Setu 1.0 — a centralized digital ecosystem transforming manual rural development operations for 6.5L+ beneficiaries.",
    highlights: [
      "Beneficiary (BMS) & Training Management (TMS) Portals",
      "Enterprise Sakhi (EPSMS) Offline-First React Native App",
      "Lakhpati Didi (LDMS) & Automated Power BI DAX Pipelines",
    ],
  },
  {
    id: "edukhoj",
    position: "right",
    shortName: "Edukhoj",
    name: "Edukhoj Services",
    role: "Software Developer Intern",
    period: "09/2023 – 03/2024",
    location: "Lucknow, IN",
    isLatest: false,
    badge: "EDTECH PLATFORM",
    logo: edukhojLogo,
    route: "/experience/edukhoj",
    beamColorPrimary: "#ec4899", // Pink
    beamColorSecondary: "#818cf8", // Indigo
    accentBorder: "hover:border-pink-400/60",
    accentGlow: "rgba(236, 72, 153, 0.28)",
    summary:
      "Engineered scalable EdTech web applications using Python, Django ORM, PostgreSQL, ElasticSearch DSL, and interactive React.js interfaces.",
    highlights: [
      "ElasticSearch DSL & PostgreSQL bulk query optimization",
      "Responsive React.js UI components & REST API integration",
      "Production monitoring, agile sprints & technical handovers",
    ],
  },
];

// ============================================================================
// 3. MAIN EXPERIENCE COMPONENT
// ============================================================================

export default function Experience({ onSelectCompany }) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = (theme === "system" ? resolvedTheme : theme) !== "light";

  const [hoveredId, setHoveredId] = useState("upsrlm");
  const [selectedId, setSelectedId] = useState(null);

  // Refs for dynamic SVG top-to-bottom convergence calculation
  const stageRef = useRef(null);
  const nodeRefs = useRef({});
  const nexusRef = useRef(null);
  const [paths, setPaths] = useState([]);

  // Recalculate exact SVG cubic Bézier paths from the 3 top company nodes down to the Globe Nexus
  const updateConvergencePaths = useCallback(() => {
    if (!stageRef.current || !nexusRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const nexusRect = nexusRef.current.getBoundingClientRect();

    // Target convergence coordinates (Top-Center Nexus of the Globe)
    const endX = nexusRect.left - stageRect.left + nexusRect.width / 2;
    const endY = nexusRect.top - stageRect.top + nexusRect.height / 2;

    const computedPaths = EXPERIENCE_COMPANIES.map((comp) => {
      const el = nodeRefs.current[comp.id];
      if (!el) return null;
      const rect = el.getBoundingClientRect();

      // Start coordinates (Bottom-Center emitter port of each company node)
      const startX = rect.left - stageRect.left + rect.width / 2;
      const startY = rect.top - stageRect.top + rect.height;

      const deltaY = Math.max(80, endY - startY);
      // Smooth S-curve control points flowing top-to-bottom into the single Globe nexus
      const cp1X = startX;
      const cp1Y = startY + deltaY * 0.52;
      const cp2X = endX + (startX - endX) * 0.15;
      const cp2Y = endY - deltaY * 0.38;

      const d = `M ${startX.toFixed(1)} ${startY.toFixed(
        1,
      )} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(
        1,
      )} ${cp2Y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

      return {
        id: comp.id,
        d,
        startX,
        startY,
        endX,
        endY,
        primary: comp.beamColorPrimary,
        secondary: comp.beamColorSecondary,
      };
    }).filter(Boolean);

    setPaths(computedPaths);
  }, []);

  useEffect(() => {
    updateConvergencePaths();
    const timer = setTimeout(updateConvergencePaths, 150);

    let observer = null;
    if (typeof ResizeObserver !== "undefined" && stageRef.current) {
      observer = new ResizeObserver(() => {
        updateConvergencePaths();
      });
      observer.observe(stageRef.current);
    }

    window.addEventListener("resize", updateConvergencePaths);
    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateConvergencePaths);
    };
  }, [updateConvergencePaths]);

  // Handle clicking a company card/node to move to the next screen
  const handleCompanySelect = (company) => {
    setSelectedId(company.id);
    setHoveredId(company.id);

    if (typeof onSelectCompany === "function") {
      onSelectCompany(company);
    }

    // Dispatch route navigation event compatible with App.jsx TransitionParent engine
    window.dispatchEvent(
      new CustomEvent("app-navigate", {
        detail: {
          path: company.route,
          companyId: company.id,
          variant: "overlay",
          changeTheme: 0,
          overlayText: `INITIALIZING // ${company.shortName.toUpperCase()}`,
        },
      }),
    );
  };

  const activeCompany =
    EXPERIENCE_COMPANIES.find((c) => c.id === (hoveredId || "upsrlm")) ||
    EXPERIENCE_COMPANIES[1];

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground font-sans overflow-x-hidden touch-auto pt-44 sm:pt-48 md:pt-28 pb-24 select-none">
      {/* --- BACKGROUND DOT MATRIX & RADIAL ATMOSPHERE --- */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-35 dark:opacity-25"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px)"
            : "radial-gradient(rgba(15, 23, 42, 0.15) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_65%,rgba(56,189,248,0.08),transparent_65%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- 1. PAGE HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/60 bg-card/40 backdrop-blur-md mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            </span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-muted-foreground">
              Career Command Center
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground font-sans leading-[1.08] mb-4">
            Professional Experience
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-sans leading-relaxed max-w-2xl">
            Select an organization node below to launch its dedicated
            architecture breakdown. All mission streams converge into live
            production systems engineered in Lucknow, India.
          </p>
        </motion.div>

        {/* --- 2. CONVERGENCE STAGE: 3 TOP NODES -> TOP-TO-BOTTOM BEAMS -> 3D GLOBE --- */}
        <div
          ref={stageRef}
          className="relative w-full flex flex-col items-center"
        >
          {/* === DYNAMIC SVG CONVERGENCE LAYER (Top-to-Bottom Beams + Glowing Dots) === */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full z-10 overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter
                id="beam-glow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {paths.map((p) => (
                <linearGradient
                  key={`grad-${p.id}`}
                  id={`grad-${p.id}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={p.primary} stopOpacity="0.95" />
                  <stop
                    offset="55%"
                    stopColor={p.secondary}
                    stopOpacity="0.85"
                  />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                </linearGradient>
              ))}
            </defs>

            {paths.map((p, idx) => {
              const isFocused = hoveredId === p.id;
              const baseStroke = isDark
                ? "rgba(255, 255, 255, 0.16)"
                : "rgba(15, 23, 42, 0.18)";

              return (
                <g key={p.id}>
                  {/* 1. Base Continuous Grey Convergence Wire */}
                  <path
                    d={p.d}
                    fill="none"
                    stroke={baseStroke}
                    strokeWidth={isFocused ? 2.2 : 1.5}
                    className="transition-all duration-300"
                  />

                  {/* 2. Primary Traveling Laser Segment (Pink / Cyan / Gold) */}
                  <motion.path
                    d={p.d}
                    fill="none"
                    stroke={`url(#grad-${p.id})`}
                    strokeWidth={isFocused ? 3.2 : 2.2}
                    strokeLinecap="round"
                    filter="url(#beam-glow)"
                    strokeDasharray="65 260"
                    initial={{ strokeDashoffset: 325 }}
                    animate={{ strokeDashoffset: [325, 0] }}
                    transition={{
                      duration: isFocused ? 2.1 : 3.2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: idx * 0.4,
                    }}
                  />

                  {/* 3. Secondary Chasing Pulse Segment */}
                  <motion.path
                    d={p.d}
                    fill="none"
                    stroke={p.secondary}
                    strokeWidth={isFocused ? 2.6 : 1.8}
                    strokeLinecap="round"
                    strokeDasharray="35 290"
                    initial={{ strokeDashoffset: 180 }}
                    animate={{ strokeDashoffset: [180, -145] }}
                    transition={{
                      duration: isFocused ? 2.4 : 3.6,
                      repeat: Infinity,
                      ease: "linear",
                      delay: idx * 0.25 + 0.6,
                    }}
                  />

                  {/* 4. Traveling Glowing Particle Head on the Curve */}
                  <circle
                    r={isFocused ? 4 : 3}
                    fill={p.primary}
                    filter="url(#beam-glow)"
                  >
                    <animateMotion
                      dur={isFocused ? "2.1s" : "3.2s"}
                      repeatCount="indefinite"
                      path={p.d}
                    />
                  </circle>

                  {/* 5. Start Emitter Dot on Company Node */}
                  <circle
                    cx={p.startX}
                    cy={p.startY}
                    r={4}
                    fill={p.primary}
                    className="opacity-90"
                  />
                </g>
              );
            })}
          </svg>

          {/* === TOP ROW: 3 COMPANY CARDS / NODES (Left: TechnoHorizon, Middle: UPSRLM, Right: Edukhoj) === */}
          <div className="relative z-20 w-full grid grid-cols-3 gap-2.5 sm:gap-5 lg:gap-10 items-stretch">
            {EXPERIENCE_COMPANIES.map((company, idx) => {
              const isHovered = hoveredId === company.id;
              const isCenter = company.position === "center";

              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.65,
                    delay: idx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`flex flex-col items-center ${
                    isCenter ? "sm:-mt-3" : "sm:mt-3"
                  }`}
                >
                  {/* Interactive Company Card */}
                  <motion.button
                    type="button"
                    onClick={() => handleCompanySelect(company)}
                    onMouseEnter={() => setHoveredId(company.id)}
                    whileHover={{ y: -4, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      boxShadow: isHovered
                        ? `0 20px 50px -12px ${company.accentGlow}`
                        : undefined,
                    }}
                    className={`group relative w-full h-full flex flex-col items-center text-center p-3 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all duration-300 cursor-pointer outline-none ${
                      isHovered
                        ? "bg-card/90 dark:bg-neutral-900/85 border-blue-500/50"
                        : "bg-card/60 dark:bg-neutral-950/65 border-border/60 dark:border-white/10"
                    } ${company.accentBorder}`}
                  >
                    {/* Top Status Pill (LATEST highlighted prominently on UPSRLM) */}
                    <div className="mb-2.5 sm:mb-3.5">
                      {company.isLatest ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_16px_rgba(16,185,129,0.25)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>LATEST</span>
                          <span className="hidden md:inline">
                            // STATE MISSION
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono uppercase tracking-wider bg-muted/50 text-muted-foreground border border-border/60">
                          {company.badge}
                        </span>
                      )}
                    </div>

                    {/* Circular Company Logo Medallion (Matches Circular Nodes in Reference) */}
                    <div
                      className={`relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full p-2.5 sm:p-3.5 bg-white dark:bg-neutral-900 border-2 transition-all duration-300 flex items-center justify-center shadow-lg mb-3 sm:mb-4 ${
                        isHovered
                          ? "border-blue-400 scale-105 shadow-[0_0_25px_rgba(56,189,248,0.35)]"
                          : "border-border/80 dark:border-white/15"
                      }`}
                    >
                      <img
                        src={company.logo}
                        alt={company.name}
                        draggable={false}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>

                    {/* Company Name & Role */}
                    <h2 className="text-xs sm:text-base lg:text-xl font-bold tracking-tight text-foreground font-sans leading-snug line-clamp-2">
                      {company.name}
                    </h2>

                    <p className="mt-1 text-[10px] sm:text-xs lg:text-sm font-medium text-blue-500 dark:text-blue-400 line-clamp-1">
                      {company.role}
                    </p>

                    {/* Date & Location Meta (Hidden on ultra-narrow mobile to keep 3-col clean, shown on sm+) */}
                    <div className="hidden sm:flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2.5 text-[11px] font-mono text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-400/80" />
                        {company.period}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400/80" />
                        {company.location}
                      </span>
                    </div>

                    {/* Desktop Brief Summary */}
                    <p className="hidden lg:block mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {company.summary}
                    </p>

                    {/* Action Footer */}
                    <div className="mt-3 sm:mt-4 pt-2.5 border-t border-border/40 w-full flex items-center justify-center gap-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-foreground/80 group-hover:text-blue-400 transition-colors">
                      <span className="truncate">Select Node</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </motion.button>

                  {/* Bottom Emitter Port Anchor (Where the SVG convergence line starts) */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[company.id] = el;
                    }}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 -mt-2 rounded-full border-2 bg-background z-30 transition-all duration-300 ${
                      isHovered
                        ? "border-blue-400 scale-125 shadow-[0_0_12px_rgba(56,189,248,0.9)]"
                        : "border-muted-foreground/50"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* === VERTICAL CONVERGENCE CORRIDOR SPACER === */}
          <div className="w-full h-28 sm:h-36 md:h-44 pointer-events-none" />

          {/* === BOTTOM/CENTER: 3D GLOBE + CONCENTRIC ORBITAL RINGS (Matches Reference Nexus) === */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            {/* Top Convergence Nexus Node (All 3 company streams meet right here at the top of the Globe) */}
            <div
              ref={nexusRef}
              className="relative z-30 -mb-5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_24px_rgba(56,189,248,0.95)]"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400" />
            </div>

            {/* Globe + Concentric Rotating HUD Rings Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[290px] h-[290px] sm:w-[400px] sm:h-[400px] md:w-[460px] md:h-[460px] flex items-center justify-center"
            >
              {/* Soft Radial Grid Aura behind Globe */}
              <div className="pointer-events-none absolute inset-6 rounded-full bg-gradient-to-b from-blue-500/10 via-sky-400/5 to-amber-500/10 blur-2xl" />

              {/* Concentric Rotating Dashed Rings & Directional Arrows (Matches Reference Image) */}
              <svg
                viewBox="0 0 500 500"
                className="pointer-events-none absolute inset-0 w-full h-full z-10 overflow-visible"
              >
                {/* Outer Counter-Rotating Amber/Orange Dashed Ring */}
                <g
                  className="origin-center animate-[spin_38s_linear_infinite]"
                  style={{ transformOrigin: "250px 250px" }}
                >
                  <circle
                    cx="250"
                    cy="250"
                    r="238"
                    fill="none"
                    stroke="rgba(251, 146, 60, 0.45)"
                    strokeWidth="1.5"
                    strokeDasharray="16 14 6 14"
                  />
                  {/* Directional Orbital Arrowheads */}
                  <polygon
                    points="250,8 244,16 256,16"
                    fill="rgba(251, 146, 60, 0.75)"
                  />
                  <polygon
                    points="250,492 244,484 256,484"
                    fill="rgba(251, 146, 60, 0.75)"
                  />
                </g>

                {/* Middle Reverse-Rotating Cyan Dashed Ring */}
                <g
                  className="origin-center animate-[spin_26s_linear_infinite_reverse]"
                  style={{ transformOrigin: "250px 250px" }}
                >
                  <circle
                    cx="250"
                    cy="250"
                    r="214"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.5)"
                    strokeWidth="1.5"
                    strokeDasharray="24 18 4 18"
                  />
                  <circle
                    cx="250"
                    cy="36"
                    r="3.5"
                    fill="rgba(56, 189, 248, 0.9)"
                  />
                  <circle
                    cx="250"
                    cy="464"
                    r="3.5"
                    fill="rgba(56, 189, 248, 0.9)"
                  />
                </g>

                {/* Inner Subtle Structural Ring */}
                <circle
                  cx="250"
                  cy="250"
                  r="192"
                  fill="none"
                  stroke={
                    isDark
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(15, 23, 42, 0.12)"
                  }
                  strokeWidth="1"
                />
              </svg>

              {/* 3D Interactive Three.js Globe */}
              <div className="relative z-20 w-[225px] h-[225px] sm:w-[310px] sm:h-[310px] md:w-[360px] md:h-[360px] rounded-full overflow-hidden shadow-[0_0_60px_rgba(56,189,248,0.18)]">
                <Globe
                  speed={2.2}
                  smoothing={8}
                  scale={9.8}
                  fill="dots"
                  dots={{
                    color: isDark ? "#ffffff" : "#0f172a",
                    size: 5,
                    density: 8,
                    allDots: false,
                  }}
                  oceanColor={isDark ? "#05070B" : "#f1f5f9"}
                  outlineColor={isDark ? "#38bdf8" : "#0284c7"}
                  showOutline={true}
                  outlineWidth={1.3}
                  graticuleColor={
                    isDark
                      ? "rgba(56, 189, 248, 0.16)"
                      : "rgba(2, 132, 199, 0.18)"
                  }
                  showGrid={true}
                  stopOnHover={true}
                  direction="right"
                  initialLatitude={22}
                  initialLongitude={-81}
                  markerConfig={{
                    markers: [
                      { lat: 26.8467, lng: 80.9462 }, // Lucknow, Uttar Pradesh, India
                    ],
                    color: "#ff1f71",
                    size: 52,
                  }}
                />
              </div>

              {/* Floating Coordinates HUD Pill at Bottom of Globe */}
              <div className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border/80 shadow-lg flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#ff1f71] shadow-[0_0_8px_#ff1f71]" />
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/90">
                  NEXUS // LUCKNOW, IN (26.85°N, 80.95°E)
                </span>
              </div>
            </motion.div>
          </div>

          {/* === 3. ACTIVE COMPANY TELEMETRY & QUICK LAUNCH BAR === */}
          <div className="w-full max-w-4xl mx-auto mt-12 sm:mt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCompany.id}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-border/70 dark:border-white/10 bg-card/60 dark:bg-neutral-900/60 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2.5 text-left flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
                      ACTIVE TELEMETRY // {activeCompany.shortName}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      • {activeCompany.period}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-foreground font-sans">
                    {activeCompany.fullName || activeCompany.name} —{" "}
                    <span className="text-blue-400 font-medium">
                      {activeCompany.role}
                    </span>
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {activeCompany.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeCompany.highlights.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md bg-muted/50 border border-border/60 text-foreground/85"
                      >
                        <Layers className="w-3 h-3 text-blue-400 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCompanySelect(activeCompany)}
                  className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-sans font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300 cursor-pointer"
                >
                  <span>Open {activeCompany.shortName} Dossier</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
