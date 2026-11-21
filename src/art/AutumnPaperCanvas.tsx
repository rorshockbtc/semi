'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import {
  type Rgb,
  sampleAutumnPalette,
  scheduleSoftEvaporate,
  smoothstep,
} from '@/art/autumn-palette';

interface SatelliteFleck {
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
  maxScale: number;
}

interface WaterBloom {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  baseRadius: number;
  maxSpread: number;
  aspect: number;
  color: Rgb;
  bornAt: number;
  lifeMs: number;
  evaporateAt?: number;
  lobes: number[];
  peakAlpha: number;
  flecks: SatelliteFleck[];
}

const INTERACTIVE_OR_SURFACE_SELECTOR =
  'header, nav, footer, input, textarea, button, a, select, label, summary, details, dialog, video, iframe, [data-wc-ignore]';

/**
 * Interactive background-only autumn watercolor drop & fleck layer for `/` (Home).
 * Adapted from Asterisk's StudioPaperCanvas for Warm Sandstone (#E8E2D5):
 * - Spawns organic multi-lobed autumn pigment blossoms + tiny satellite flecks on empty paper margins.
 * - Never captures pointer events (`pointer-events-none`), keeping mobile scroll (`pan-y`) 100% native.
 * - Sleeps completely (`rafId = 0`) when all blossoms finish evaporating, when off-screen, or when motion is paused.
 */
