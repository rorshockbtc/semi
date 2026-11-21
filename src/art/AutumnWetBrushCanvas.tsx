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

interface BrushDab {
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
}

/**
 * Interactive plein-air wet-on-wet watercolor brushstroke layer for `/gallery`.
 * Adapted from Asterisk's `WetBrushCanvas` for Semi's autumn palette & sandstone paper:
 * - Seeds 3 gentle welcoming brushstrokes on mount so mobile visitors immediately see wet pigment.
 * - Responds to mouse movement and thumb touch/drag while keeping `touch-action: pan-y` natural.
 * - Each stroke spreads outward with authentic cauliflower wet rims (`multiply` glaze) and evaporates cleanly.
 */
export default function AutumnWetBrushCanvas({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const active = !reduce && motionActive;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

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
    let visible = true;
    let totalDistance = 0;
    let lastPoint: { x: number; y: number; time: number } | null = null;
    const dabs: BrushDab[] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(container);

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
      const mobileScale = isMobile ? 0.8 : 1;
      const angle = Math.atan2(dy, dx);
      const color = sampleAutumnPalette(totalDistance);
      const clampSpeed = Math.min(speed, 48);
      const baseRadius = (22 + clampSpeed * 0.52 + Math.random() * 12) * boost * mobileScale;

      const lobes: number[] = [];
      for (let i = 0; i < 9; i++) {
        lobes.push(0.76 + Math.random() * 0.46);
      }

      dabs.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: dx * 0.04 + (Math.random() - 0.5) * 0.32,
        vy: dy * 0.04 + (Math.random() - 0.5) * 0.32 - 0.06,
        angle: angle + (Math.random() - 0.5) * 0.35,
        baseRadius,
        maxSpread: 1.9 + Math.random() * 0.5,
        aspect: 1.25 + Math.min(clampSpeed / 38, 0.8),
        color,
        bornAt: now,
        lifeMs: 9000 + Math.random() * 2200,
        lobes,
        peakAlpha: 0.105 + Math.random() * 0.045,
      });

      scheduleSoftEvaporate(dabs, isMobile ? 120 : 280, now);
    };

    const drawDab = (dab: BrushDab, now: number): boolean => {
      const age = now - dab.bornAt;
      if (age >= dab.lifeMs) return false;
      if (age < 0) return true;

      let evapT = 0;
      if (dab.evaporateAt !== undefined) {
        evapT = Math.min(1, Math.max(0, (now - dab.evaporateAt) / 3000));
        if (evapT >= 1) return false;
      }

      const t = age / dab.lifeMs;
      const fastSpread = 1 - Math.pow(1 - Math.min(1, age / 1400), 2.4);
      const continuousBloom = fastSpread + t * 0.36;
      const naturalSwell = t > 0.55 ? 1 + smoothstep(0.55, 1.0, t) * 0.26 : 1;
      const evapSwell = 1 + 0.36 * smoothstep(0, 1, evapT);
      const radius =
        dab.baseRadius * (1 + (dab.maxSpread - 1) * continuousBloom) * naturalSwell * evapSwell;

      const fadeIn = Math.min(1, age / 240);
      const fadeOut = t > 0.55 ? Math.pow(1 - (t - 0.55) / 0.45, 1.55) : 1;
      const evapFade = dab.evaporateAt !== undefined ? Math.pow(1 - evapT, 1.75) : 1;
      const alpha = dab.peakAlpha * fadeIn * fadeOut * evapFade;
      if (alpha <= 0.003) return dab.evaporateAt === undefined;

      const driftFrames = age / 16.67;
      const cx = dab.x + dab.vx * driftFrames * 0.46;
      const cy = dab.y + dab.vy * driftFrames * 0.46;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(dab.angle);
      ctx.scale(dab.aspect * (1 - t * 0.18), 1 + t * 0.12);

      const { r, g, b } = dab.color;
      const grad = ctx.createRadialGradient(0, 0, radius * 0.08, 0, 0, radius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.7).toFixed(4)})`);
      grad.addColorStop(0.58, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.96).toFixed(4)})`);
      grad.addColorStop(0.82, `rgba(${r}, ${g}, ${b}, ${(alpha * 0.54).toFixed(4)})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      const n = dab.lobes.length;
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < n; i++) {
        const theta = (i / n) * Math.PI * 2;
        const wobble = dab.lobes[i] + Math.sin(t * 3.1 + i * 1.7) * 0.08;
        const rr = radius * wobble;
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
      return true;
    };

    const startLoop = () => {
      if (rafId) return;
      const tick = (now: number) => {
        if (!visible || document.hidden) {
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

    // Seed a subtle plein-air wash arc in the upper header so mobile & desktop start warm
    const seedNow = performance.now();
    for (let s = 0; s < 5; s++) {
      totalDistance += 95;
      spawnDab(
        width * (0.52 + s * 0.08),
        Math.min(180, height * 0.08) + Math.sin(s * 1.1) * 24,
        14,
        -3,
        18,
        seedNow + s * 90,
        1.15
      );
    }
    startLoop();

    const toLocal = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < -20 || x > rect.width + 20 || y < -20 || y > rect.height + 20) return null;
      return { x, y };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('button, a, dialog')) {
        lastPoint = null;
        return;
      }
      const pt = toLocal(e);
      if (!pt) {
        lastPoint = null;
        return;
      }
      const now = performance.now();
      if (!lastPoint) {
        lastPoint = { x: pt.x, y: pt.y, time: now };
        return;
      }
      const dx = pt.x - lastPoint.x;
      const dy = pt.y - lastPoint.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 16) return;

      const dt = Math.max(8, now - lastPoint.time);
      const speed = (dist / dt) * 16;
      totalDistance += dist;
      lastPoint = { x: pt.x, y: pt.y, time: now };
      spawnDab(pt.x, pt.y, dx, dy, speed, now, 1);
      startLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('button, a, dialog')) return;
      const pt = toLocal(e);
      if (!pt) return;
      const now = performance.now();
      totalDistance += 110;
      spawnDab(pt.x, pt.y, 1, 0.2, 16, now, 1.25);
      startLoop();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [active, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="gallery-autumn-wet-brush"
      className="pointer-events-none absolute inset-0 z-0 block h-full w-full"
    />
  );
}
