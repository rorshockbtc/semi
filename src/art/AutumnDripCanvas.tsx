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
import { isLowEndDevice } from '@/art/device-tier';

interface MemoryBloom {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  rotSpeed: number;
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
 * Full-page interactive autumn watercolor & memory-thread canvas for `/about`.
 *
 * Replaces the slow hero-only gravity drips with a lively, responsive full-viewport
 * `mix-blend-multiply` watercolor wash that blooms on pointer movement, click/tap,
 * and scroll across the entire About page.
 */
export default function AutumnDripCanvas({
  containerRef: _containerRef,
}: {
  containerRef?: React.RefObject<HTMLElement | null>;
}) {
  void _containerRef;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const active = !reducedMotion && motionActive;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lowEnd = isLowEndDevice();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let paletteCursor = 18;
    let lastScrollY = window.scrollY;
    let scrollAccum = 0;
    let lastPointer: { x: number; y: number; time: number } | null = null;
    const blooms: MemoryBloom[] = [];

    const resize = () => {
      dpr = lowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnBloom = (
      x: number,
      y: number,
      opts?: {
        vx?: number;
        vy?: number;
        baseRadius?: number;
        maxSpread?: number;
        lifeMs?: number;
        peakAlpha?: number;
      }
    ) => {
      const now = performance.now();
      const maxBlooms = lowEnd ? 22 : 46;
      if (blooms.length >= maxBlooms) {
        scheduleSoftEvaporate(blooms, maxBlooms, now);
      }
      paletteCursor = (paletteCursor + 1) % 360;
      const color = sampleAutumnPalette(paletteCursor * 0.19);
      const lobes = Array.from({ length: 7 }, () => 0.8 + Math.random() * 0.42);
      blooms.push({
        x,
        y,
        vx: opts?.vx ?? (Math.random() - 0.5) * 0.55,
        vy: opts?.vy ?? (Math.random() - 0.5) * 0.45,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        baseRadius: opts?.baseRadius ?? 18 + Math.random() * 18,
        maxSpread: opts?.maxSpread ?? 52 + Math.random() * 44,
        aspect: 0.72 + Math.random() * 0.48,
        color,
        bornAt: now,
        lifeMs: opts?.lifeMs ?? 2400 + Math.random() * 1400,
        lobes,
        peakAlpha: opts?.peakAlpha ?? 0.24 + Math.random() * 0.1,
      });
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Seed lively initial blooms across the viewport
    for (let i = 0; i < (lowEnd ? 4 : 7); i++) {
      spawnBloom(
        width * (0.12 + Math.random() * 0.76),
        height * (0.14 + Math.random() * 0.72),
        { maxSpread: 68 + Math.random() * 46, lifeMs: 3200 + i * 260, peakAlpha: 0.22 }
      );
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;
      const now = performance.now();
      const prev = lastPointer;
      if (prev && now - prev.time < 22) return;
      const dx = prev ? e.clientX - prev.x : 0;
      const dy = prev ? e.clientY - prev.y : 0;
      const dist = Math.hypot(dx, dy);
      if (prev && dist < 12) return;

      lastPointer = { x: e.clientX, y: e.clientY, time: now };
      spawnBloom(e.clientX, e.clientY, {
        vx: Math.max(-1.6, Math.min(1.6, dx * 0.035)),
        vy: Math.max(-1.6, Math.min(1.6, dy * 0.035)),
        baseRadius: 14 + Math.min(18, dist * 0.18),
        maxSpread: 44 + Math.min(48, dist * 0.35),
        lifeMs: 1900 + Math.random() * 900,
        peakAlpha: 0.28,
      });
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!active) return;
      for (let i = 0; i < (lowEnd ? 2 : 3); i++) {
        spawnBloom(
          e.clientX + (Math.random() - 0.5) * 26,
          e.clientY + (Math.random() - 0.5) * 26,
          {
            vx: (Math.random() - 0.5) * 1.4,
            vy: (Math.random() - 0.5) * 1.4,
            baseRadius: 20 + Math.random() * 14,
            maxSpread: 64 + Math.random() * 38,
            lifeMs: 2200,
            peakAlpha: 0.3,
          }
        );
      }
    };

    const onScroll = () => {
      if (!active) return;
      const curY = window.scrollY;
      const delta = curY - lastScrollY;
      lastScrollY = curY;
      scrollAccum += Math.abs(delta);
      if (scrollAccum >= 48) {
        scrollAccum = 0;
        const fromLeft = Math.random() > 0.5;
        spawnBloom(
          fromLeft ? width * (0.08 + Math.random() * 0.25) : width * (0.67 + Math.random() * 0.25),
          height * (0.18 + Math.random() * 0.64),
          {
            vx: fromLeft ? 0.9 : -0.9,
            vy: delta > 0 ? -0.55 : 0.55,
            baseRadius: 22,
            maxSpread: 78,
            lifeMs: 2300,
            peakAlpha: 0.24,
          }
        );
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    let lastDraw = 0;
    const minFrameMs = lowEnd ? 33 : 16;

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      if (now - lastDraw < minFrameMs) return;
      lastDraw = now;

      ctx.clearRect(0, 0, width, height);
      if (!active) return;

      for (let i = blooms.length - 1; i >= 0; i--) {
        const b = blooms[i];
        const age = now - b.bornAt;
        const endAt = b.evaporateAt ? b.evaporateAt - b.bornAt : b.lifeMs;
        if (age >= endAt) {
          blooms.splice(i, 1);
          continue;
        }

        const t = age / endAt;
        const fadeIn = smoothstep(0, 0.14, t);
        const fadeOut = 1 - smoothstep(0.55, 1, t);
        const alpha = b.peakAlpha * fadeIn * fadeOut;
        if (alpha <= 0.004) continue;

        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.97;
        b.vy *= 0.97;
        b.angle += b.rotSpeed;

        const radius = b.baseRadius + b.maxSpread * smoothstep(0, 0.72, t);
        const { r, g, b: bl } = b.color;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.scale(1, b.aspect);

        const grad = ctx.createRadialGradient(0, 0, radius * 0.12, 0, 0, radius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${bl}, ${(alpha * 0.55).toFixed(3)})`);
        grad.addColorStop(0.68, `rgba(${r}, ${g}, ${bl}, ${(alpha * 0.9).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${bl}, 0)`);

        ctx.beginPath();
        const pts = b.lobes.length;
        for (let p = 0; p <= pts; p++) {
          const idx = p % pts;
          const nextIdx = (p + 1) % pts;
          const a0 = (idx / pts) * Math.PI * 2;
          const a1 = (nextIdx / pts) * Math.PI * 2;
          const r0 = radius * b.lobes[idx];
          const r1 = radius * b.lobes[nextIdx];
          const x0 = Math.cos(a0) * r0;
          const y0 = Math.sin(a0) * r0;
          const x1 = Math.cos(a1) * r1;
          const y1 = Math.sin(a1) * r1;
          if (p === 0) ctx.moveTo(x0, y0);
          ctx.quadraticCurveTo(x0, y0, (x0 + x1) * 0.5, (y0 + y1) * 0.5);
        }
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="about-watercolor-canvas"
      className="pointer-events-none fixed inset-0 z-0 mix-blend-multiply"
    />
  );
}
