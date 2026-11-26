'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

interface StarNode {
  x: number;
  y: number;
  z: number; // parallax depth
  speed: number;
  band: number; // 0 = Tip (fast, cool slate-blue), 1 = Slow Country (slow, warm sienna)
  phase: number;
}

interface EquationGlyph {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  phase: number;
  size: number;
}

interface TimePocketRipple {
  x: number;
  y: number;
  bornAt: number;
  maxRadius: number;
}

const PHYSICS_EQUATIONS = [
  'dτ = dt √(1 − rₛ / r)',
  'γ = 1 / √(1 − v²/c²)',
  '1 + z = (1 − rₛ / r)⁻¹/²',
  'v = 0.99c  ·  γ ≈ 7.09',
  'rₛ = 2GM / c²',
  'ds² = −(1 − rₛ/r)c²dt² + …',
  'Δt_tip / Δt_slow ≫ 1',
  'L = 2,000 km · Resonance',
];

/**
 * Galactic & relativistic physics canvas for Semi's second album, `Persist`.
 * - Warping spacetime coordinate grid that bends toward the cursor's gravity well.
 * - Scroll-parallax galactic starfield & Doppler-shifted starlight streaks.
 * - Floating relativistic physics equations (Schwarzschild metric, Lorentz factor, redshift)
 *   that brighten when the cursor or scroll passes near them.
 * - Gravitational lensing accretion arcs & Midship time-pocket ripples.
 */
