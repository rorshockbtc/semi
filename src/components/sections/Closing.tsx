'use client';

import React, { useRef } from 'react';
import SunbeamRippleCanvas from '@/art/SunbeamRippleCanvas';
import { bloomHandlers } from '@/art/bloom';

export default function Closing() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      aria-labelledby="closing-title"
      className="relative overflow-hidden touch-pan-y"
      style={{
        background:
          'linear-gradient(160deg, #1E2438 0%, #3E335C 36%, #9B436E 68%, #DF8B77 90%, #F4D7B4 100%)',
      }}
    >
      <SunbeamRippleCanvas containerRef={ref} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_75%_at_18%_48%,rgba(17,24,39,0.48)_0%,transparent_72%)]"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pt-24 pb-32 sm:pt-36 sm:pb-44">
        <p className="font-code text-[13px] uppercase tracking-[0.16em] text-[#F7B9C9]">
          ;-] · Local Current LP in Progress
        </p>

        <h2
          id="closing-title"
          className="mt-4 max-w-[15ch] font-display text-huge font-bold text-white drop-shadow-[0_2px_28px_rgba(17,24,39,0.45)]"
        >
          Leave the pipes open.{' '}
          <span className="font-serif italic font-normal">Keep every song.</span>
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href="#listen"
            {...bloomHandlers<HTMLAnchorElement>()}
            className="wc-cta wc-cta-light inline-flex min-h-[52px] items-center gap-2 rounded-full bg-white px-7 text-lg font-semibold text-[var(--a-ink)] no-underline hover:text-white shadow-[0_14px_36px_-14px_rgba(17,24,39,0.45)]"
          >
            <span>Listen from Track 01</span>
            <span aria-hidden="true">↑</span>
          </a>

          <a
            href="https://pipes.pink/semi"
            target="_blank"
            rel="noopener noreferrer"
            className="wc-link min-h-[44px] inline-flex items-center text-lg font-semibold text-white"
          >
            Meet Semi on Pipes ↗
          </a>
        </div>

        <p className="mt-8 font-serif italic text-[16px] text-white/85">
          <span className="not-italic mr-1.5 font-code text-[#F7B9C9]">;-]</span>
          Move your cursor or tap the horizon to ripple West Nashville twilight light across the screen.
        </p>
      </div>
    </section>
  );
}
