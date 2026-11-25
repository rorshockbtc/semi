'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Three clocks aboard Resonance, ticking at different proper-time rates since you opened the page:
 * - Slow Country: 1.0x (baseline real time)
 * - Midship: generally lags behind (~0.45x avg), with wide variance—crawling almost still (0.08x)
 *   inside deep pockets and surging rapidly (up to 4.2x) across volatile flux seams
 * - The Tip: ~65% faster than Slow Country (1.65x)
 */
const ZONES = [
  { id: 'slow', label: 'Slow Country', note: '1.0× baseline' },
  { id: 'mid', label: 'Midship', note: '0.08× – 4.2× flux' },
  { id: 'tip', label: 'The Tip', note: '1.65× (+65% faster)' },
] as const;

function fmt(seconds: number): string {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const tenths = Math.floor((seconds % 1) * 10);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${tenths}`;
}

export default function ProperTimeClocks() {
  const reduce = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const active = !reduce && motionActive;
  const [values, setValues] = useState<[number, number, number]>([0, 0, 0]);
  const [midRateLabel, setMidRateLabel] = useState('lagging · 0.35×');

  const midRef = useRef({
    total: 0,
    rate: 0.35,
    nextShift: 2.2,
    phaseIdx: 0,
  });

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let last = start;
    let raf = 0;

    // Alternating schedule biased to lag behind Slow Country, with deep stalls and sharp surges
    const MIDSHIP_MODES: { rate: number; label: string; minDur: number; maxDur: number }[] = [
      { rate: 0.35, label: 'lagging · 0.35×', minDur: 2.2, maxDur: 3.4 },
      { rate: 0.08, label: 'deep pocket · 0.08×', minDur: 2.4, maxDur: 3.8 },
      { rate: 3.8, label: 'pocket surge · 3.8×', minDur: 1.1, maxDur: 1.8 },
      { rate: 0.22, label: 'lagging · 0.22×', minDur: 2.5, maxDur: 4.0 },
      { rate: 0.05, label: 'near-still · 0.05×', minDur: 2.0, maxDur: 3.2 },
      { rate: 4.2, label: 'flux jump · 4.2×', minDur: 0.9, maxDur: 1.5 },
      { rate: 0.55, label: 'lagging · 0.55×', minDur: 2.0, maxDur: 3.0 },
    ];

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const elapsed = (now - start) / 1000;
      const mid = midRef.current;

      if (elapsed > mid.nextShift) {
        mid.phaseIdx = (mid.phaseIdx + 1) % MIDSHIP_MODES.length;
        const mode = MIDSHIP_MODES[mid.phaseIdx];
        mid.rate = mode.rate;
        mid.nextShift = elapsed + mode.minDur + Math.random() * (mode.maxDur - mode.minDur);
        setMidRateLabel(mode.label);
      }

      mid.total += dt * mid.rate;
      // Tip runs ~50–80% faster (oscillating smoothly around 1.65x)
      const tipElapsed = elapsed * 1.65;
      setValues([elapsed, mid.total, tipElapsed]);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div
      className="grid grid-cols-1 divide-y divide-[var(--a-rule)] rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      aria-label="Time elapsed in each zone of Resonance since you opened this page"
    >
      {ZONES.map((z, i) => (
        <div key={z.id} className="px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-code text-[13px] uppercase tracking-[0.16em] text-[var(--a-muted)]">
              {z.label}
            </p>
            <span className="font-code text-[13px] text-[var(--a-accent-text)]">
              {i === 1 && active ? midRateLabel : z.note}
            </span>
          </div>
          <p className="mt-1.5 font-code text-[22px] font-semibold tabular-nums text-[var(--a-ink)]">
            {active ? fmt(values[i]) : ['00:00:10.0', '00:00:06.4', '00:00:16.5'][i]}
          </p>
        </div>
      ))}
    </div>
  );
}
