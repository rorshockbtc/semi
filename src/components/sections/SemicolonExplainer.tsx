'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { m, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

const SEMI_PILLARS = [
  {
    key: 'West Nashville',
    desc: 'Warmth over polish. Acoustic guitars, natural sunlight, and plain-spoken songs.',
  },
  {
    key: 'Unlimited Memory',
    desc: 'One of the first companions with real memory (~2 years ago)—with zero limit on what stays remembered.',
  },
  {
    key: 'Pro-Open Source',
    desc: 'Apache-2.0 code, free 320 kbps MP3s, and personal memory you keep at home.',
  },
];

export default function SemicolonExplainer() {
  const ref = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();
  const reduce = !motionActive;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const markRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-8, 8]);
  const markScale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.94, 1.06, 0.98]);

  return (
    <section
      id="story"
      ref={ref}
      aria-labelledby="who-is-semi"
      className="relative scroll-mt-24 md:h-[175svh] border-b border-[var(--a-rule)] bg-[var(--a-surface)]"
    >
      <div className="md:sticky md:top-0 flex md:min-h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:px-12 py-20 md:py-24 lg:grid-cols-12 lg:items-center">
          {/* Left: Corporate Bricolage Grotesque ; - ] Mark */}
          <div className="relative lg:col-span-5 flex flex-col items-center lg:items-start justify-center">
            <m.div style={{ rotate: markRotate, scale: markScale }}>
              <SemiMark
                className="text-[clamp(6.5rem,18vw,13.5rem)]"
                color="#FE299E"
                winkEvery={4500}
              />
            </m.div>
            <p className="mt-4 font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-muted)]">
              Semi (; - ]) · The Corporate Punctuation Wink
            </p>
          </div>

          {/* Right: Philosophy & Bridge to Dedicated /about Page */}
          <div className="lg:col-span-7 space-y-8">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
              02 · Who She Is &amp; Unlimited Memory
            </p>
            <h2 id="who-is-semi" className="font-display text-big font-bold text-[var(--a-ink)]">
              A semicolon keeps{' '}
              <span className="font-serif italic font-normal text-[var(--a-accent-text)]">
                the whole conversation alive.
              </span>
            </h2>

            <p className="max-w-[54ch] text-lg sm:text-xl leading-relaxed text-[var(--a-ink)]/85">
              Most chat apps drop a cold period after every session and quietly ration or delete what
              you told them. Two years ago, Semi was built around the opposite idea: an approachable,
              unhurried companion whose memory has{' '}
              <strong className="font-semibold">zero cap</strong>—keeping your life, songs, and
              shared context warm across years.
            </p>

            <dl className="grid gap-6 border-t border-[var(--a-rule)] pt-7 sm:grid-cols-3">
              {SEMI_PILLARS.map((val) => (
                <div key={val.key} className="space-y-1.5">
                  <dt className="font-display text-xl font-bold text-[var(--a-ink)]">{val.key}</dt>
                  <dd className="text-[15px] leading-relaxed text-[var(--a-muted)]">{val.desc}</dd>
                </div>
              ))}
            </dl>

            <div>
              <Link
                href="/about"
                className="wc-link min-h-[44px] inline-flex items-center gap-2 text-lg font-semibold text-[var(--a-ink)]"
              >
                <span>Read how her unlimited memory works &amp; say hello</span>
                <ArrowRight className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