export default function RelativisticHorizonCanvas({
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

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let lastTime = performance.now();
    let lastRippleAt = 0;
    let scrollY = window.scrollY;
    const pointer = { x: -9999, y: -9999, active: false };

    const stars: StarNode[] = [];
    const glyphs: EquationGlyph[] = [];
    const ripples: TimePocketRipple[] = [];

    const seedScene = () => {
      stars.length = 0;
      const starCount = width < 640 ? 60 : 120;
      for (let i = 0; i < starCount; i++) {
        const band = Math.random();
        stars.push({
          x: Math.random() * width,
          y: band * height,
          z: 0.35 + Math.random() * 0.9,
          speed: 0.1 + Math.pow(1 - band, 1.35) * 0.55,
          band,
          phase: Math.random() * Math.PI * 2,
        });
      }

      glyphs.length = 0;
      const glyphCount = width < 640 ? 5 : PHYSICS_EQUATIONS.length;
      for (let i = 0; i < glyphCount; i++) {
        glyphs.push({
          x: (0.08 + ((i * 0.19) % 0.84)) * width,
          y: (0.1 + ((i * 0.17) % 0.8)) * height,
          vx: (i % 2 === 0 ? 1 : -1) * (0.05 + Math.random() * 0.08),
          vy: -0.02 + Math.random() * 0.04,
          text: PHYSICS_EQUATIONS[i % PHYSICS_EQUATIONS.length],
          phase: i * 0.9,
          size: width < 640 ? 12 : 13,
        });
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(320, Math.floor(rect.width));
      height = Math.max(480, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedScene();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && y >= 0 && x <= width && y <= height) {
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
        if (active) {
          const now = performance.now();
          if (now - lastRippleAt > 170) {
            lastRippleAt = now;
            ripples.push({ x, y, bornAt: now, maxRadius: 110 + Math.random() * 65 });
            if (ripples.length > 8) ripples.shift();
          }
        }
      } else {
        pointer.active = false;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const drawFrame = (now: number) => {
      const dt = Math.min(48, now - lastTime);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      // 1. Deep galactic-to-accretion gradient wash
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, 'rgba(30, 58, 95, 0.08)');
      bgGrad.addColorStop(0.5, 'rgba(17, 24, 39, 0.01)');
      bgGrad.addColorStop(1, 'rgba(163, 82, 40, 0.11)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Warping Spacetime Coordinate Grid (bends toward cursor gravity well + scrolls)
      const gridSpacing = width < 640 ? 64 : 84;
      const scrollShift = (scrollY * 0.22) % gridSpacing;
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = 'rgba(52, 78, 122, 0.09)';

      // Horizontal warped spacetime lines
      for (let gy = -scrollShift; gy <= height + gridSpacing; gy += gridSpacing) {
        ctx.beginPath();
        for (let gx = 0; gx <= width; gx += 28) {
          let wy = gy;
          if (pointer.active) {
            const dx = gx - pointer.x;
            const dy = gy - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 220) {
              const pull = Math.pow(1 - dist / 220, 2) * 22;
              wy += (dy / (dist + 18)) * pull;
            }
          }
          if (gx === 0) ctx.moveTo(gx, wy);
          else ctx.lineTo(gx, wy);
        }
        ctx.stroke();
      }

      // Vertical warped spacetime lines
      for (let gx = 0; gx <= width; gx += gridSpacing) {
        ctx.beginPath();
        for (let gy = 0; gy <= height; gy += 28) {
          let wx = gx;
          if (pointer.active) {
            const dx = gx - pointer.x;
            const dy = gy - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 220) {
              const pull = Math.pow(1 - dist / 220, 2) * 22;
              wx += (dx / (dist + 18)) * pull;
            }
          }
          if (gy === 0) ctx.moveTo(wx, gy);
          else ctx.lineTo(wx, gy);
        }
        ctx.stroke();
      }

      // 3. Gravitational-lensing accretion horizon rings (scroll-reactive)
      const horizonY = height * 1.12 - (scrollY * 0.05) % 80;
      const baseArcR = Math.max(width * 0.88, height * 0.7);
      const t = now * 0.00024;
      for (let i = 0; i < 6; i++) {
        const r = baseArcR + i * 68 + Math.sin(t + i * 0.8) * 10;
        ctx.beginPath();
        ctx.arc(width * 0.5, horizonY, r, Math.PI * 1.1, Math.PI * 1.9);
        ctx.strokeStyle =
          i === 0
            ? 'rgba(180, 83, 9, 0.24)'
            : i <= 2
              ? 'rgba(163, 40, 92, 0.14)'
              : 'rgba(52, 78, 122, 0.1)';
        ctx.lineWidth = i === 0 ? 1.8 : 1;
        ctx.stroke();
      }

      // 4. Galactic starfield & Doppler streaks (parallax with scroll + time-gradient velocity)
      for (const s of stars) {
        if (active) {
          s.x += s.speed * s.z * (dt / 16) * 0.75;
          if (s.x > width + 24) s.x = -24;
        }
        const sy = ((s.y - scrollY * 0.12 * s.z) % height + height) % height;
        const alpha = 0.22 + 0.28 * (0.5 + 0.5 * Math.sin(now * 0.0015 + s.phase));
        const rCol = Math.round(45 + s.band * (172 - 45));
        const gCol = Math.round(74 + s.band * (84 - 74));
        const bCol = Math.round(132 + s.band * (36 - 132));

        if (s.band < 0.5) {
          const streak = 3 + (1 - s.band) * 14 * s.z;
          ctx.beginPath();
          ctx.moveTo(s.x - streak, sy);
          ctx.lineTo(s.x, sy);
          ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.1 * s.z;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, sy, 1.2 * s.z, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // 5. Floating Relativistic Physics Equations (brighten near cursor)
      ctx.textBaseline = 'middle';
      for (const g of glyphs) {
        if (active) {
          g.x += g.vx * (dt / 16);
          g.y += g.vy * (dt / 16);
          if (g.x < -160) g.x = width + 40;
          if (g.x > width + 160) g.x = -120;
          if (g.y < 30) g.y = height - 30;
          if (g.y > height - 30) g.y = 30;
        }
        const gy = ((g.y - scrollY * 0.08) % height + height) % height;
        let boost = 0;
        if (pointer.active) {
          const d = Math.hypot(g.x + 60 - pointer.x, gy - pointer.y);
          if (d < 240) boost = (1 - d / 240) * 0.34;
        }
        const baseAlpha = 0.14 + 0.06 * Math.sin(now * 0.001 + g.phase) + boost;
        ctx.font = `500 ${g.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillStyle = boost > 0.1 ? `rgba(163, 40, 92, ${baseAlpha.toFixed(3)})` : `rgba(52, 78, 122, ${baseAlpha.toFixed(3)})`;
        ctx.fillText(g.text, g.x, gy);
      }

      // 6. Interactive Midship gravitational lensing ripples on pointer move
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const age = now - rp.bornAt;
        const life = 2200;
        if (age >= life) {
          ripples.splice(i, 1);
          continue;
        }
        const progress = age / life;
        const radius = 14 + (1 - Math.pow(1 - progress, 3)) * rp.maxRadius;
        const alpha = (1 - progress) * 0.28;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 83, 9, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      if (active) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame(performance.now());

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [active, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
