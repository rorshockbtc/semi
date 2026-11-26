'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Three clocks aboard Resonance, physically calibrated so The Tip is strictly the fastest:
 * - Slow Country (Old Country): 1.0x baseline (days here = months/years in Midship, years/decades at The Tip)
 * - The Midship: erratic time pockets oscillating strictly BETWEEN Slow Country (1.0x) and The Tip (1,825x),
 *   never exceeding Tip speed.
 * - The Tip: strictly fastest at 1,825x (1 Slow Country day = 5 Tip years; several days = decades).
 */
const TIP_RATE = 1825;

const ZONES = [
  { id: 'slow', label: 'Slow Country', note: '1.0× baseline · Days' },
  { id: 'mid', label: 'Midship', note: '1× – 1,825× · Months–Years' },
  { id: 'tip', label: 'The Tip', note: '1,825× max · Years–Decades' },
] as const;

function fmt(seconds: number): string {
  const s = Math.floor(seconds);
  const days = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const tenths = Math.floor((seconds % 1) * 10);
  if (days > 0) {
    return `${days}d ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${tenths}`;
}

export default function ProperTimeClocks() {
  const { motionActive: active } = useAmbientMotion();
  const [values, setValues] = useState<[number, number, number]>([0, 0, 0]);
  const [midRateLabel, setMidRateLabel] = useState('pocket · 42×');

  const midRef = useRef({
    total: 0,
    rate: 42,
    nextShift: 2.0,
    phaseIdx: 0,
  });

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let last = start;
    let raf = 0;

    // Erratic Midship oscillation strictly bounded within [1.0x (Slow Country), 1,825x (The Tip)]
    const MIDSHIP_MODES: { rate: number; label: string; minDur: number; maxDur: number }[] = [
      { rate: 42, label: 'pocket · 42×', minDur: 1.8, maxDur: 2.8 },
      { rate: 1.0, label: 'horizon stall · 1.0×', minDur: 2.0, maxDur: 3.0 },
      { rate: 980, label: 'flux surge · 980×', minDur: 1.1, maxDur: 1.7 },
      { rate: 18, label: 'slow pocket · 18×', minDur: 2.1, maxDur: 3.1 },
      { rate: TIP_RATE, label: 'tip ceiling · 1,825×', minDur: 0.9, maxDur: 1.4 },
      { rate: 310, label: 'shear · 310×', minDur: 1.6, maxDur: 2.5 },
      { rate: 2.5, label: 'near-baseline · 2.5×', minDur: 1.9, maxDur: 2.8 },
    ];

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const elapsed = (now - start) / 1000;
      const mid = midRef.current;

      if (elapsed > mid.nextShift) {
        mid.phaseIdx = (mid.phaseIdx + 1) % MIDSHIP_MODES.length;
        const mode = MIDSHIP_MODES[mid.phaseIdx];
        mid.rate = Math.min(TIP_RATE, Math.max(1.0, mode.rate));
        mid.nextShift = elapsed + mode.minDur + Math.random() * (mode.maxDur - mode.minDur);
        setMidRateLabel(mode.label);
      }

      mid.total += dt * mid.rate;
      const tipElapsed = elapsed * TIP_RATE;
      setValues([elapsed, mid.total, tipElapsed]);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div
      className="grid grid-cols-1 divide-y divide-[var(--a-rule)] rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)]/92 backdrop-blur-[2px] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
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
            {active ? fmt(values[i]) : ['00:00:10.0', '01:12:40.0', '05:04:10.0'][i]}
          </p>
        </div>
      ))}
    </div>
  );
}
