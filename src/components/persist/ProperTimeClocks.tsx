'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Three clocks aboard Resonance, ticking at different rates since you opened the page.
 * Slow Country = real time; Midship jumps when it crosses a pocket; the Tip races ahead.
 */
const ZONES = [
  { id: 'slow', label: 'Slow Country', rate: 1 },
  { id: 'mid', label: 'Midship', rate: 0 },
  { id: 'tip', label: 'The Tip', rate: 86400 },
] as const;

function fmt(seconds: number): string {
  const s = Math.floor(seconds);
  const years = Math.floor(s / 31_536_000);
  const days = Math.floor((s % 31_536_000) / 86_400);
  const h = Math.floor((s % 86_400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const hms = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  if (years > 0) return `${years}y ${days}d ${hms}`;
  if (days > 0) return `${days}d ${hms}`;
  return hms;
}

export default function ProperTimeClocks() {
  const reduce = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const active = !reduce && motionActive;
  const [values, setValues] = useState<[number, number, number]>([0, 0, 0]);
  const midRef = useRef({ total: 0, rate: 60, nextShift: 3 });

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let last = start;
    let raf = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const elapsed = (now - start) / 1000;
      const mid = midRef.current;
      if (elapsed > mid.nextShift) {
        mid.rate = [1, 60, 3600, 86400 * 3][Math.floor(Math.random() * 4)];
        mid.nextShift = elapsed + 2 + Math.random() * 3;
      }
      mid.total += dt * mid.rate;
      setValues([elapsed * ZONES[0].rate, mid.total, elapsed * ZONES[2].rate]);
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
          <p className="font-code text-[13px] uppercase tracking-[0.16em] text-[var(--a-muted)]">{z.label}</p>
          <p className="mt-1 font-code text-[20px] font-semibold tabular-nums text-[var(--a-ink)]">
            {active ? fmt(values[i]) : ['00:00:12', '3d 04:12:55', '2y 41d 06:00:00'][i]}
          </p>
        </div>
      ))}
    </div>
  );
}
