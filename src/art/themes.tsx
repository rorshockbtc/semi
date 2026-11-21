'use client';

import React, { useEffect, useRef, useState } from 'react';
import { m, useInView, useScroll, useTransform } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Per-page motion themes. Each surface gets its own physical metaphor instead of
 * one repeated particle effect:
 *  - Home:          FilmGrain + LightLeaks (anamorphic warm leaks over the hero reel)
 *  - Songs:         VinylDisc (record slides from sleeve and spins while playing)
 *  - Old Oak Tree:  LeafDapple (sunlight through moving oak leaves)
 *  - Warm Unknown:  LanternGlow (slow breathing lamplight)
 *  - Marks/Ink:     Typewriter (lyrics typed with a blinking caret)
 *  - About:         MemoryThread (a single thread drawn as you scroll)
 * Loops pause via <html data-motion="paused"> and honor prefers-reduced-motion.
 */

export function FilmGrain({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="film-grain-overlay" />
    </div>
  );
}

export function LightLeaks({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen ${className}`}>
      <div
        className="leak-a absolute -left-[20%] top-[8%] h-[70%] w-[75%] rounded-[50%] blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(221,153,51,0.52), rgba(212,98,52,0.30) 46%, rgba(254,41,158,0.20) 64%, transparent 78%)',
        }}
      />
      <div
        className="leak-b absolute right-[-15%] bottom-[-10%] h-[60%] w-[60%] rounded-[50%] blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(250,248,245,0.40), rgba(200,62,91,0.24) 56%, transparent 78%)',
        }}
      />
    </div>
  );
}

export function VinylDisc({
  label,
  spinning,
  className = '',
}: {
  label: string;
  spinning: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`vinyl-spin aspect-square rounded-full shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)] ${className}`}
      data-spinning={spinning ? 'true' : 'false'}
      style={{
        background:
          'repeating-radial-gradient(circle at 50% 50%, #141414 0px, #141414 2px, #1d1d1d 3px, #141414 4px), conic-gradient(from 30deg, rgba(255,255,255,0.08), transparent 20%, rgba(255,255,255,0.06) 50%, transparent 70%, rgba(255,255,255,0.08))',
        backgroundBlendMode: 'screen',
      }}
    >
      <div
        className="absolute inset-[31%] rounded-full bg-cover bg-center ring-2 ring-black/40"
        style={{ backgroundImage: `url(${label})` }}
      />
      <div className="absolute inset-[48.5%] rounded-full bg-[#E8E2D5]" />
    </div>
  );
}

export function LeafDapple({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 55% at 78% 18%, rgba(255,214,150,0.55), transparent 70%)',
        }}
      />
      <div
        className="dapple-sway absolute -inset-[10%] mix-blend-multiply opacity-[0.22]"
        style={{
          background: [
            'radial-gradient(12% 9% at 18% 22%, transparent 60%, #3b3a1e 100%)',
            'radial-gradient(9% 12% at 42% 38%, transparent 55%, #3b3a1e 100%)',
            'radial-gradient(14% 8% at 70% 30%, transparent 58%, #3b3a1e 100%)',
            'radial-gradient(10% 10% at 85% 62%, transparent 55%, #3b3a1e 100%)',
            'radial-gradient(13% 9% at 30% 72%, transparent 60%, #3b3a1e 100%)',
            'radial-gradient(8% 11% at 58% 80%, transparent 55%, #3b3a1e 100%)',
          ].join(','),
          filter: 'blur(14px)',
        }}
      />
    </div>
  );
}

export function LanternGlow({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="lantern-breathe absolute left-1/2 top-[38%] h-[90%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,190,110,0.5), rgba(255,140,80,0.18) 55%, transparent 80%)',
        }}
      />
    </div>
  );
}

export function BlockPulse({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="block-pulse absolute right-[8%] top-[12%] h-[82%] w-[64%] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(245,158,11,0.34), rgba(254,41,158,0.14) 54%, transparent 82%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.8), transparent)',
        }}
      />
    </div>
  );
}

export function GlassThresholdGlow({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="lantern-breathe absolute -left-[12%] top-[6%] h-[78%] w-[68%] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(114,156,214,0.28), rgba(71,98,138,0.12) 56%, transparent 82%)',
        }}
      />
      <div
        className="block-pulse absolute right-[-6%] bottom-[-8%] h-[68%] w-[56%] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(245,182,105,0.22), rgba(254,41,158,0.09) 55%, transparent 82%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-35"
        style={{
          background: 'linear-gradient(90deg, rgba(114,156,214,0.6), rgba(245,182,105,0.75), transparent)',
        }}
      />
    </div>
  );
}

/** Types text in once on view with a caret; renders complete text when motion is off. */
export function Typewriter({
  text,
  className = '',
  speedMs = 34,
}: {
  text: string;
  className?: string;
  speedMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const { motionActive } = useAmbientMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || !motionActive) return;
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speedMs);
    return () => window.clearInterval(id);
  }, [inView, motionActive, text, speedMs]);

  const shown = motionActive ? text.slice(0, count) : text;

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      <span
        aria-hidden="true"
        className="caret-blink ml-0.5 inline-block h-[0.9em] w-[0.08em] translate-y-[0.1em] bg-[var(--a-accent)]"
      />
    </span>
  );
}

/** A single watercolor brush thread drawn down the page as the reader scrolls (About page). */
export function MemoryThread({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const { motionActive } = useAmbientMotion();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start 70%', 'end 60%'] });
  const pathLength = useTransform(scrollYProgress, [0, 1], motionActive ? [0, 1] : [1, 1]);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-2 sm:left-8 lg:left-12 top-0 h-full w-7 sm:w-10"
      viewBox="0 0 40 1000"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="memory-thread-autumn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FE299E" />
          <stop offset="38%" stopColor="#C83E5B" />
          <stop offset="72%" stopColor="#D46234" />
          <stop offset="100%" stopColor="#DD9933" />
        </linearGradient>
      </defs>
      <path
        d="M20 0 C 4 160, 36 320, 20 500 S 4 840, 20 1000"
        stroke="rgba(158,71,42,0.16)"
        strokeWidth="1.75"
        fill="none"
      />
      <m.path
        d="M20 0 C 4 160, 36 320, 20 500 S 4 840, 20 1000"
        stroke="url(#memory-thread-autumn)"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
        filter="url(#wc-edge)"
        style={{ pathLength }}
      />
    </svg>
  );
}
