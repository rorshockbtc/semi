'use client';

import React from 'react';
import { m } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import type { ResonanceZoneId } from '@/data/persist-songs';

const SPINE_NODES: { id: ResonanceZoneId; label: string; km: string; rate: string }[] = [
  { id: 'slow-country', label: 'Slow Country', km: '0 km · Horizon', rate: '1.0×' },
  { id: 'midship', label: 'Midship', km: '900 km · Time Pockets', rate: '0.05× – 4.2×' },
  { id: 'tip', label: 'The Tip', km: '2,000 km · Frontier', rate: '1.65×' },
];

/**
 * Animated 2,000-kilometer Resonance spine diagram showing the black hole horizon,
 * the three proper-time zones, and a relativistic photon pulse climbing up-ship.
 */
export default function ResonanceSpineVisualizer({
  activeZone,
  onSelectZone,
}: {
  activeZone: ResonanceZoneId;
  onSelectZone: (zone: ResonanceZoneId) => void;
}) {
  const { motionActive: animate } = useAmbientMotion();

  return (
    <div className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)]/88 backdrop-blur-[2px] p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-code text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-accent-text)]">
          Resonance · 2,000 km Gravitational Spine
        </p>
        <p className="font-code text-[13px] text-[var(--a-muted)]">
          r → rₛ (Horizon) ← → Deep space (2,000 km)
        </p>
      </div>

      {/* Spine Track */}
      <div className="relative py-2">
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--a-ink)]/10">
          <div
            aria-hidden="true"
            className="h-full w-full bg-gradient-to-r from-[#B45309] via-[#A3285C] to-[#344E7A] opacity-45"
          />
          {animate && (
            <m.div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 w-16 rounded-full bg-gradient-to-r from-transparent via-[#FE299E] to-transparent"
              animate={{ left: ['-10%', '100%'] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>

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
                    : 'border-[var(--a-rule)] bg-[var(--a-surface)]/55 hover:border-[var(--a-ink)]/50'
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
