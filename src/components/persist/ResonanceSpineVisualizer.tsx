'use client';

import React from 'react';
import type { ResonanceZoneId } from '@/data/persist-songs';

const SPINE_NODES: { id: ResonanceZoneId; label: string; km: string; rate: string }[] = [
  { id: 'slow-country', label: 'Slow Country', km: '0 km · Horizon', rate: '1.0×' },
  { id: 'midship', label: 'Midship', km: '900 km · Time Pockets', rate: '0.05× – 4.2×' },
  { id: 'tip', label: 'The Tip', km: '2,000 km · Frontier', rate: '1.65×' },
];

/**
 * 2,000-kilometer Resonance spine diagram showing the black hole horizon
 * and the three proper-time zones.
 */
export default function ResonanceSpineVisualizer({
  activeZone,
  onSelectZone,
}: {
  activeZone: ResonanceZoneId;
  onSelectZone: (zone: ResonanceZoneId) => void;
}) {
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

      {/* Spine Track */}
      <div className="relative py-2">
        {/* Background gradient rail */}
        <div
          aria-hidden="true"
          className="h-2 w-full rounded-full bg-gradient-to-r from-[#B45309] via-[#A3285C] to-[#344E7A] opacity-30"
        />

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
