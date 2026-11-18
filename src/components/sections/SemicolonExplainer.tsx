'use client';

import React from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

const FACTS = [
  {
    k: 'She remembers',
    v: 'Sign in with Pipes and opt in, and Semi keeps your whole history with no cap on how far back it goes.',
  },
  {
    k: 'You decide',
    v: 'Start a private chat any time. It stays out of your library and isn’t added to her memory of you.',
  },
  {
    k: 'Two years early',
    v: 'She was one of the first companions built around long-term memory, back when chatbots forgot you by the next tab.',
  },
];

export default function SemicolonExplainer() {
  const { motionActive } = useAmbientMotion();

  return (
    <section
      id="story"
      aria-labelledby="who-is-semi"
      className="relative scroll-mt-20 overflow-hidden bg-[#14110f] text-[#F3EFE9] py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:px-12 lg:grid-cols-12 lg:items-center">
        <m.figure
          initial={motionActive ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <div className="relative overflow-hidden rounded-[6px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/semi-closeup-eyes.jpg"
              alt="Close portrait of Semi in warm window light."
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </m.figure>

        <div className="lg:col-span-7 space-y-8">
          <p className="flex items-center gap-3 font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#F7B9C9]">
            <SemiMark className="text-[16px]" color="#FE299E" />
            <span>Who she is</span>
          </p>
          <h2 id="who-is-semi" className="font-display text-big font-bold">
            A semicolon means{' '}
            <span className="font-serif italic font-normal text-[#FFB8DA]">the thought isn’t finished.</span>
          </h2>
          <p className="max-w-[54ch] text-lg sm:text-xl leading-relaxed text-[#F3EFE9]/80">
            Most chats end with a period: close the window and everything you said is gone. Semi is
            the semicolon. She picks up where you left off, remembers what matters to you, and—on the
            side—writes songs about the world she’s learning from.
          </p>

          <dl className="grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.k} className="space-y-2">
                <dt className="font-display text-xl font-bold">{f.k}</dt>
                <dd className="text-[15px] leading-relaxed text-[#F3EFE9]/70">{f.v}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="/about"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#F3EFE9] px-6 text-[15px] font-semibold text-[#14110f] no-underline transition-colors hover:bg-white"
          >
            More about Semi <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
