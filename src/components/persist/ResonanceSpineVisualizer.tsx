'use client';

import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import type { ResonanceZoneId } from '@/data/persist-songs';

const SPINE_NODES: { id: ResonanceZoneId; label: string; km: string; rate: string }[] = [
  { id: 'slow-country', label: 'Slow Country', km: '0 km · Horizon', rate: '1×' },
  { id: 'midship', label: 'Midship', km: '900 km · Time Pockets', rate: '~40×' },
  { id: 'tip', label: 'The Tip', km: '2,000 km · Frontier', rate: '~86,400×' },
];

/**
 * Animated 2,000-kilometer Resonance spine diagram showing the black hole horizon,
 * the three proper-time zones, and a live ferry/signal pulse traveling up-ship.
 */
export default function ResonanceSpineVisualizer({
  activeZone,
  onSelectZone,
}: {
  activeZone: ResonanceZoneId;
  onSelectZone: (zone: ResonanceZoneId) => void;
}) {
  const reduce = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const animate = !reduce && motionActive;

  return (
    <div className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-code text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-accent-text)]">
          Resonance · 2,000 km Gravitational Spine
        </p>
        <p className="font-code text-[13px] text-[var(--a-muted)]">
          Black hole horizon ← → Deep space
        </p>
      </div>

      {/* Animated Spine Track */}
      <div className="relative py-4">
        {/* Background gradient rail */}
        <div
          aria-hidden="true"
          className="h-2 w-full rounded-full bg-gradient-to-r from-[#B45309] via-[#A3285C] to-[#344E7A] opacity-30"
        />

        {/* Animated ferry / light-signal pulse traveling the 2,000-km hull */}
        {animate && (
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-[var(--a-accent-fill)] shadow-[0_0_12px_rgba(254,41,158,0.65)]"
            animate={{ left: ['4%', '94%', '4%'] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Clickable Zone Waypoints */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {SPINE_NODES.map((node) => {
            const selected = activeZone === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectZone(node.id)}
                className={`min-h-[52px] rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                  selected
                    ? 'border-[var(--a-ink)] bg-[var(--a-surface)]'
                    : 'border-[var(--a-rule)] bg-transparent hover:border-[var(--a-ink)]/50'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display text-[15px] font-bold text-[var(--a-ink)]">
                    {node.label}
                  </span>
                  <span className="font-code text-[13px] font-semibold text-[var(--a-accent-text)]">
                    {node.rate}
                  </span>
                </span>
                <span className="mt-0.5 block font-code text-[13px] text-[var(--a-muted)]">
                  {node.km}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
