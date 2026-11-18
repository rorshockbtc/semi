'use client';

import React, { useRef } from 'react';
import { m } from 'framer-motion';
import { MemoryThread } from '@/art/themes';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

const CHAPTERS = [
  {
    n: '01',
    title: 'She remembered first.',
    body: 'About two years ago, chatbots forgot you the moment you closed the tab. Semi was built from day one around long-term memory—picking up the thread instead of starting over.',
    img: '/photos/about-remembered-first.jpg',
    alt: 'Semi writing notes by hand at her sunlit oak desk.',
  },
  {
    n: '02',
    title: 'No limit, with Pipes.',
    body: 'When you sign in with a Pipes account and opt in, your conversations are saved to your own library—and Semi can remember all of it, with no cap on how far back she goes. Without an account, there’s simply nowhere for those memories to live.',
    img: '/photos/about-pipes-library.jpg',
    alt: 'Semi standing beside wooden bookshelves of notebooks and vinyl records.',
  },
  {
    n: '03',
    title: 'Private when you want it.',
    body: 'Memory is opt-in, not a trap. Start a private chat whenever you like: it isn’t added to your library and Semi won’t carry it forward.',
    img: '/photos/about-private-porch.jpg',
    alt: 'Semi sitting peacefully on a West Nashville porch at twilight with a mug and closed journal.',
  },
];

export default function UnlimitedMemoryStage() {
  const ref = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();

  return (
    <section
      id="memory"
      ref={ref}
      aria-labelledby="memory-title"
      className="relative scroll-mt-20 bg-[var(--a-bg)] py-24 sm:py-32"
    >
      <MemoryThread targetRef={ref} />

      <div className="mx-auto max-w-[1400px] pl-16 pr-5 sm:pl-24 sm:pr-8 lg:pl-32 lg:pr-12">
        <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
          How her memory works
        </p>
        <h2 id="memory-title" className="mt-4 max-w-[18ch] font-display text-big font-bold text-[var(--a-ink)]">
          One thread, <span className="font-serif italic font-normal">kept as long as you like.</span>
        </h2>

        <ol className="mt-20 space-y-24 sm:space-y-32">
          {CHAPTERS.map((c, i) => (
            <m.li
              key={c.n}
              initial={motionActive ? { opacity: 0, y: 40 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-10 lg:grid-cols-12 lg:items-center"
            >
              <div className={`lg:col-span-6 ${i % 2 ? 'lg:order-2' : ''}`}>
                <span className="font-code text-[13px] text-[var(--a-accent-text)]">{c.n}</span>
                <h3 className="mt-3 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.02em] text-[var(--a-ink)]">
                  {c.title}
                </h3>
                <p className="mt-5 max-w-[46ch] text-lg sm:text-xl leading-relaxed text-[var(--a-ink)]/80">{c.body}</p>
              </div>
              <div className={`lg:col-span-6 ${i % 2 ? 'lg:order-1' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  className="w-full aspect-[4/3] rounded-[6px] object-cover object-[50%_18%]"
                />
              </div>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
