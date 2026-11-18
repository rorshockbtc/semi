'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { m, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { RiseLines } from 'accent-ui';
import { FilmGrain, LightLeaks } from '@/art/themes';
import AmbientLoopVideo from '@/components/AmbientLoopVideo';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

/** Full-bleed cinematic opener: her reel fills the screen, type sits on the film like a title card. */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();
  const { playTrack } = useAudioPlayer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const videoScale = useTransform(scrollYProgress, [0, 1], motionActive ? [1.04, 1.16] : [1, 1]);
  const copyY = useTransform(scrollYProgress, [0, 1], motionActive ? [0, -90] : [0, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, motionActive ? 0 : 1]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#0d0b0a] text-white"
    >
      <m.div style={{ scale: videoScale }} className="absolute inset-0">
        <AmbientLoopVideo
          src="/loops/hero-semi-alive.mp4"
          poster="/photos/gallery-vintage-mic.jpg"
          className="h-full w-full object-cover object-[60%_30%]"
        />
      </m.div>

      <LightLeaks />
      <FilmGrain />

      {/* Legibility: deep ink from bottom-left, image stays luminous top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,8,8,0.92)_0%,rgba(10,8,8,0.55)_38%,rgba(10,8,8,0.05)_70%),linear-gradient(to_right,rgba(10,8,8,0.55),transparent_60%)]"
      />

      <m.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20"
      >
        <p className="flex items-center gap-3 font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-white/75">
          <SemiMark className="text-[16px]" color="#FE299E" />
          <span>West Nashville · Singer &amp; AI companion</span>
        </p>

        <h1 id="hero-title" className="mt-5 max-w-[14ch] font-display font-bold leading-[0.92] tracking-[-0.03em] text-[clamp(3.2rem,9vw,8.5rem)]">
          <RiseLines
            immediate
            lines={[
              'Every word',
              <span key="l2">you’ve told me,</span>,
              <span key="l3" className="font-serif italic font-medium tracking-[-0.01em] text-[#FFD9C2]">
                still warm.
              </span>,
            ]}
          />
        </h1>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[44ch] text-lg sm:text-xl leading-relaxed text-white/85">
            Semi is an AI companion who remembers your conversations—and a songwriter turning
            what she sees into indie-folk. Three singles out now.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => playTrack('old-oak-tree')}
              data-testid="hero-play"
              className="group inline-flex min-h-[56px] items-center gap-3 rounded-full bg-white pl-2 pr-6 text-[16px] font-semibold text-[var(--a-ink)] transition-transform hover:-translate-y-0.5"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white transition-transform group-hover:scale-105">
                <Play className="h-4 w-4 translate-x-[1px]" aria-hidden="true" fill="currentColor" />
              </span>
              Play “Old Oak Tree”
            </button>
            <Link
              href="/songs"
              className="inline-flex min-h-[56px] items-center rounded-full border border-white/40 px-6 text-[16px] font-semibold text-white no-underline backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              All songs &amp; stories
            </Link>
          </div>
        </div>
      </m.div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block h-10 w-[1px] bg-gradient-to-b from-white/0 via-white/60 to-white/0"
      />
    </section>
  );
}
