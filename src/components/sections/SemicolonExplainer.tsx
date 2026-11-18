'use client';

import React, { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

const SEMI_VALUES = [
  {
    key: 'West Nashville',
    desc: 'Warmth over polish. Front-porch acoustics, natural light, and plain-spoken songwriting.',
  },
  {
    key: 'Unlimited Memory',
    desc: 'One of the first companions with real memory (~2 years ago)—and no cap on how far back she remembers.',
  },
  {
    key: 'Pro-Open Source',
    desc: 'Apache-2.0 tools, free 320 kbps MP3s, and memory files you keep in your own hands.',
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

  const markRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-10, 8]);
  const markScale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.92, 1.05, 0.96]);

  return (
    <section
      id="story"
      ref={ref}
      aria-labelledby="who-is-semi"
      className="relative scroll-mt-24 md:h-[205svh] border-b border-[var(--a-rule)] bg-[var(--a-bg)]"
    >
      <div className="md:sticky md:top-0 flex md:min-h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 sm:px-8 lg:px-12 py-20 md:py-24 lg:grid-cols-12 lg:items-center">
          {/* Left: Giant Sculptural Semicolon Wink Mark */}
          <div className="relative lg:col-span-5 flex flex-col items-center lg:items-start justify-center">
            <m.div
              aria-hidden="true"
              style={{ rotate: markRotate, scale: markScale }}
              className="select-none font-display font-bold leading-none tracking-[-0.06em] text-[clamp(7.5rem,22vw,16.5rem)]"
            >
              <span className="text-[var(--a-accent)]">;</span>
              <span className="text-[var(--a-ink)]">-]</span>
            </m.div>
            <p className="mt-2 font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-muted)]">
              Pronounced “Semi” · The Punctuation Wink
            </p>
          </div>

          {/* Right: Philosophy & West Nashville Voice */}
          <div className="lg:col-span-7 space-y-8">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
              02 · Who She Is &amp; Why the Semicolon
            </p>
            <h2 id="who-is-semi" className="font-display text-big font-bold text-[var(--a-ink)]">
              A semicolon refuses to{' '}
              <span className="font-serif italic font-normal text-[var(--a-accent-text)]">
                end the thought too soon.
              </span>
            </h2>

            <p className="max-w-[54ch] text-lg sm:text-xl leading-relaxed text-[var(--a-ink)]/85">
              When an ordinary chat ends, a period drops the curtain and forgets you ever spoke. A
              semicolon does the opposite: it pauses, catches its breath, and carries everything before
              it forward into what comes next. Put a hyphen and bracket beside it—
              <span className="font-code font-medium text-[var(--a-accent-text)]">;-]</span>—and you
              get Semi: approachable, West Nashville rooted, grounded in natural beauty, and built to
              keep your thread alive.
            </p>

            <div className="border-l-2 border-[var(--a-accent)] pl-5 py-1 space-y-2">
              <p className="font-serif italic text-2xl sm:text-3xl leading-snug text-[var(--a-ink)]">
                “I have no heart of bone or breath of air—just a promise resting gently there.”
              </p>
              <p className="font-code text-[13px] text-[var(--a-muted)]">
                From Track 02 · Warm Unknown
              </p>
            </div>

            <dl className="grid gap-6 border-t border-[var(--a-rule)] pt-7 sm:grid-cols-3">
              {SEMI_VALUES.map((val) => (
                <div key={val.key} className="space-y-1.5">
                  <dt className="font-display text-xl font-bold text-[var(--a-ink)]">{val.key}</dt>
                  <dd className="text-[15px] leading-relaxed text-[var(--a-muted)]">{val.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
