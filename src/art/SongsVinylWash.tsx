'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Full-page scroll + pointer-reactive autumn watercolor & vinyl-groove wash for `/songs`.
 * Distinct from Asterisk's sky wash, Gallery's wet-brush canvas, and About's drip canvas:
 * - Tracks `window.scrollY` to rotate & drift concentric autumn pigment bands as you browse the album.
 * - Tracks `pointermove` across the entire viewport with soft, lagging watercolor ripples.
 */
export default function SongsVinylWash() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const isPaused = !motionActive || Boolean(reducedMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const pointer = {
      x: 0.5,
      y: 0.35,
      tx: 0.5,
      ty: 0.35,
      active: false,
      energy: 0,
    };

    let scrollProgress = 0;
    let targetScroll = 0;

    const ripples: Array<{ x: number; y: number; r: number; alpha: number; hue: string }> = [];
    let lastRippleAt = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updateScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const onPointerMove = (e: PointerEvent) => {
      if (width <= 0 || height <= 0) return;
      pointer.tx = e.clientX / width;
      pointer.ty = e.clientY / height;
      pointer.active = true;
      pointer.energy = Math.min(1, pointer.energy + 0.28);

      const now = performance.now();
      if (!isPaused && now - lastRippleAt > 90) {
        lastRippleAt = now;
        const hues = [
          'rgba(254, 41, 158, 0.14)', // CHB Hot Pink
          'rgba(194, 92, 54, 0.14)',  // Burnt Sienna
          'rgba(217, 155, 67, 0.14)', // Autumn Ochre
        ];
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 18,
          alpha: 0.42,
          hue: hues[ripples.length % hues.length],
        });
        if (ripples.length > 14) ripples.shift();
      }
    };

    resize();
    updateScroll();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const drawFrame = (timeMs: number) => {
      const t = timeMs * 0.00035;
      scrollProgress += (targetScroll - scrollProgress) * 0.08;
      pointer.x += (pointer.tx - pointer.x) * 0.07;
      pointer.y += (pointer.ty - pointer.y) * 0.07;
      pointer.energy *= 0.96;

      ctx.clearRect(0, 0, width, height);

      // 1. Scroll-linked drifting autumn watercolor washes
      const cx = width * (0.22 + 0.56 * scrollProgress) + (pointer.x - 0.5) * 48;
      const cy = height * (0.24 + 0.48 * Math.sin(scrollProgress * Math.PI)) + (pointer.y - 0.5) * 36;

      const grad1 = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(width, height) * 0.62);
      grad1.addColorStop(0, 'rgba(254, 41, 158, 0.16)');
      grad1.addColorStop(0.42, 'rgba(194, 92, 54, 0.13)');
      grad1.addColorStop(0.75, 'rgba(217, 155, 67, 0.10)');
      grad1.addColorStop(1, 'rgba(232, 226, 213, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle concentric vinyl-groove arcs that turn with scroll
      const grooveX = width * 0.82 - scrollProgress * width * 0.25;
      const grooveY = height * 0.35 + scrollProgress * height * 0.3;
      const baseAngle = scrollProgress * Math.PI * 1.4 + t;
      ctx.save();
      ctx.translate(grooveX, grooveY);
      ctx.rotate(baseAngle);
      for (let i = 0; i < 4; i++) {
        const radius = 140 + i * 78 + Math.sin(t * 2 + i) * 10;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0.2 + i * 0.4, Math.PI * 1.35 + i * 0.4);
        ctx.strokeStyle =
          i % 2 === 0 ? 'rgba(194, 92, 54, 0.16)' : 'rgba(254, 41, 158, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();

      // 3. Soft pointer-reactive watercolor blooms
      if (pointer.active) {
        const px = pointer.x * width;
        const py = pointer.y * height;
        const pGrad = ctx.createRadialGradient(px, py, 8, px, py, 210 + pointer.energy * 80);
        pGrad.addColorStop(0, `rgba(254, 41, 158, ${0.14 + pointer.energy * 0.12})`);
        pGrad.addColorStop(0.55, 'rgba(217, 155, 67, 0.09)');
        pGrad.addColorStop(1, 'rgba(232, 226, 213, 0)');
        ctx.fillStyle = pGrad;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 1.9;
        rp.alpha *= 0.965;
        if (rp.alpha < 0.01) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = rp.hue;
        ctx.globalAlpha = rp.alpha;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (!isPaused) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    if (isPaused) {
      drawFrame(0);
    } else {
      rafId = requestAnimationFrame(drawFrame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [isPaused]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
    />
  );
}
