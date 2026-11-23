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

interface WashBloom {
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
  grooveArc: boolean;
}

/**
 * Full-page scroll + pointer painterly watercolor engine exclusive to `/songs`.
 *
 * Distinct from Home (falling leaves), Gallery (plein-air wet brush), About (gravity drips),
 * and Asterisk's sky wash:
 * - Uses authentic wet-edge cauliflower watercolor pigment (`multiply` glaze on Warm Sandstone).
 * - Scrolling down the 12-track album unfurls alternating painted "resonance ribbons" down the page.
 * - Moving the mouse or touching blooms warm autumn + CHB pink watercolor pools & subtle vinyl-groove arcs.
 */
export default function SongsVinylWash() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const active = !reducedMotion && motionActive;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let paletteCursor = 40;
    let lastScrollY = window.scrollY;
    let scrollAccum = 0;
    let scrollRibbonStep = 0;
    let lastPointer: { x: number; y: number; time: number } | null = null;
    const blooms: WashBloom[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const spawnBloom = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      now: number,
      opts?: { radiusScale?: number; alpha?: number; grooveArc?: boolean; lifeMs?: number }
    ) => {
      const isMobile = width < 640;
      const scale = (isMobile ? 0.78 : 1) * (opts?.radiusScale ?? 1);
      paletteCursor += 85 + Math.random() * 55;
      const color = sampleAutumnPalette(paletteCursor);

      const lobes: number[] = [];
      const lobeCount = 10;
      for (let i = 0; i < lobeCount; i++) {
        lobes.push(0.78 + Math.random() * 0.44);
      }

      blooms.push({
        x,
        y,
        vx: dx * 0.025 + (Math.random() - 0.5) * 0.25,
        vy: dy * 0.025 + (Math.random() - 0.5) * 0.25,
        angle: Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.004,
        baseRadius: (42 + Math.random() * 26) * scale,
        maxSpread: 1.85 + Math.random() * 0.45,
        aspect: 1.35 + Math.random() * 0.45,
        color,
        bornAt: now,
        lifeMs: opts?.lifeMs ?? 9500 + Math.random() * 2500,
        lobes,
        peakAlpha: opts?.alpha ?? 0.2,
        grooveArc: Boolean(opts?.grooveArc),
      });

      scheduleSoftEvaporate(blooms, 36, now);
    };

    const drawBloom = (b: WashBloom, now: number): boolean => {
      const age = now - b.bornAt;
      if (age >= b.lifeMs) return false;
      if (age < 0) return true;

      let evapT = 0;
      if (b.evaporateAt !== undefined) {
        evapT = Math.min(1, Math.max(0, (now - b.evaporateAt) / 2600));
        if (evapT >= 1) return false;
      }

      const t = age / b.lifeMs;
      const spread = 1 - Math.pow(1 - Math.min(1, age / 1300), 2.3) + t * 0.32;
      const swell = (t > 0.55 ? 1 + smoothstep(0.55, 1, t) * 0.22 : 1) * (1 + 0.3 * smoothstep(0, 1, evapT));
      const radius = b.baseRadius * (1 + (b.maxSpread - 1) * spread) * swell;

      const fadeIn = Math.min(1, age / 260);
      const fadeOut = t > 0.52 ? Math.pow(1 - (t - 0.52) / 0.48, 1.5) : 1;
      const evapFade = b.evaporateAt !== undefined ? Math.pow(1 - evapT, 1.7) : 1;
      const alpha = b.peakAlpha * fadeIn * fadeOut * evapFade;
      if (alpha <= 0.003) return b.evaporateAt === undefined;

      const frames = age / 16.67;
      const cx = b.x + b.vx * frames * 0.45;
      const cy = b.y + b.vy * frames * 0.45;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(b.angle + b.rotSpeed * frames);
      ctx.scale(b.aspect * (1 - t * 0.16), 1 + t * 0.12);

      const { r, g, b: blue } = b.color;
      // Wet-edge watercolor gradient: translucent center pooling into a richer pigment rim
      const grad = ctx.createRadialGradient(0, 0, radius * 0.08, 0, 0, radius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${blue}, ${(alpha * 0.58).toFixed(4)})`);
      grad.addColorStop(0.62, `rgba(${r}, ${g}, ${blue}, ${(alpha * 0.98).toFixed(4)})`);
      grad.addColorStop(0.84, `rgba(${r}, ${g}, ${blue}, ${(alpha * 0.52).toFixed(4)})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${blue}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      const n = b.lobes.length;
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < n; i++) {
        const theta = (i / n) * Math.PI * 2;
        const wobble = b.lobes[i] + Math.sin(t * 2.8 + i * 1.6) * 0.075;
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

      // Delicate painted vinyl-groove arc inside select scroll/pointer blooms
      if (b.grooveArc) {
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.72, -0.4, Math.PI * 0.85);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${blue}, ${(alpha * 0.65).toFixed(4)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      ctx.restore();
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
        for (let i = blooms.length - 1; i >= 0; i--) {
          if (!drawBloom(blooms[i], now)) {
            blooms.splice(i, 1);
          }
        }
        if (blooms.length > 0) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = 0;
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    // 1. Seed rich painterly washes across upper, middle, and lower viewport (pre-bloomed at -900ms)
    const seedNow = performance.now();
    const seedPoints = [
      { rx: 0.14, ry: 0.18, s: 1.45, g: false },
      { rx: 0.34, ry: 0.24, s: 1.3, g: true },
      { rx: 0.62, ry: 0.16, s: 1.5, g: false },
      { rx: 0.84, ry: 0.28, s: 1.35, g: true },
      { rx: 0.22, ry: 0.56, s: 1.4, g: true },
      { rx: 0.76, ry: 0.64, s: 1.45, g: false },
      { rx: 0.46, ry: 0.82, s: 1.35, g: true },
    ];
    seedPoints.forEach((pt, i) => {
      spawnBloom(width * pt.rx, height * pt.ry, 12, 4, seedNow - 900 + i * 60, {
        radiusScale: pt.s,
        alpha: 0.32,
        grooveArc: pt.g,
        lifeMs: 16000,
      });
    });

    if (!active) {
      // Render a calm static watercolor wash when motion is paused
      ctx.clearRect(0, 0, width, height);
      for (let i = blooms.length - 1; i >= 0; i--) {
        drawBloom(blooms[i], seedNow);
      }
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    startLoop();

    // 2. Scroll effect: scrolling unfurls painted watercolor resonance clouds along the page
    const onScroll = () => {
      const currentY = window.scrollY;
      const dy = currentY - lastScrollY;
      lastScrollY = currentY;
      scrollAccum += Math.abs(dy);

      // Anchor existing pigment slightly to paper as user scrolls
      for (const b of blooms) {
        b.y -= dy * 0.45;
      }

      if (scrollAccum < 42) {
        startLoop();
        return;
      }
      scrollAccum = 0;
      scrollRibbonStep++;

      const now = performance.now();
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, currentY / maxScroll));

      const waveX =
        width * (0.5 + 0.38 * Math.sin(scrollRibbonStep * 0.75 + progress * Math.PI * 2));
      const waveY =
        dy >= 0
          ? height * (0.68 + (Math.random() - 0.5) * 0.22)
          : height * (0.32 + (Math.random() - 0.5) * 0.22);

      spawnBloom(waveX, waveY, (Math.random() - 0.5) * 20, -dy * 0.15, now, {
        radiusScale: 1.55,
        alpha: 0.34,
        grooveArc: scrollRibbonStep % 2 === 0,
      });
      startLoop();
    };

    // 3. Mouse / pointer painterly brush wake
    const onPointerMove = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('button, a, input, dialog')) {
        lastPointer = null;
        return;
      }
      const now = performance.now();
      if (!lastPointer) {
        lastPointer = { x: e.clientX, y: e.clientY, time: now };
        return;
      }
      const dx = e.clientX - lastPointer.x;
      const dy = e.clientY - lastPointer.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 18) return;

      lastPointer = { x: e.clientX, y: e.clientY, time: now };
      spawnBloom(e.clientX, e.clientY, dx, dy, now, {
        radiusScale: 1.1 + Math.min(dist / 80, 0.65),
        alpha: 0.3,
        grooveArc: Math.random() < 0.4,
      });
      startLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('button, a, input, dialog')) return;
      spawnBloom(e.clientX, e.clientY, 8, -4, performance.now(), {
        radiusScale: 1.45,
        alpha: 0.36,
        grooveArc: true,
      });
      startLoop();
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="songs-vinyl-watercolor-wash"
      className="pointer-events-none fixed inset-0 z-[2] block h-full w-full mix-blend-multiply"
    />
  );
}
