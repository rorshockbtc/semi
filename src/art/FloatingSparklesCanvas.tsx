'use client';

import React, { useEffect, useRef } from 'react';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  kind: 'bokeh' | 'star';
  hue: 'champagne' | 'amber' | 'pink';
  phase: number;
  freq: number;
  baseAlpha: number;
}

/**
 * Enchanting bokeh orbs and 4-point starlight sparkles echoing the sunlit sparkles
 * around Semi in her music videos. Reacts softly to pointer travel and audio playback,
 * and collapses smoothly to static warm starlight when motion is paused or reduced.
 */
export default function FloatingSparklesCanvas({
  count = 44,
  intensity = 1,
  isPlaying = false,
  className = '',
}: {
  count?: number;
  intensity?: number;
  isPlaying?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { motionActive } = useAmbientMotion();
  const stateRef = useRef({ motionActive, isPlaying, intensity });

  useEffect(() => {
    stateRef.current = { motionActive, isPlaying, intensity };
  }, [motionActive, isPlaying, intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const particles: SparkleParticle[] = [];

    const seedParticles = (width: number, height: number) => {
      particles.length = 0;
      const hues: SparkleParticle['hue'][] = ['champagne', 'champagne', 'amber', 'pink'];
      for (let i = 0; i < count; i++) {
        const isStar = i % 3 !== 0;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.24,
          vy: -(0.14 + Math.random() * 0.34),
          radius: isStar ? 4 + Math.random() * 6.5 : 10 + Math.random() * 24,
          kind: isStar ? 'star' : 'bokeh',
          hue: hues[i % hues.length],
          phase: Math.random() * Math.PI * 2,
          freq: 0.4 + Math.random() * 0.85,
          baseAlpha: isStar ? 0.45 + Math.random() * 0.4 : 0.14 + Math.random() * 0.2,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(canvas.clientWidth, 1);
      h = Math.max(canvas.clientHeight, 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) seedParticles(w, h);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      ) {
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
        pointer.active = true;
      } else {
        pointer.active = false;
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const rgbaForHue = (hue: SparkleParticle['hue'], alpha: number) => {
      if (hue === 'pink') return `rgba(254, 41, 158, ${alpha})`;
      if (hue === 'amber') return `rgba(246, 200, 138, ${alpha})`;
      return `rgba(255, 246, 219, ${alpha})`;
    };

    const drawStar = (x: number, y: number, r: number, alpha: number, hue: SparkleParticle['hue']) => {
      ctx.save();
      ctx.translate(x, y);

      const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.2);
      halo.addColorStop(0, rgbaForHue(hue, alpha * 0.72));
      halo.addColorStop(0.45, rgbaForHue(hue, alpha * 0.25));
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // 4-point star flare
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.1)})`;
      ctx.beginPath();
      const inner = r * 0.16;
      ctx.moveTo(0, -r);
      ctx.lineTo(inner, -inner);
      ctx.lineTo(r, 0);
      ctx.lineTo(inner, inner);
      ctx.lineTo(0, r);
      ctx.lineTo(-inner, inner);
      ctx.lineTo(-r, 0);
      ctx.lineTo(-inner, -inner);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawFrame = (nowMs: number) => {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        const { motionActive: active, isPlaying: playing, intensity: mult } = stateRef.current;
        const t = nowMs / 1000;
        const speedBoost = playing ? 1.45 : 1;
        const alphaBoost = (playing ? 1.25 : 1) * mult;

        for (const p of particles) {
          if (active) {
            p.x += p.vx * speedBoost;
            p.y += p.vy * speedBoost;

            if (pointer.active) {
              const dx = p.x - pointer.x;
              const dy = p.y - pointer.y;
              const dist = Math.hypot(dx, dy);
              if (dist > 4 && dist < 160) {
                const force = (1 - dist / 160) * 0.45;
                p.x += (dx / dist) * force;
                p.y += (dy / dist) * force;
              }
            }

            if (p.y < -40) {
              p.y = h + 30;
              p.x = Math.random() * w;
            }
            if (p.x < -40) p.x = w + 30;
            if (p.x > w + 40) p.x = -30;
          }

          const pulse = active
            ? 0.52 + 0.48 * Math.sin(t * p.freq * 2.1 + p.phase)
            : 0.72;
          const alpha = Math.min(0.95, p.baseAlpha * pulse * alphaBoost);

          if (p.kind === 'bokeh') {
            const g = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
            g.addColorStop(0, rgbaForHue(p.hue, alpha));
            g.addColorStop(0.65, rgbaForHue(p.hue, alpha * 0.45));
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            drawStar(p.x, p.y, p.radius * (0.8 + 0.35 * pulse), alpha, p.hue);
          }
        }
      }

      if (stateRef.current.motionActive) {
        raf = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame(performance.now());
    if (motionActive) {
      raf = requestAnimationFrame(drawFrame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [count, motionActive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
