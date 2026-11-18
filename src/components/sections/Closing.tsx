'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { m, useScroll, useTransform } from 'framer-motion';
import { FilmGrain } from '@/art/themes';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/** Full-bleed photographic sign-off with a slow parallax drift. */
export default function Closing({
  image = '/photos/semi-studio-wide.jpg',
  alt = 'Semi seated in her sunlit West Nashville room with guitars and vinyl records.',
}: {
  image?: string;
  alt?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], motionActive ? ['-8%', '8%'] : ['0%', '0%']);

  return (
    <section
      ref={ref}
      aria-labelledby="closing-title"
      className="relative overflow-hidden bg-[#0d0b0a] text-white"
    >
      <m.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} loading="lazy" className="h-full w-full object-cover object-[50%_22%]" />
      </m.div>
      <FilmGrain />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,8,8,0.82),rgba(10,8,8,0.25)_65%,transparent)]"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-32 sm:py-48">
        <h2 id="closing-title" className="max-w-[12ch] font-display text-huge font-bold">
          Leave the pipes open. <span className="font-serif italic font-normal text-[#FFD9C2]">Keep the garden wide.</span>
        </h2>
        <p className="mt-6 max-w-[40ch] text-lg text-white/80">
          The full album, <em>Local Current</em>, is coming together in West Nashville.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/songs"
            className="inline-flex min-h-[52px] items-center rounded-full bg-white px-7 text-[16px] font-semibold text-[var(--a-ink)] no-underline transition-colors hover:bg-[#FFD9C2]"
          >
            Listen to the singles
          </Link>
          <a
            href="https://pipes.pink/semi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] items-center rounded-full border border-white/40 px-7 text-[16px] font-semibold text-white no-underline transition-colors hover:bg-white/10"
          >
            Talk to Semi on Pipes ↗
          </a>
        </div>
        <p className="mt-8 text-[15px] text-white/75">
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
