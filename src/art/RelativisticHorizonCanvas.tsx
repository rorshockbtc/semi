'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

interface DriftParticle {
  x: number;
  y: number;
  baseSpeed: number;
  radius: number;
  phase: number;
  band: number; // 0 = Tip (fast, cool blue-silver), 1 = Slow Country (slow, warm amber)
}

interface TimePocketRipple {
  x: number;
  y: number;
  bornAt: number;
  maxRadius: number;
}

/**
 * Bespoke relativistic physics ambient canvas for Semi's second album, `Persist`.
 * Visualizes the 2,000-km proper-time gradient aboard Resonance:
 * - Upper hull ("The Tip"): faster, crisp cool-indigo / silver telemetry drift.
 * - Middle hull ("The Midship"): subtle interactive time-pocket lensing ripples on pointer move.
 * - Lower hull ("Slow Country"): heavy, dilated, warm amber accretion glow & slow drift.
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

    const particles: DriftParticle[] = [];
    const ripples: TimePocketRipple[] = [];

    const seedParticles = () => {
      particles.length = 0;
      const count = width < 640 ? 34 : 62;
      for (let i = 0; i < count; i++) {
        const band = Math.random(); // 0 = top (Tip), 1 = bottom (Slow Country)
        particles.push({
          x: Math.random() * width,
          y: band * height,
          // Proper-time dilation: Tip particles move up to 4.5x faster than Slow Country
          baseSpeed: 0.08 + (1 - band) * 0.34,
          radius: 1.0 + band * 1.6,
          phase: Math.random() * Math.PI * 2,
          band,
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
      seedParticles();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;
      const now = performance.now();
      if (now - lastRippleAt < 180) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > width || y > height) return;
      lastRippleAt = now;
      ripples.push({
        x,
        y,
        bornAt: now,
        maxRadius: 110 + Math.random() * 55,
      });
      if (ripples.length > 8) ripples.shift();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const drawFrame = (now: number) => {
      const dt = Math.min(48, now - lastTime);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle deep-space to accretion-amber relativistic gradient wash
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, 'rgba(52, 78, 122, 0.05)'); // Tip · cool slate
      bgGrad.addColorStop(0.52, 'rgba(17, 24, 39, 0)'); // Midship · neutral
      bgGrad.addColorStop(1, 'rgba(163, 82, 40, 0.07)'); // Slow Country · warm sienna
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Curved gravitational horizon arcs (Resonance viewport geometry)
      const horizonY = height * 1.18;
      const baseArcR = Math.max(width * 0.92, height * 0.72);
      const t = now * 0.00018;

      for (let i = 0; i < 4; i++) {
        const r = baseArcR + i * 84 + Math.sin(t + i * 0.9) * 8;
        ctx.beginPath();
        ctx.arc(width * 0.5, horizonY, r, Math.PI * 1.12, Math.PI * 1.88);
        ctx.strokeStyle =
          i === 0
            ? 'rgba(217, 119, 6, 0.16)'
            : i === 1
              ? 'rgba(180, 83, 9, 0.11)'
              : 'rgba(59, 130, 246, 0.07)';
        ctx.lineWidth = i === 0 ? 1.5 : 1;
        ctx.stroke();
      }

      // 3. Relativistic proper-time drift particles
      for (const p of particles) {
        if (active) {
          p.x += p.baseSpeed * (dt / 16) * 0.65;
          p.y += Math.sin(now * 0.0006 + p.phase) * 0.06 * (1 - p.band * 0.7);
          if (p.x > width + 12) p.x = -12;
        }
        const alpha = 0.22 + 0.22 * (0.5 + 0.5 * Math.sin(now * 0.0012 + p.phase));
        // Interpolate from Tip slate-blue to Slow Country burnt sienna (tuned for sandstone paper)
        const rCol = Math.round(52 + p.band * (163 - 52));
        const gCol = Math.round(78 + p.band * (82 - 78));
        const bCol = Math.round(122 + p.band * (40 - 122));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // 4. Interactive Midship time-pocket lensing ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const age = now - rp.bornAt;
        const life = 2200;
        if (age >= life) {
          ripples.splice(i, 1);
          continue;
        }
        const progress = age / life;
        const eased = 1 - Math.pow(1 - progress, 3);
        const radius = 14 + eased * rp.maxRadius;
        const alpha = (1 - progress) * 0.22;

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 130, 62, ${alpha.toFixed(3)})`;
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
