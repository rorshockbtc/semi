'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

interface DriftParticle {
  x: number;
  y: number;
  baseSpeed: number;
  length: number;
  radius: number;
  phase: number;
  band: number; // 0 = Tip (fast, cool slate-blue), 1 = Slow Country (slow, warm redshift sienna)
}

interface TimePocketRipple {
  x: number;
  y: number;
  bornAt: number;
  maxRadius: number;
}

/**
 * Bespoke relativistic physics ambient canvas for Semi's second album, `Persist`.
 * Visualizes Resonance's 2,000-km proper-time gradient outside the black hole:
 * - Upper hull ("The Tip"): faster, crisp cool-slate / blueshifted starlight streaks.
 * - Middle hull ("The Midship"): standing-wave resonance harmonics + interactive time-pocket ripples.
 * - Lower hull ("Slow Country"): heavy, dilated, warm redshift amber accretion arcs.
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
      const count = width < 640 ? 44 : 84;
      for (let i = 0; i < count; i++) {
        const band = Math.random(); // 0 = top (Tip), 1 = bottom (Slow Country)
        particles.push({
          x: Math.random() * width,
          y: band * height,
          // Proper-time dilation: Tip particles move up to 5x faster than Slow Country
          baseSpeed: 0.08 + Math.pow(1 - band, 1.4) * 0.48,
          length: 2 + (1 - band) * 14, // Fast Tip streaks vs. heavy Slow Country points
          radius: 0.9 + band * 1.5,
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
      if (now - lastRippleAt < 160) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > width || y > height) return;
      lastRippleAt = now;
      ripples.push({
        x,
        y,
        bornAt: now,
        maxRadius: 120 + Math.random() * 60,
      });
      if (ripples.length > 9) ripples.shift();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const drawFrame = (now: number) => {
      const dt = Math.min(48, now - lastTime);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Tip-to-Slow-Country relativistic gradient wash on sandstone
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, 'rgba(52, 78, 122, 0.06)');
      bgGrad.addColorStop(0.5, 'rgba(17, 24, 39, 0)');
      bgGrad.addColorStop(1, 'rgba(163, 82, 40, 0.09)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Curved gravitational-lensing accretion horizon arcs
      const horizonY = height * 1.15;
      const baseArcR = Math.max(width * 0.9, height * 0.72);
      const t = now * 0.00022;

      for (let i = 0; i < 5; i++) {
        const r = baseArcR + i * 74 + Math.sin(t + i * 0.85) * 9;
        ctx.beginPath();
        ctx.arc(width * 0.5, horizonY, r, Math.PI * 1.12, Math.PI * 1.88);
        ctx.strokeStyle =
          i === 0
            ? 'rgba(180, 83, 9, 0.22)'
            : i <= 2
              ? 'rgba(163, 40, 92, 0.12)'
              : 'rgba(52, 78, 122, 0.09)';
        ctx.lineWidth = i === 0 ? 1.75 : 1;
        ctx.stroke();
      }

      // 3. Standing-wave "Resonance" harmonic lines across the Midship
      const waveY = height * 0.54;
      for (let w = 0; w < 2; w++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 18) {
          const norm = x / width;
          const envelope = Math.sin(norm * Math.PI);
          const yOffset =
            Math.sin(norm * (6 + w * 3) + now * (0.0007 + w * 0.0003)) * 16 * envelope;
          if (x === 0) ctx.moveTo(x, waveY + yOffset);
          else ctx.lineTo(x, waveY + yOffset);
        }
        ctx.strokeStyle = w === 0 ? 'rgba(163, 40, 92, 0.11)' : 'rgba(52, 78, 122, 0.09)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // 4. Relativistic proper-time drift particles & Doppler streaks
      for (const p of particles) {
        if (active) {
          p.x += p.baseSpeed * (dt / 16) * 0.75;
          p.y += Math.sin(now * 0.0006 + p.phase) * 0.06 * (1 - p.band * 0.7);
          if (p.x > width + 20) p.x = -20;
        }
        const alpha = 0.2 + 0.24 * (0.5 + 0.5 * Math.sin(now * 0.0014 + p.phase));
        const rCol = Math.round(52 + p.band * (163 - 52));
        const gCol = Math.round(78 + p.band * (82 - 78));
        const bCol = Math.round(122 + p.band * (40 - 122));

        if (p.band < 0.45) {
          // Fast Tip starlight streak
          ctx.beginPath();
          ctx.moveTo(p.x - p.length, p.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = p.radius;
          ctx.stroke();
        } else {
          // Slow Country heavy point
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // 5. Interactive Midship time-pocket lensing ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const age = now - rp.bornAt;
        const life = 2400;
        if (age >= life) {
          ripples.splice(i, 1);
          continue;
        }
        const progress = age / life;
        const eased = 1 - Math.pow(1 - progress, 3);
        const radius = 12 + eased * rp.maxRadius;
        const alpha = (1 - progress) * 0.26;

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 92, 42, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.3;
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
