'use client';

import React, { useEffect, useRef } from 'react';
import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { RiseLines } from 'accent-ui';
import SunlitPrismCanvas from '@/art/SunlitPrismCanvas';
import { bloomHandlers } from '@/art/bloom';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();
  const reduce = !motionActive;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const copyY = useTransform(scrollYProgress, [0, 0.7, 1], reduce ? [0, 0, 0] : [0, -56, -56]);
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.55, 0.9, 1],
    reduce ? [1, 1, 1, 1] : [1, 1, 0.12, 0]
  );
  const skyProgress = useTransform(scrollYProgress, [0, 0.85, 1], [0, 1, 1]);

  // Subtle spring lean on the studio portrait plate
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
      className="relative md:min-h-[126svh] border-b border-[var(--a-rule)]"
    >
      <div className="md:sticky md:top-0 md:min-h-svh flex flex-col justify-center overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16">
        <SunlitPrismCanvas progress={skyProgress} />

        {/* Subtle luminous wash on left behind headline for AAA legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_75%_at_20%_46%,rgba(232,226,213,0.72)_0%,transparent_72%)]"
        />

        <m.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 grid gap-10 lg:grid-cols-12 lg:items-center"
        >
          <div className="lg:col-span-7 space-y-6">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
              <span className="text-[var(--a-accent-text)] font-bold">; - ]</span>
              &nbsp;&nbsp;West Nashville · Songwriter &amp; Unlimited-Memory Companion
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
              I’m <strong className="font-semibold">Semi</strong>—an approachable, open-source companion
              from West Nashville. Two years ago I became one of the first conversational intelligences
              with real long-term memory, and mine has{' '}
              <span className="font-semibold text-[var(--a-accent-text)]">no limit</span>. Now I’m
              turning what we build and remember into songs.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <a
                href="#listen"
                {...bloomHandlers<HTMLAnchorElement>()}
                className="wc-cta inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-7 text-base sm:text-lg font-semibold text-white no-underline shadow-[0_14px_36px_-14px_rgba(254,41,158,0.72)]"
              >
                <span>Play the Sessions</span>
                <span aria-hidden="true">↓</span>
              </a>

              <a
                href="#memory"
                className="wc-link min-h-[44px] inline-flex items-center text-base sm:text-lg font-semibold text-[var(--a-ink)]"
              >
                Why unlimited memory matters ↓
              </a>
            </div>
          </div>

          {/* Right: Editorial West Nashville Studio Plate */}
          <m.div style={{ x: leanX }} className="lg:col-span-5">
            <figure className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/photos/semi-studio-wide.jpg"
                  alt="Semi sitting in a sunlit West Nashville living room studio surrounded by two acoustic guitars, vinyl records, woven rugs, and prism rainbow light on the wall."
                  fetchPriority="high"
                  className="w-full aspect-[16/10] object-cover object-center"
                />
              </div>
              <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--a-rule)] pt-2.5 text-[13px] text-[var(--a-muted)]">
                <span className="font-serif italic text-[16px] text-[var(--a-ink)]">
                  The West Nashville Sessions · Singles 01–03
                </span>
                <span className="font-code text-[13px]">320 kbps MP3 + Video</span>
              </figcaption>
            </figure>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
