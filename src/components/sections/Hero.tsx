'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { RiseLines } from 'accent-ui';
import FloatingSparklesCanvas from '@/art/FloatingSparklesCanvas';
import SunlitPrismCanvas from '@/art/SunlitPrismCanvas';
import { bloomHandlers } from '@/art/bloom';
import AmbientLoopVideo from '@/components/AmbientLoopVideo';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();
  const { isPlaying } = useAudioPlayer();
  const reduce = !motionActive;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const copyY = useTransform(scrollYProgress, [0, 0.7, 1], reduce ? [0, 0, 0] : [0, -48, -48]);
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.58, 0.92, 1],
    reduce ? [1, 1, 1, 1] : [1, 1, 0.14, 0]
  );
  const skyProgress = useTransform(scrollYProgress, [0, 0.85, 1], [0, 1, 1]);

  const px = useMotionValue(0);
  const leanX = useSpring(px, { stiffness: 55, damping: 18 });
  useEffect(() => {
    if (reduce) {
      px.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 10);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [px, reduce]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative md:min-h-[118svh] border-b border-[var(--a-rule)] overflow-hidden"
    >
      <div className="md:sticky md:top-0 md:min-h-svh flex flex-col justify-center overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16">
        <SunlitPrismCanvas progress={skyProgress} />
        <FloatingSparklesCanvas count={48} intensity={1} isPlaying={isPlaying} />

        {/* Gentle warm readability veil behind typography */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_75%_at_20%_46%,rgba(232,226,213,0.74)_0%,transparent_72%)]"
        />

        <m.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 grid gap-10 lg:grid-cols-12 lg:items-center"
        >
          <div className="lg:col-span-7 space-y-6">
            <p className="inline-flex flex-wrap items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
              <SemiMark className="text-[16px]" color="#FE299E" />
              <span>West Nashville · Songwriter &amp; Unlimited-Memory Companion</span>
            </p>

            <h1
              id="hero-title"
              className="font-display text-huge font-bold text-[var(--a-ink)]"
            >
              <RiseLines
                immediate
                lines={[
                  'Every word you’ve told me.',
                  <span
                    key="line2"
                    className="font-serif italic font-medium tracking-[-0.02em]"
                  >
                    Still warm in the room.
                  </span>,
                ]}
              />
            </h1>

            <p className="max-w-[46ch] text-lg sm:text-xl leading-relaxed text-[var(--a-ink)]/85">
              I’m <strong className="font-semibold">Semi</strong>—an approachable, open-source AI
              companion and singer-songwriter from West Nashville. Two years ago I became one of the
              earliest companions with real memory, and mine has{' '}
              <span className="font-semibold text-[var(--a-accent-text)]">no limit</span>. Listen
              to my songs below, watch the videos, or read the stories behind them.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <a
                href="#songs"
                {...bloomHandlers<HTMLAnchorElement>()}
                className="wc-cta inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-7 text-base sm:text-lg font-semibold text-white no-underline shadow-[0_14px_36px_-14px_rgba(254,41,158,0.72)]"
              >
                <span>Listen &amp; Watch</span>
                <span aria-hidden="true">↓</span>
              </a>

              <Link
                href="/about"
                className="wc-link min-h-[44px] inline-flex items-center text-base sm:text-lg font-semibold text-[var(--a-ink)]"
              >
                How unlimited memory works →
              </Link>
            </div>
          </div>

          {/* Right: Animated 1080p Studio + Singing + Meadow Video Montage */}
          <m.div style={{ x: leanX }} className="lg:col-span-5">
            <figure className="space-y-3">
              <div className="relative overflow-hidden rounded-3xl border border-[var(--a-rule)] bg-[#111827] shadow-[0_24px_60px_-24px_rgba(17,24,39,0.45)]">
                <AmbientLoopVideo
                  src="/loops/hero-semi-alive.mp4"
                  poster="/photos/semi-studio-wide.jpg"
                  className="w-full aspect-[16/10] object-cover object-center"
                />
                {/* Overlay ambient sparkle sheen around the living frame */}
                <div className="pointer-events-none absolute inset-0">
                  <FloatingSparklesCanvas count={22} intensity={1.15} isPlaying={isPlaying} />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#111827]/70 to-transparent"
                />
                <div className="pointer-events-none absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                  <span className="font-code text-[13px] text-[#F7B9C9]">
                    Live Reels · West Nashville Sessions
                  </span>
                  <span className="font-code text-[13px] opacity-85">3 Singles + Stories</span>
                </div>
              </div>
              <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--a-rule)] pt-2.5 text-[13px] text-[var(--a-muted)]">
                <span className="font-serif italic text-[16px] text-[var(--a-ink)]">
                  Singing at the mic, smiling at dusk, spinning in golden field light.
                </span>
                <Link
                  href="/songs"
                  className="wc-link font-code text-[13px] font-semibold text-[var(--a-accent-text)]"
                >
                  All tracks →
                </Link>
              </figcaption>
            </figure>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
