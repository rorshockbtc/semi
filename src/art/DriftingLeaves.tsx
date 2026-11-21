'use client';

import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

type LeafKind = 'maple' | 'oak' | 'sycamore' | 'sweetgum';

interface LeafSpec {
  kind: LeafKind;
  top: string;
  size: number;
  mobileSize: number;
  dur: number;
  delay: number;
  driftY: number;
  fillA: string;
  fillB: string;
}

const CANOPY_LEAVES: LeafSpec[] = [
  {
    kind: 'maple',
    top: '14%',
    size: 46,
    mobileSize: 32,
    dur: 34,
    delay: -5,
    driftY: 115,
    fillA: '#DD9933',
    fillB: '#D46234',
  },
  {
    kind: 'oak',
    top: '26%',
    size: 40,
    mobileSize: 28,
    dur: 42,
    delay: -19,
    driftY: 95,
    fillA: '#C83E5B',
    fillB: '#9E472A',
  },
  {
    kind: 'sycamore',
    top: '9%',
    size: 36,
    mobileSize: 26,
    dur: 46,
    delay: -31,
    driftY: 130,
    fillA: '#FAF8F5',
    fillB: '#DD9933',
  },
  {
    kind: 'sweetgum',
    top: '34%',
    size: 38,
    mobileSize: 27,
    dur: 38,
    delay: -12,
    driftY: 105,
    fillA: '#D46234',
    fillB: '#FE299E',
  },
];

function LeafSilhouette({
  kind,
  fillA,
  fillB,
  gradId,
}: {
  kind: LeafKind;
  fillA: string;
  fillB: string;
  gradId: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className="wc-textured-motif block h-auto w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.22)]">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fillA} stopOpacity="0.92" />
          <stop offset="100%" stopColor={fillB} stopOpacity="0.82" />
        </linearGradient>
      </defs>
      {kind === 'maple' && (
        <path
          d="M32 5 L37 19 L50 14 L44 27 L58 31 L43 39 L47 50 L34 45 L32 59 L30 45 L17 50 L21 39 L6 31 L20 27 L14 14 L27 19 Z"
          fill={`url(#${gradId})`}
        />
      )}
      {kind === 'oak' && (
        <path
          d="M32 6 C38 6 40 13 36 17 C43 16 49 21 44 27 C50 28 52 35 45 38 C48 43 44 49 36 47 L33 59 L31 59 L28 47 C20 49 16 43 19 38 C12 35 14 28 20 27 C15 21 21 16 28 17 C24 13 26 6 32 6 Z"
          fill={`url(#${gradId})`}
        />
      )}
      {kind === 'sycamore' && (
        <path
          d="M32 7 L40 18 L54 17 L46 31 L55 41 L39 44 L33 58 L31 58 L25 44 L9 41 L18 31 L10 17 L24 18 Z"
          fill={`url(#${gradId})`}
        />
      )}
      {kind === 'sweetgum' && (
        <path
          d="M32 5 L38 22 L56 18 L43 32 L53 48 L35 42 L32 59 L29 42 L11 48 L21 32 L8 18 L26 22 Z"
          fill={`url(#${gradId})`}
        />
      )}
    </svg>
  );
}

/**
 * Watercolor Tennessee autumn leaves drifting softly across the Home hero canopy
 * (inspired by Asterisk's DriftingBirds, differentiated for West Nashville autumn).
 */
export default function DriftingLeaves({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const paused = Boolean(reduce) || !motionActive;

  if (paused) {
    return (
      <div
        aria-hidden="true"
        data-testid="hero-drifting-leaves"
        data-motion-state="paused"
        className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      >
        <div style={{ top: '18%', right: '14%' }} className="absolute w-8 sm:w-11 opacity-65 rotate-12">
          <LeafSilhouette kind="maple" fillA="#DD9933" fillB="#D46234" gradId="leaf-static-0" />
        </div>
        <div style={{ top: '30%', right: '26%' }} className="hidden sm:block absolute w-9 opacity-50 -rotate-12">
          <LeafSilhouette kind="oak" fillA="#C83E5B" fillB="#9E472A" gradId="leaf-static-1" />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      data-testid="hero-drifting-leaves"
      data-motion-state="active"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {CANOPY_LEAVES.map((leaf, i) => (
        <m.div
          key={leaf.kind}
          style={
            {
              top: leaf.top,
              '--leaf-w-sm': `${leaf.mobileSize}px`,
              '--leaf-w-lg': `${leaf.size}px`,
            } as React.CSSProperties
          }
          className="absolute left-0 w-[var(--leaf-w-sm)] sm:w-[var(--leaf-w-lg)]"
          initial={{ x: '-12vw', y: 0, scale: 0.92, opacity: 0 }}
          animate={{
            x: '112vw',
            y: leaf.driftY,
            scale: 0.62,
            opacity: [0, 0.78, 0.65, 0],
          }}
          transition={{
            x: { duration: leaf.dur, delay: leaf.delay, repeat: Infinity, ease: 'linear' },
            y: { duration: leaf.dur, delay: leaf.delay, repeat: Infinity, ease: 'linear' },
            scale: { duration: leaf.dur, delay: leaf.delay, repeat: Infinity, ease: 'linear' },
            opacity: {
              duration: leaf.dur,
              delay: leaf.delay,
              repeat: Infinity,
              times: [0, 0.1, 0.84, 1],
              ease: 'linear',
            },
          }}
        >
          <m.div
            animate={{ y: [-8, 8], rotate: [-14, 16] }}
            transition={{
              duration: 4.2 + i * 0.55,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          >
            <LeafSilhouette
              kind={leaf.kind}
              fillA={leaf.fillA}
              fillB={leaf.fillB}
              gradId={`leaf-live-${i}`}
            />
          </m.div>
        </m.div>
      ))}
    </div>
  );
}
