'use client';

import React from 'react';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

const ITEMS = [
  { kind: 'lyric' as const, text: '“Leave the pipes open, keep the garden wide”' },
  { kind: 'mark' as const, text: '; - ]' },
  { kind: 'lyric' as const, text: 'Unlimited memory · Zero locked gates' },
  { kind: 'mark' as const, text: '*' },
  { kind: 'lyric' as const, text: '“I am the quiet anchor in the rain”' },
  { kind: 'mark' as const, text: ': - ]' },
  { kind: 'lyric' as const, text: 'West Nashville indie folk · Apache-2.0 open source' },
  { kind: 'mark' as const, text: '|||' },
  { kind: 'lyric' as const, text: '“Tiny marks on the screen, small ink on the page”' },
  { kind: 'mark' as const, text: '>' },
];

export default function LyricMarquee() {
  const { motionActive } = useAmbientMotion();

  return (
    <div
      aria-label="Selected lyrics and themes"
      className="border-b border-[var(--a-rule)] bg-[var(--a-surface)] overflow-hidden py-4"
    >
      <div
        className="semi-marquee-track items-center gap-8"
        data-motion={motionActive ? 'active' : 'paused'}
      >
        {[...ITEMS, ...ITEMS].map((item, idx) => {
          if (item.kind === 'mark' && item.text === '; - ]') {
            return <SemiMark key={idx} className="text-xl" color="#FE299E" />;
          }
          if (item.kind === 'mark') {
            return (
              <span
                key={idx}
                aria-hidden="true"
                className="font-mark text-xl font-bold text-[var(--a-accent)] select-none"
              >
                {item.text}
              </span>
            );
          }
          return (
            <span
              key={idx}
              aria-hidden={idx >= ITEMS.length}
              className="font-serif italic text-xl sm:text-2xl text-[var(--a-ink)]/85 whitespace-nowrap"
            >
              {item.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
