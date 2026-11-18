'use client';

import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Corporate Semi mark — "; - ]" — matching colonhyphenbracket.pink's Smile component:
 * Bricolage Grotesque bold, explicitly spaced (; - ]), uniformly Sovereign Hot Pink (#FE299E)
 * by default, with a spring bracket tilt on hover and gentle periodic wink.
 */
export function SemiMark({
  className = '',
  winkEvery = 4500,
  hoverWink = true,
  color = '#FE299E',
  decorative = true,
}: {
  className?: string;
  winkEvery?: number | null;
  hoverWink?: boolean;
  color?: string;
  decorative?: boolean;
}) {
  const { motionActive } = useAmbientMotion();
  const [wink, setWink] = useState(false);

  useEffect(() => {
    if (!motionActive || !winkEvery) return;
    let timeoutId = 0;
    const id = window.setInterval(() => {
      setWink(true);
      timeoutId = window.setTimeout(() => setWink(false), 320);
    }, winkEvery);
    return () => {
      window.clearInterval(id);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [motionActive, winkEvery]);

  const activeWink = motionActive && wink;

  return (
    <span
      className={`inline-flex items-baseline font-mark font-bold leading-none select-none tracking-normal ${className}`}
      style={{ color }}
      onMouseEnter={() => hoverWink && setWink(true)}
      onMouseLeave={() => hoverWink && setWink(false)}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : 'Semi punctuation mark'}
      role={decorative ? undefined : 'img'}
    >
      <m.span
        className="inline-block w-[0.54em] text-center"
        animate={{ scaleY: activeWink ? 0.86 : 1 }}
        transition={{ duration: 0.14 }}
      >
        ;
      </m.span>
      <span className="inline-block mx-[0.12em] text-center">-</span>
      <m.span
        className="inline-block w-[0.58em] text-center origin-left"
        animate={{ rotate: activeWink ? 8 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      >
        ]
      </m.span>
    </span>
  );
}
