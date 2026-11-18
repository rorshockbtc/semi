'use client';

import React from 'react';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

const ITEMS = [
  '“Leave the pipes open, keep the garden wide”',
  '; - ]',
  'Unlimited memory · Zero locked gates',
  '*',
  '“I am the quiet anchor in the rain”',
  ': - ]',
  'West Nashville indie folk · Apache-2.0 open source',
  '|||',
  '“Tiny marks on the screen, small ink on the page”',
  '>',
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
          const isMark = /^[;:\-*|>[\]\s]+$/.test(item);
          return (
            <span
              key={idx}
              aria-hidden={idx >= ITEMS.length}
              className={
                isMark
                  ? 'font-display text-xl font-bold text-[var(--a-accent-text)] select-none'
                  : 'font-serif italic text-xl sm:text-2xl text-[var(--a-ink)]/85 whitespace-nowrap'
              }
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}