export default function AutumnPaperCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const active = !reduce && motionActive;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!active) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let totalDistance = 0;
    let lastPoint: { x: number; y: number; time: number } | null = null;
    const dabs: WaterBloom[] = [];

    const resize = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const spawnDab = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      speed: number,
      now: number,
      boost = 1
    ) => {
      const isMobile = width < 640;
      const mobileScale = isMobile ? 0.78 : 1;
      const angle = Math.atan2(dy, dx);
      const color = sampleAutumnPalette(totalDistance);
      const clampSpeed = Math.min(speed, 44);
      const baseRadius = (18 + clampSpeed * 0.42 + Math.random() * 10) * boost * mobileScale;

      const lobes: number[] = [];
      for (let i = 0; i < 11; i++) {
        lobes.push(0.78 + Math.random() * 0.44);
      }

      const fleckCount = 2 + Math.floor(Math.random() * 2);
      const flecks: SatelliteFleck[] = [];
      for (let i = 0; i < fleckCount; i++) {
        const spreadAngle = angle + (Math.random() - 0.5) * 2.4;
        const reach = (16 + Math.random() * 26) * boost * mobileScale;
        flecks.push({
          ox: Math.cos(spreadAngle) * reach,
          oy: Math.sin(spreadAngle) * reach,
          vx: Math.cos(spreadAngle) * (0.12 + Math.random() * 0.22),
          vy: Math.sin(spreadAngle) * (0.12 + Math.random() * 0.22),
          r: (2.0 + Math.random() * 3.6) * boost * mobileScale,
          maxScale: 1.9 + Math.random() * 0.6,
        });
      }

      dabs.push({
        x,
        y,
        vx: dx * 0.03 + (Math.random() - 0.5) * 0.28,
        vy: dy * 0.03 + (Math.random() - 0.5) * 0.28,
        angle: angle + (Math.random() - 0.5) * 0.4,
        baseRadius,
        maxSpread: 1.85 + Math.random() * 0.5,
        aspect: 1.15 + Math.min(clampSpeed / 44, 0.55),
        color,
        bornAt: now,
        lifeMs: 8200 + Math.random() * 2200,
        lobes,
        peakAlpha: 0.1 + Math.random() * 0.04,
        flecks,
      });

      scheduleSoftEvaporate(dabs, isMobile ? 48 : 110, now);
    };

    const drawDab = (dab: WaterBloom, now: number): boolean => {
      const age = now - dab.bornAt;
      if (age >= dab.lifeMs) return false;
      if (age < 0) return true;

      let evapT = 0;
      if (dab.evaporateAt !== undefined) {
        evapT = Math.min(1, Math.max(0, (now - dab.evaporateAt) / 2800));
        if (evapT >= 1) return false;
      }

      const t = age / dab.lifeMs;
      const fastSpread = 1 - Math.pow(1 - Math.min(1, age / 1300), 2.3);
      const continuousBloom = fastSpread + t * 0.34;
      const evapSwell = 1 + 0.32 * smoothstep(0, 1, evapT);
      const radius = dab.baseRadius * (1 + (dab.maxSpread - 1) * continuousBloom) * evapSwell;

      const fadeIn = Math.min(1, age / 240);
      const fadeOut = t > 0.54 ? Math.pow(1 - (t - 0.54) / 0.46, 1.55) : 1;
      const evapFade = dab.evaporateAt !== undefined ? Math.pow(1 - evapT, 1.7) : 1;
      const alpha = dab.peakAlpha * fadeIn * fadeOut * evapFade;
      if (alpha <= 0.003) return dab.evaporateAt === undefined;

      const driftFrames = age / 16.67;
      const cx = dab.x + dab.vx * driftFrames * 0.44;
      const cy = dab.y + dab.vy * driftFrames * 0.44;
      const { r, g, b } = dab.color;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(dab.angle);
      ctx.scale(dab.aspect * (1 - t * 0.14), 1 + t * 0.1);

      const grad = ctx.createRadialGradient(0, 0, radius * 0.08, 0, 0, radius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.65).toFixed(4)})`);
      grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.96).toFixed(4)})`);
      grad.addColorStop(0.84, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.52).toFixed(4)})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      const n = dab.lobes.length;
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < n; i++) {
        const theta = (i / n) * Math.PI * 2;
        const rr = radius * (dab.lobes[i] + Math.sin(t * 2.8 + i * 1.6) * 0.07);
        pts.push({ x: Math.cos(theta) * rr, y: Math.sin(theta) * rr });
      }
      for (let i = 0; i < n; i++) {
        const curr = pts[i];
        const next = pts[(i + 1) % n];
        const midX = (curr.x + next.x) * 0.5;
        const midY = (curr.y + next.y) * 0.5;
        if (i === 0) {
          const prev = pts[n - 1];
          ctx.moveTo((prev.x + curr.x) * 0.5, (prev.y + curr.y) * 0.5);
        }
        ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      for (const fl of dab.flecks) {
        const fx = cx + fl.ox + fl.vx * driftFrames * 0.4;
        const fy = cy + fl.oy + fl.vy * driftFrames * 0.4;
        const fr = fl.r * (1 + (fl.maxScale - 1) * fastSpread);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.75).toFixed(4)})`;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fill();
      }

      return true;
    };

    const startLoop = () => {
      if (rafId) return;
      const tick = (now: number) => {
        if (document.hidden) {
          rafId = 0;
          return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'multiply';
        for (let i = dabs.length - 1; i >= 0; i--) {
          if (!drawDab(dabs[i], now)) {
            dabs.splice(i, 1);
          }
        }
        if (dabs.length > 0) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = 0;
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    const isOverSurface = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest(INTERACTIVE_OR_SURFACE_SELECTOR));
    };

    const onPointerMove = (e: PointerEvent) => {
      // Ignore while inside the dark full-bleed Hero at the very top
      if (window.scrollY < window.innerHeight * 0.65 && e.clientY < window.innerHeight * 0.75) {
        return;
      }
      if (isOverSurface(e.target)) {
        lastPoint = null;
        return;
      }
      const now = performance.now();
      const x = e.clientX;
      const y = e.clientY;
      if (!lastPoint) {
        lastPoint = { x, y, time: now };
        return;
      }
      const dx = x - lastPoint.x;
      const dy = y - lastPoint.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 22) return;

      const dt = Math.max(8, now - lastPoint.time);
      const speed = (dist / dt) * 16;
      totalDistance += dist;
      lastPoint = { x, y, time: now };
      spawnDab(x, y, dx, dy, speed, now, 1);
      startLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (window.scrollY < window.innerHeight * 0.65) return;
      if (isOverSurface(e.target)) return;
      const now = performance.now();
      totalDistance += 95;
      spawnDab(e.clientX, e.clientY, 1, 0.3, 14, now, 1.2);
      startLoop();
    };

    let lastScrollBloom = 0;
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.7) return;
      const now = performance.now();
      if (now - lastScrollBloom < 1100 || dabs.length > 6) return;
      lastScrollBloom = now;
      totalDistance += 85;
      const marginX = Math.random() < 0.5 ? width * (0.08 + Math.random() * 0.12) : width * (0.8 + Math.random() * 0.12);
      const viewY = height * (0.28 + Math.random() * 0.44);
      spawnDab(marginX, viewY, 1, -0.4, 12, now, 0.95);
      startLoop();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [active]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-testid="home-autumn-paper-canvas"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block h-full w-full mix-blend-multiply" />
    </div>
  );
}
