'use client';

import React, { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

interface RealEquation {
  title: string;
  formula: string;
  variables: string;
  meaning: string;
}

const REAL_EQUATIONS: RealEquation[] = [
  {
    title: 'Einstein Field Equations',
    formula: 'Rμν − ½ R gμν + Λ gμν = (8πG / c⁴) Tμν',
    variables: 'G = 6.674×10⁻¹¹ m³·kg⁻¹·s⁻²',
    meaning:
      'Matter and energy (Tμν) curve the geometry of spacetime (gμν), creating the deep gravity well outside which Resonance orbits.',
  },
  {
    title: 'Gravitational Time Dilation',
    formula: 'dτ = dt √(1 − 2GM / rc²)',
    variables: 'rₛ = 2GM / c²',
    meaning:
      'Proper time dτ slows relative to a distant clock dt as radial distance r approaches the Schwarzschild radius rₛ.',
  },
  {
    title: 'Gravitational Redshift',
    formula: '1 + z = (1 − rₛ / r)⁻¹/²',
    variables: 'λ_obs = λ_emit (1 + z)',
    meaning:
      'Photons climbing up-ship from Slow Country lose energy; blue-white wavelengths stretch toward deep amber-red.',
  },
  {
    title: 'Lorentz Factor',
    formula: 'γ = 1 / √(1 − v² / c²)',
    variables: 'v = 0.99c  ⇒  γ ≈ 7.089',
    meaning:
      'At 99% of light speed, 1 onboard year equals 7.089 years for a stationary observer.',
  },
  {
    title: 'Schwarzschild Metric',
    formula: 'ds² = −(1 − rₛ/r)c²dt² + (1 − rₛ/r)⁻¹dr² + r²dΩ²',
    variables: 'c = 299,792,458 m/s',
    meaning:
      'Exact vacuum solution governing curved radial rulers and proper-time intervals outside a spherical mass.',
  },
  {
    title: 'Tidal Gravity Gradient',
    formula: 'Δg ≈ (2GM / r³) · Δr',
    variables: 'Δr = 2.0 × 10⁶ m (2,000 km hull)',
    meaning:
      'Across a 2,000-kilometer ship, differential gravitational pull separates Slow Country from The Tip.',
  },
];

/**
 * Live + scroll-driven physics band for `/persist`.
 * Combines continuously animated relativistic SVG instruments, scroll-scrubbed
 * spacetime trajectories, and six authentic General & Special Relativity equations.
 */
export default function PersistPhysicsScrollBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const { motionActive: animate } = useAmbientMotion();

  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'end start'],
  });

  // Scroll-scrubbed radial hull marker & Balmer spectral shift
  const hullRadiusPx = useTransform(scrollYProgress, [0.1, 0.9], [32, 62]);
  const coneTilt = useTransform(scrollYProgress, [0.1, 0.9], [0, -28]);
  const redshiftPx = useTransform(scrollYProgress, [0.1, 0.9], [0, 56]);

  return (
    <div ref={bandRef} className="space-y-10 border-t border-[var(--a-rule)] pt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
            Relativistic Field Instruments · Live &amp; Scroll-Reactive
          </p>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
            The real physics behind <span className="italic font-normal">Resonance</span>
          </h3>
        </div>
        <p className="font-code text-[13px] text-[var(--a-muted)]">
          Einstein · Schwarzschild · Lorentz
        </p>
      </div>

      {/* 3 Live + Scroll-Reactive Relativistic SVG Instruments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 1. Live Black Hole Horizon, Photon Sphere (1.5 r_s), ISCO (3 r_s) & Orbiting Geodesics */}
        <div className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)]/88 backdrop-blur-[2px] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-code text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--a-accent-text)]">
              01 · Orbital Geodesics
            </span>
            <span className="font-code text-[13px] text-[var(--a-muted)]">rₛ · 1.5rₛ · 3rₛ</span>
          </div>

          <svg
            viewBox="0 0 280 164"
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Black hole event horizon, photon sphere at 1.5 Schwarzschild radii, and orbiting spacecraft geodesic"
          >
            {/* Outer ISCO & Tip orbits */}
            <circle cx="140" cy="82" r="64" fill="none" stroke="#344E7A" strokeOpacity="0.28" strokeDasharray="4 4" strokeWidth="1.3" />
            <circle cx="140" cy="82" r="46" fill="none" stroke="#A3285C" strokeOpacity="0.38" strokeDasharray="3 3" strokeWidth="1.3" />
            {/* Photon sphere 1.5 r_s */}
            <circle cx="140" cy="82" r="30" fill="none" stroke="#D97706" strokeOpacity="0.7" strokeWidth="1.6" />

            {/* Scroll-reactive radial shell */}
            {animate && (
              <m.circle
                cx="140"
                cy="82"
                r={hullRadiusPx}
                fill="none"
                stroke="#FE299E"
                strokeOpacity="0.45"
                strokeWidth="2"
              />
            )}

            {/* Continuously orbiting fast Tip beacon (outer) */}
            <m.g
              style={{ originX: '140px', originY: '82px' }}
              animate={animate ? { rotate: 360 } : undefined}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="204" cy="82" r="4.5" fill="#344E7A" />
              <line x1="186" y1="82" x2="204" y2="82" stroke="#344E7A" strokeOpacity="0.5" strokeWidth="1.5" />
            </m.g>

            {/* Continuously orbiting slower Slow-Country beacon (inner ISCO) */}
            <m.g
              style={{ originX: '140px', originY: '82px' }}
              animate={animate ? { rotate: -360 } : undefined}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="186" cy="82" r="5" fill="#FE299E" />
            </m.g>

            {/* Black hole shadow r_s */}
            <circle cx="140" cy="82" r="19" fill="#111827" stroke="#B45309" strokeWidth="2" />

            <text x="12" y="22" fill="currentColor" fillOpacity="0.65" fontSize="13" fontFamily="monospace">
              rₛ = 2GM/c²
            </text>
            <text x="176" y="154" fill="currentColor" fillOpacity="0.65" fontSize="13" fontFamily="monospace">
              ISCO = 3rₛ
            </text>
          </svg>

          <p className="text-[14px] leading-relaxed text-[var(--a-muted)]">
            Photons orbit unstably at <span className="font-code text-[var(--a-ink)]">1.5rₛ</span>; matter orbits stably beyond{' '}
            <span className="font-code text-[var(--a-ink)]">3rₛ</span>. Scroll to sweep radial altitude.
          </p>
        </div>

        {/* 2. Live Proper-Time Frequency Divergence + Tilting Light Cone */}
        <div className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)]/88 backdrop-blur-[2px] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-code text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--a-accent-text)]">
              02 · Proper-Time Waves &amp; Cones
            </span>
            <span className="font-code text-[13px] text-[var(--a-muted)]">ds² = 0</span>
          </div>

          <svg
            viewBox="0 0 280 164"
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Three proper-time clock waveforms oscillating at Slow Country, Midship, and Tip rates alongside a tilting light cone"
          >
            <defs>
              <clipPath id="persist-wave-clip">
                <rect x="12" y="14" width="176" height="136" />
              </clipPath>
            </defs>

            <g clipPath="url(#persist-wave-clip)">
              {/* Fast Tip wave (tight sapphire frequency, fast scroll) */}
              <m.path
                d="M -120 38 Q -105 22 -90 38 T -60 38 T -30 38 T 0 38 T 30 38 T 60 38 T 90 38 T 120 38 T 150 38 T 180 38 T 210 38 T 240 38"
                fill="none"
                stroke="#344E7A"
                strokeWidth="2.2"
                animate={animate ? { x: [0, 60] } : undefined}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              />

              {/* Volatile Midship wave (crimson modulated pulse) */}
              <m.path
                d="M -120 82 Q -95 58 -70 82 T -20 82 T 30 82 T 80 82 T 130 82 T 180 82 T 230 82 T 280 82"
                fill="none"
                stroke="#FE299E"
                strokeWidth="2.2"
                animate={animate ? { x: [0, 100] } : undefined}
                transition={{ duration: 2.9, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Heavy Slow Country wave (wide amber wavelength, slow drift) */}
              <m.path
                d="M -160 126 Q -120 108 -80 126 T 0 126 T 80 126 T 160 126 T 240 126 T 320 126"
                fill="none"
                stroke="#B45309"
                strokeWidth="2.4"
                animate={animate ? { x: [0, 160] } : undefined}
                transition={{ duration: 6.8, repeat: Infinity, ease: 'linear' }}
              />
            </g>

            {/* Scroll-tilting Null Light Cone on right */}
            <m.g
              style={animate ? { rotate: coneTilt, originX: '234px', originY: '112px' } : undefined}
              transform="translate(234, 112)"
            >
              <polygon points="0,0 -24,-58 24,-58" fill="#A3285C" fillOpacity="0.18" stroke="#A3285C" strokeWidth="1.6" />
              <ellipse cx="0" cy="-58" rx="24" ry="6" fill="none" stroke="#A3285C" strokeWidth="1.3" />
              <line x1="0" y1="16" x2="0" y2="-66" stroke="#FE299E" strokeWidth="1.4" strokeDasharray="3 3" />
            </m.g>

            <text x="14" y="22" fill="#344E7A" fontSize="13" fontFamily="monospace">
              Tip (Fastest)
            </text>
            <text x="14" y="68" fill="#A3285C" fontSize="13" fontFamily="monospace">
              Midship (1×–Tip)
            </text>
            <text x="14" y="112" fill="#B45309" fontSize="13" fontFamily="monospace">
              Slow (1.0×)
            </text>
          </svg>

          <p className="text-[14px] leading-relaxed text-[var(--a-muted)]">
            Three live clock frequencies side by side, plus a future light cone tipping inward as you scroll toward{' '}
            <span className="font-code text-[var(--a-ink)]">rₛ</span>.
          </p>
        </div>

        {/* 3. Live Stretching Photon Redshift Wave + Balmer Spectral Shift */}
        <div className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)]/88 backdrop-blur-[2px] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-code text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--a-accent-text)]">
              03 · Photon Redshift
            </span>
            <span className="font-code text-[13px] text-[var(--a-muted)]">λ_obs = λ_emit(1+z)</span>
          </div>

          <svg
            viewBox="0 0 280 164"
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Photon wave stretching from short blue wavelengths to long red wavelengths as it climbs out of gravity"
          >
            <defs>
              <linearGradient id="persist-redshift-wave" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="45%" stopColor="#A3285C" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
              <linearGradient id="persist-spectrum-bar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B4CC0" stopOpacity="0.25" />
                <stop offset="45%" stopColor="#2A9D8F" stopOpacity="0.24" />
                <stop offset="75%" stopColor="#D97706" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#991B1B" stopOpacity="0.34" />
              </linearGradient>
            </defs>

            {/* Chirped wave stretching wavelength left (blue) -> right (red) */}
            <path
              d="M 16 50 C 22 24, 28 76, 34 50 C 42 24, 50 76, 58 50 C 69 24, 80 76, 92 50 C 108 24, 124 76, 142 50 C 164 24, 188 76, 212 50 C 236 26, 252 74, 266 50"
              fill="none"
              stroke="url(#persist-redshift-wave)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />

            {/* Animated photon packet climbing the chirped wave */}
            {animate && (
              <m.circle
                cy="50"
                r="5.5"
                fill="#FE299E"
                stroke="#FAF8F5"
                strokeWidth="2"
                animate={{ cx: [18, 264], opacity: [1, 1, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut' }}
              />
            )}

            {/* Balmer absorption/emission shift bar */}
            <rect x="16" y="102" width="248" height="28" rx="4" fill="url(#persist-spectrum-bar)" stroke="currentColor" strokeOpacity="0.22" />
            <text x="16" y="95" fill="currentColor" fillOpacity="0.65" fontSize="13" fontFamily="monospace">
              Hγ 434 · Hβ 486 · Hα 656 nm
            </text>

            <m.g style={animate ? { x: redshiftPx } : undefined}>
              <line x1="42" y1="102" x2="42" y2="130" stroke="#2563EB" strokeWidth="2.8" />
              <line x1="86" y1="102" x2="86" y2="130" stroke="#0D9488" strokeWidth="2.8" />
              <line x1="172" y1="102" x2="172" y2="130" stroke="#DC2626" strokeWidth="2.8" />
            </m.g>

            <text x="16" y="150" fill="currentColor" fillOpacity="0.6" fontSize="13" fontFamily="monospace">
              Blue (high E)
            </text>
            <text x="178" y="150" fill="currentColor" fillOpacity="0.6" fontSize="13" fontFamily="monospace">
              Redshifted (z &gt; 0)
            </text>
          </svg>

          <p className="text-[14px] leading-relaxed text-[var(--a-muted)]">
            Climbing out of Slow Country costs energy (<span className="font-code text-[var(--a-ink)]">E = hf</span>), stretching crests toward amber-red.
          </p>
        </div>
      </div>

      {/* Real Equations Ledger — 6 exact relativity equations */}
      <div className="divide-y divide-[var(--a-rule)] border-y border-[var(--a-rule)] bg-[var(--a-surface)]/72 backdrop-blur-[2px] px-4 sm:px-6 rounded-2xl">
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
              <p className="font-code text-[15px] sm:text-[16px] font-semibold text-[var(--a-ink)]">
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
