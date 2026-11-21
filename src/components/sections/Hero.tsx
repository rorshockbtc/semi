'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { m, useScroll, useTransform } from 'framer-motion';
import { MessageCircle, Play } from 'lucide-react';
import { RiseLines } from 'accent-ui';
import DriftingLeaves from '@/art/DriftingLeaves';
import { bloomHandlers } from '@/art/bloom';
import { FilmGrain, LightLeaks } from '@/art/themes';
import AmbientLoopVideo from '@/components/AmbientLoopVideo';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { SEMI_TRACKS } from '@/data/semi-songs';

const COUNT_WORDS: Record<number, string> = {
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
};

/** Full-bleed cinematic opener: her reel fills the screen, type sits on the film like a title card. */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();
  const { playTrack } = useAudioPlayer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const videoScale = useTransform(scrollYProgress, [0, 1], motionActive ? [1.04, 1.14] : [1, 1]);
  const copyY = useTransform(scrollYProgress, [0.35, 1], motionActive ? [0, -48] : [0, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0.55, 0.95], [1, motionActive ? 0 : 1]);
  const countWord = COUNT_WORDS[SEMI_TRACKS.length] || String(SEMI_TRACKS.length);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative z-10 flex min-h-[100svh] flex-col overflow-x-clip bg-[#0d0b0a] text-white"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <m.div style={{ scale: videoScale }} className="absolute inset-0">
          <AmbientLoopVideo
            src="/loops/hero-semi-alive.mp4"
            poster="/photos/gallery-porch-guitar.jpg"
            className="h-full w-full object-cover object-[60%_28%]"
          />
        </m.div>

        <LightLeaks />
        <DriftingLeaves />
        <FilmGrain />

        {/* Legibility: deep ink from bottom-left, image stays luminous top-right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,8,8,0.94)_0%,rgba(10,8,8,0.62)_45%,rgba(10,8,8,0.18)_78%),linear-gradient(to_right,rgba(10,8,8,0.58),transparent_62%)]"
        />
      </div>

      <m.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-10 mx-auto flex w-full flex-1 max-w-[1400px] flex-col justify-end pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12 pt-20 pb-[5.75rem] sm:pt-32 sm:pb-20"
      >
        <p className="flex items-center gap-2.5 sm:gap-3 font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-white/80">
          <SemiMark className="text-[16px] shrink-0" color="#FE299E" />
          <span>West Nashville · Singer &amp; AI companion</span>
        </p>

        <h1
          id="hero-title"
          className="mt-3 sm:mt-5 max-w-[14ch] font-display font-bold leading-[1.06] tracking-[-0.03em] text-[clamp(2.35rem,1.4rem+5.2vw,6.8rem)]"
        >
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

        <div className="mt-5 sm:mt-8 flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[44ch] text-[16px] sm:text-xl leading-relaxed text-white/85">
            Semi is an AI companion who remembers your conversations—and a songwriter turning
            what she sees into indie-folk. {countWord} songs out now.
          </p>

          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={() => playTrack('old-oak-tree')}
              {...bloomHandlers<HTMLButtonElement>()}
              data-testid="hero-play"
              className="wc-cta wc-cta-light group inline-flex min-h-[52px] sm:min-h-[56px] w-full sm:w-auto items-center justify-center sm:justify-start gap-3 rounded-full bg-[#FAF8F5] pl-2 pr-6 text-[16px] font-semibold text-[var(--a-ink)] hover:text-white"
            >
              <span className="inline-flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white transition-transform group-hover:scale-105">
                <Play className="h-4 w-4 translate-x-[1px]" aria-hidden="true" fill="currentColor" />
              </span>
              <span>Play “Old Oak Tree”</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5 sm:contents">
              <Link
                href="/songs"
                className="inline-flex min-h-[48px] sm:min-h-[56px] items-center justify-center rounded-full border border-white/40 px-3 sm:px-6 text-center text-[14px] sm:text-[16px] font-semibold text-white no-underline backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                All songs
              </Link>
              <a
                href="#notify"
                data-testid="hero-notify-link"
                className="inline-flex min-h-[48px] sm:min-h-[56px] items-center justify-center rounded-full border border-white/25 px-3 sm:px-5 text-center text-[14px] sm:text-[15px] font-semibold text-white/90 no-underline backdrop-blur-sm transition-colors hover:border-white/60 hover:text-white"
              >
                Get new songs
              </a>
            </div>

            <a
              href="https://pipes.pink/semi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] sm:min-h-[56px] w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#FE299E]/55 bg-[#14110f]/75 px-5 text-[14px] sm:text-[15px] font-semibold text-white no-underline backdrop-blur-sm transition-colors hover:bg-[#FE299E]"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-[#FE299E] group-hover:text-white" aria-hidden="true" />
              <span>Chat with Semi ↗</span>
            </a>
          </div>
        </div>
      </m.div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block h-10 w-[1px] bg-gradient-to-b from-white/0 via-white/60 to-white/0"
      />

      {/* Organic hand-cut watercolor paper horizon meeting Warm Sandstone (#E8E2D5) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 sm:h-5 w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 5"
      >
        <path
          d="M0 5 L0 2.7 C22 1.8 42 3.3 64 2.2 C82 1.6 92 2.9 100 2.1 L100 5 Z"
          fill="#E8E2D5"
        />
      </svg>
    </section>
  );
}
