'use client';

import React, { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

interface RealEquation {
  title: string;
  formula: string;
  variables: string;
  meaning: string;
}

const REAL_EQUATIONS: RealEquation[] = [
  {
    title: 'Gravitational Time Dilation',
    formula: 'dτ = dt √(1 − rₛ / r)',
    variables: 'rₛ = 2GM / c²',
    meaning:
      'Proper time dτ slows relative to a distant clock dt as radial distance r approaches the Schwarzschild radius rₛ.',
  },
  {
    title: 'Gravitational Redshift',
    formula: '1 + z = (1 − rₛ / r)⁻¹/²',
    variables: 'λ_obs = λ_emit (1 + z)',
    meaning:
      'Light climbing out of Slow Country loses energy; emitted blue-white wavelengths stretch toward amber-red.',
  },
  {
    title: 'Lorentz Factor',
    formula: 'γ = 1 / √(1 − v² / c²)',
    variables: 'v = 0.99c  ⇒  γ ≈ 7.089',
    meaning:
      'At 99% of light speed, a traveler experiences 1 year for every 7.089 years measured by a stationary observer.',
  },
  {
    title: 'Schwarzschild Line Element',
    formula: 'ds² = −(1 − rₛ/r)c²dt² + (1 − rₛ/r)⁻¹dr² + r²dΩ²',
    variables: 'c = 299,792,458 m/s',
    meaning:
      'The exact vacuum solution to Einstein’s field equations governing spacetime curvature outside a spherical mass.',
  },
];

/**
 * Scroll-driven physics band for the Persist world page.
 * Combines real General & Special Relativity equations with scroll-scrubbed
 * SVG diagrams (Schwarzschild dilation curve, tilting light cones, and
 * Hydrogen Balmer redshift lines).
 */
export default function PersistPhysicsScrollBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const animate = !reduce && motionActive;

  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'end start'],
  });

  // Scroll-scrubbed curve marker (x: 42 -> 244, y: 124 -> 32)
  const markerX = useTransform(scrollYProgress, [0.15, 0.85], [44, 242]);
  const markerY = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.6, 0.85],
    [122, 78, 48, 32],
  );

  // Light-cone tilt angle as you move closer to r_s (degrees)
  const coneTilt = useTransform(scrollYProgress, [0.15, 0.85], [4, -26]);

  // Balmer spectral shift (px rightward shift as z increases)
  const redshiftPx = useTransform(scrollYProgress, [0.15, 0.85], [0, 48]);

  return (
    <div ref={bandRef} className="space-y-10 border-t border-[var(--a-rule)] pt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
            Relativistic Field Notes · Scroll to Scrub Spacetime
          </p>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
            The real physics behind <span className="italic font-normal">Resonance</span>
          </h3>
        </div>
        <p className="font-code text-[13px] text-[var(--a-muted)]">
          Einstein · Schwarzschild · Lorentz
        </p>
      </div>

      {/* Scroll-scrubbed SVG Physics Diagrams */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 1. Schwarzschild Time-Dilation Curve */}
        <div className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-code text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--a-accent-text)]">
              01 · Dilation Curve
            </span>
            <span className="font-code text-[13px] text-[var(--a-muted)]">dτ/dt vs r/rₛ</span>
          </div>

          <svg
            viewBox="0 0 280 150"
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Schwarzschild gravitational time dilation curve showing proper time approaching zero at the event horizon"
          >
            {/* Axes */}
            <line x1="36" y1="18" x2="36" y2="128" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" />
            <line x1="36" y1="128" x2="262" y2="128" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" />
            {/* Asymptote dτ/dt = 1 */}
            <line
              x1="36"
              y1="26"
              x2="262"
              y2="26"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeDasharray="4 4"
            />
            <text x="8" y="30" fill="currentColor" fillOpacity="0.6" fontSize="13" fontFamily="monospace">
              1.0
            </text>
            <text x="16" y="132" fill="currentColor" fillOpacity="0.6" fontSize="13" fontFamily="monospace">
              rₛ
            </text>
            <text x="220" y="145" fill="currentColor" fillOpacity="0.6" fontSize="13" fontFamily="monospace">
              r / rₛ
            </text>

            {/* Exact curve approximation of sqrt(1 - r_s/r) */}
            <path
              d="M 40 126 Q 58 76, 102 52 T 248 30"
              fill="none"
              stroke="#A3285C"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Scroll-scrubbed observer point */}
            {animate ? (
              <m.circle
                cx={markerX}
                cy={markerY}
                r="5.5"
                fill="#FE299E"
                stroke="#FAF8F5"
                strokeWidth="2"
              />
            ) : (
              <circle cx="132" cy="46" r="5.5" fill="#FE299E" stroke="#FAF8F5" strokeWidth="2" />
            )}
          </svg>

          <p className="text-[14px] leading-relaxed text-[var(--a-muted)]">
            Near <span className="font-code text-[var(--a-ink)]">r → rₛ</span>, proper time{' '}
            <span className="font-code text-[var(--a-ink)]">dτ/dt → 0</span> (Slow Country). Out at The Tip, the curve flattens toward{' '}
            <span className="font-code text-[var(--a-ink)]">1.0</span>.
          </p>
        </div>

        {/* 2. Tilting Light Cones near the Horizon */}
        <div className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-code text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--a-accent-text)]">
              02 · Light Cones
            </span>
            <span className="font-code text-[13px] text-[var(--a-muted)]">ds² = 0</span>
          </div>

          <svg
            viewBox="0 0 280 150"
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Spacetime light cones tilting inward toward the black hole event horizon"
          >
            {/* Event horizon vertical wall */}
            <rect x="28" y="14" width="22" height="118" fill="#111827" fillOpacity="0.1" />
            <line x1="50" y1="14" x2="50" y2="132" stroke="#B45309" strokeWidth="2" strokeDasharray="4 3" />
            <text x="12" y="146" fill="#B45309" fontSize="13" fontFamily="monospace">
              r = rₛ
            </text>

            {/* Reference upright cone far out (The Tip) */}
            <g transform="translate(226, 86)">
              <polygon points="0,0 -20,-42 20,-42" fill="#344E7A" fillOpacity="0.14" stroke="#344E7A" strokeWidth="1.4" />
              <ellipse cx="0" cy="-42" rx="20" ry="5" fill="none" stroke="#344E7A" strokeWidth="1.2" />
              <line x1="0" y1="0" x2="0" y2="-48" stroke="#344E7A" strokeWidth="1.2" strokeDasharray="2 2" />
            </g>

            {/* Scroll-tilting mid-hull cone */}
            {animate ? (
              <m.g style={{ rotate: coneTilt, originX: '132px', originY: '92px' }} transform="translate(132, 92)">
                <polygon points="0,0 -22,-46 22,-46" fill="#A3285C" fillOpacity="0.18" stroke="#A3285C" strokeWidth="1.6" />
                <ellipse cx="0" cy="-46" rx="22" ry="5.5" fill="none" stroke="#A3285C" strokeWidth="1.3" />
                <line x1="0" y1="0" x2="0" y2="-52" stroke="#FE299E" strokeWidth="1.5" />
              </m.g>
            ) : (
              <g transform="translate(132, 92) rotate(-14)">
                <polygon points="0,0 -22,-46 22,-46" fill="#A3285C" fillOpacity="0.18" stroke="#A3285C" strokeWidth="1.6" />
                <ellipse cx="0" cy="-46" rx="22" ry="5.5" fill="none" stroke="#A3285C" strokeWidth="1.3" />
              </g>
            )}

            <text x="205" y="146" fill="currentColor" fillOpacity="0.6" fontSize="13" fontFamily="monospace">
              Tip
            </text>
          </svg>

          <p className="text-[14px] leading-relaxed text-[var(--a-muted)]">
            Gravity tips future light cones inward. Closer to{' '}
            <span className="font-code text-[var(--a-ink)]">rₛ</span>, every possible future path bends steeper toward the mass.
          </p>
        </div>

        {/* 3. Hydrogen Balmer Redshift Spectrum */}
        <div className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-code text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--a-accent-text)]">
              03 · Balmer Redshift
            </span>
            <span className="font-code text-[13px] text-[var(--a-muted)]">Hγ · Hβ · Hα</span>
          </div>

          <svg
            viewBox="0 0 280 150"
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Hydrogen Balmer emission lines shifting toward longer red wavelengths under gravitational redshift"
          >
            <defs>
              <linearGradient id="persist-spectrum" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B4CC0" stopOpacity="0.22" />
                <stop offset="45%" stopColor="#2A9D8F" stopOpacity="0.22" />
                <stop offset="75%" stopColor="#D97706" stopOpacity="0.26" />
                <stop offset="100%" stopColor="#991B1B" stopOpacity="0.32" />
              </linearGradient>
            </defs>

            {/* Rest-frame spectrum strip */}
            <rect x="16" y="24" width="248" height="28" rx="4" fill="url(#persist-spectrum)" stroke="currentColor" strokeOpacity="0.2" />
            <text x="16" y="18" fill="currentColor" fillOpacity="0.65" fontSize="13" fontFamily="monospace">
              Emitted (434 · 486 · 656 nm)
            </text>
            <line x1="48" y1="24" x2="48" y2="52" stroke="#3B4CC0" strokeWidth="2.5" />
            <line x1="92" y1="24" x2="92" y2="52" stroke="#0D9488" strokeWidth="2.5" />
            <line x1="186" y1="24" x2="186" y2="52" stroke="#DC2626" strokeWidth="2.5" />

            {/* Redshifted observed spectrum strip */}
            <rect x="16" y="86" width="248" height="28" rx="4" fill="url(#persist-spectrum)" stroke="currentColor" strokeOpacity="0.2" />
            <text x="16" y="80" fill="currentColor" fillOpacity="0.65" fontSize="13" fontFamily="monospace">
              Observed up-ship (1 + z)
            </text>
            {animate ? (
              <m.g style={{ x: redshiftPx }}>
                <line x1="48" y1="86" x2="48" y2="114" stroke="#6366F1" strokeWidth="2.5" />
                <line x1="92" y1="86" x2="92" y2="114" stroke="#D97706" strokeWidth="2.5" />
                <line x1="186" y1="86" x2="186" y2="114" stroke="#991B1B" strokeWidth="2.5" />
              </m.g>
            ) : (
              <g transform="translate(26, 0)">
                <line x1="48" y1="86" x2="48" y2="114" stroke="#6366F1" strokeWidth="2.5" />
                <line x1="92" y1="86" x2="92" y2="114" stroke="#D97706" strokeWidth="2.5" />
                <line x1="186" y1="86" x2="186" y2="114" stroke="#991B1B" strokeWidth="2.5" />
              </g>
            )}

            <text x="16" y="138" fill="currentColor" fillOpacity="0.55" fontSize="13" fontFamily="monospace">
              400 nm
            </text>
            <text x="210" y="138" fill="currentColor" fillOpacity="0.55" fontSize="13" fontFamily="monospace">
              700+ nm
            </text>
          </svg>

          <p className="text-[14px] leading-relaxed text-[var(--a-muted)]">
            Hydrogen Balmer lines (<span className="font-code text-[var(--a-ink)]">434, 486, 656 nm</span>) shift right as photons climb out of the gravity well.
          </p>
        </div>
      </div>

      {/* Real Equations Ledger — hairline-divided editorial rows */}
      <div className="divide-y divide-[var(--a-rule)] border-y border-[var(--a-rule)]">
        {REAL_EQUATIONS.map((eq, idx) => (
          <m.div
            key={eq.title}
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-6% 0px' }}
            transition={{ duration: 0.55, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-3 py-5 sm:grid-cols-12 sm:items-baseline"
          >
            <div className="sm:col-span-3">
              <p className="font-code text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                {eq.title}
              </p>
              <p className="mt-0.5 font-code text-[13px] text-[var(--a-muted)]">{eq.variables}</p>
            </div>
            <div className="sm:col-span-4">
              <p className="font-code text-[16px] sm:text-[17px] font-semibold text-[var(--a-ink)]">
                {eq.formula}
              </p>
            </div>
            <div className="sm:col-span-5">
              <p className="text-[15px] leading-relaxed text-[var(--a-ink)]/85">{eq.meaning}</p>
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );
}
