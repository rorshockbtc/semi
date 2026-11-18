'use client';

import React, { useEffect, useRef } from 'react';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  hue: 'pink' | 'gold' | 'sky';
}

/**
 * Interactive closing horizon canvas: moving or tapping across the gradient
 * blooms gentle golden-hour & Sovereign Pink light ripples.
 */
export default function SunbeamRippleCanvas({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { motionActive } = useAmbientMotion();
  const motionRef = useRef(motionActive);

  useEffect(() => {
    motionRef.current = motionActive;
  }, [motionActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ripples: Ripple[] = [];
    let raf = 0;
    let lastSpawn = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const spawn = (x: number, y: number, maxRadius = 190) => {
      if (!motionRef.current) return;
      const hues: Ripple['hue'][] = ['pink', 'gold', 'sky'];
      ripples.push({
        x,
        y,
        radius: 12,
        maxRadius,
        alpha: 0.48,
        hue: hues[Math.floor(Math.random() * hues.length)],
      });
      if (ripples.length > 18) ripples.shift();
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn < 180) return;
      lastSpawn = now;
      const r = container.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top, 160);
    };

    const onPointerDown = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top, 260);
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown, { passive: true });

    const tick = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (!motionRef.current) {
        ripples.length = 0;
        return;
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += (rp.maxRadius - rp.radius) * 0.032 + 0.85;
        rp.alpha *= 0.972;

        const color =
          rp.hue === 'pink'
            ? `rgba(254, 41, 158, ${rp.alpha})`
            : rp.hue === 'gold'
              ? `rgba(244, 215, 180, ${rp.alpha})`
              : `rgba(169, 211, 234, ${rp.alpha})`;

        const grad = ctx.createRadialGradient(rp.x, rp.y, rp.radius * 0.25, rp.x, rp.y, rp.radius);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.75, color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.fill();

        if (rp.alpha < 0.02 || rp.radius >= rp.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    if (motionActive) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, container.clientWidth, container.clientHeight);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
    };
  }, [containerRef, motionActive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
