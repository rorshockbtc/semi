'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { m, useScroll, useTransform } from 'framer-motion';
import { bloomHandlers } from '@/art/bloom';
import { FilmGrain } from '@/art/themes';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/** Full-bleed photographic sign-off with a slow parallax drift and hand-cut paper edge. */
export default function Closing({
  image = '/photos/semi-studio-wide.jpg',
  alt = 'Semi seated in her sunlit West Nashville room with guitars and vinyl records.',
  topFill = '#E8E2D5',
}: {
  image?: string;
  alt?: string;
  topFill?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], motionActive ? ['-8%', '8%'] : ['0%', '0%']);

  return (
    <section
      ref={ref}
      aria-labelledby="closing-title"
      className="relative z-10 overflow-hidden bg-[#0d0b0a] text-white"
    >
      <m.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} loading="lazy" className="h-full w-full object-cover object-[50%_22%]" />
      </m.div>
      <FilmGrain />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,8,8,0.88)_0%,rgba(10,8,8,0.62)_55%,rgba(10,8,8,0.35)_100%),linear-gradient(to_right,rgba(10,8,8,0.82),rgba(10,8,8,0.25)_65%,transparent)]"
      />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4 sm:h-5 w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 5"
      >
        <path
          d="M0 0 L100 0 L100 2.4 C82 3.3 62 1.7 38 2.8 C18 3.4 8 2.1 0 2.7 Z"
          fill={topFill}
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1400px] pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12 py-20 sm:py-36 lg:py-48">
        <h2 id="closing-title" className="max-w-[12ch] font-display text-huge font-bold">
          Leave the pipes open. <span className="font-serif italic font-normal text-[#FFD9C2]">Keep the garden wide.</span>
        </h2>
        <p className="mt-5 sm:mt-6 max-w-[40ch] text-base sm:text-lg text-white/85">
          Her debut album, <em>I/O</em>, is out now—twelve songs recorded in West Nashville, free to
          stream and download.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/songs"
            {...bloomHandlers<HTMLAnchorElement>()}
            className="wc-cta wc-cta-light inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center rounded-full bg-[#FAF8F5] px-7 text-[16px] font-semibold text-[var(--a-ink)] no-underline hover:text-white"
          >
            Listen to <em className="ml-1">I/O</em>
          </Link>
          <a
            href="https://pipes.pink/semi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center rounded-full border border-white/40 bg-black/35 px-7 text-[16px] font-semibold text-white no-underline backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            Talk to Semi on Pipes ↗
          </a>
        </div>
        <p className="mt-7 sm:mt-8 text-[15px] text-white/80">
          Built by{' '}
          <a
            href="https://colonhyphenbracket.pink"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#FFD9C2] underline underline-offset-4 hover:text-white"
          >
            Colon Hyphen Bracket (: - ]) ↗
          </a>{' '}
          — hire us to build your site or app.
        </p>
      </div>
    </section>
  );
}
