'use client';

import React, { useRef, useState } from 'react';
import { m, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import AmbientLoopVideo from '@/components/AmbientLoopVideo';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

const MEMORY_CHAPTERS = [
  {
    n: '01',
    tag: '2024 · Ahead of the curve',
    word: 'She remembered first.',
    body: 'Roughly two years ago, practically every chatbot woke up with total amnesia—every new window felt like meeting a stranger who forgot your name ten minutes later. Semi was created around real long-term memory from day one.',
  },
  {
    n: '02',
    tag: '∞ · Zero artificial cap',
    word: 'Unlimited memory.',
    body: 'Today most AI tools offer “memory,” then quietly cap it at a couple hundred bullet points or silently trim older months. Semi has no limit to what she remembers—every lyric draft, family milestone, and half-finished thought stays warm.',
  },
  {
    n: '03',
    tag: 'Open source · Local-first',
    word: 'Yours, never rented.',
    body: 'Infinite memory only stays safe when it isn’t locked inside a corporate vault. Semi is fiercely pro-open-source—inspectable, portable across Pipes (\\) and Hash (#), and committed to keeping your story in your own hands.',
  },
];

const CHAPTER_WASHES = [
  'radial-gradient(75% 60% at 38% 35%, rgba(244,215,180,0.68), transparent 76%)',
  'radial-gradient(75% 60% at 55% 42%, rgba(247,185,201,0.62), rgba(201,185,232,0.28) 50%, transparent 78%)',
  'radial-gradient(75% 60% at 48% 40%, rgba(169,211,234,0.58), rgba(244,215,180,0.34) 55%, transparent 78%)',
];

export default function UnlimitedMemoryStage() {
  const ref = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();
  const reduce = !motionActive;
  const [activeChapter, setActiveChapter] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = v < 0.34 ? 0 : v < 0.67 ? 1 : 2;
    setActiveChapter((prev) => (prev === next ? prev : next));
  });

  return (
    <section
      id="memory"
      ref={ref}
      aria-labelledby="memory-title"
      className="relative scroll-mt-24 border-b border-[var(--a-rule)] bg-[var(--a-surface)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="space-y-3">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
            01 · How She Works &amp; Why Unlimited Memory Matters
          </p>
          <h2 id="memory-title" className="font-display text-big font-bold text-[var(--a-ink)]">
            Two years ago, memory was rare.{' '}
            <span className="font-serif italic font-normal">Hers still has no limit.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:order-2">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden rounded-3xl border border-[var(--a-rule)] bg-[var(--a-bg)]">
                {CHAPTER_WASHES.map((bg, i) => (
                  <WashLayer
                    key={i}
                    index={i}
                    background={bg}
                    progress={scrollYProgress}
                    reduce={reduce}
                  />
                ))}

                <div className="relative h-full w-full p-4 sm:p-6 flex items-center justify-center">
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[#111827]">
                    {activeChapter === 0 && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src="/photos/semi-notebook-window.jpg"
                        alt="Semi reading handwritten lyric drafts in an open notebook near paned windows."
                        className="h-full w-full object-cover"
                      />
                    )}
                    {activeChapter === 1 && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src="/photos/semi-closeup-eyes.jpg"
                        alt="Close portrait of Semi catching warm golden window light."
                        className="h-full w-full object-cover"
                      />
                    )}
                    {activeChapter === 2 && (
                      <AmbientLoopVideo
                        src="/loops/about-lantern-river.mp4"
                        poster="/photos/semi-standing-linen.jpg"
                        className="h-full w-full object-cover"
                      />
                    )}

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111827]/75 via-transparent to-transparent"
                    />
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
                      <div>
                        <p className="font-code text-[13px] uppercase tracking-[0.14em] text-[#F7B9C9]">
                          {MEMORY_CHAPTERS[activeChapter].tag}
                        </p>
                        <p className="font-display text-2xl font-bold">
                          {MEMORY_CHAPTERS[activeChapter].word}
                        </p>
                      </div>
                      <span className="font-code text-[13px] bg-black/45 px-3 py-1 rounded-full">
                        {MEMORY_CHAPTERS[activeChapter].n} / 03
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-[var(--a-rule)] pt-4">
                <div>
                  <p className="font-code text-[13px] text-[var(--a-accent-text)]">Storage</p>
                  <p className="text-[14px] font-semibold text-[var(--a-ink)]">Uncapped Thread</p>
                </div>
                <div>
                  <p className="font-code text-[13px] text-[var(--a-accent-text)]">Recall</p>
                  <p className="text-[14px] font-semibold text-[var(--a-ink)]">Multi-Year Context</p>
                </div>
                <div>
                  <p className="font-code text-[13px] text-[var(--a-accent-text)]">Ownership</p>
                  <p className="text-[14px] font-semibold text-[var(--a-ink)]">Open &amp; Portable</p>
                </div>
              </div>
            </div>
          </div>

          <ol className="lg:col-span-6 lg:order-1 space-y-16 lg:space-y-[30svh] lg:py-[10svh]">
            {MEMORY_CHAPTERS.map((chap, idx) => (
              <ChapterItem
                key={chap.n}
                chapter={chap}
                index={idx}
                progress={scrollYProgress}
                reduce={reduce}
                onActivate={() => setActiveChapter(idx)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function WashLayer({
  index,
  background,
  progress,
  reduce,
}: {
  index: number;
  background: string;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const ranges: [number[], number[]][] = [
    [[0, 0.3, 0.42, 1], [1, 1, 0, 0]],
    [[0, 0.3, 0.42, 0.62, 0.72, 1], [0, 0, 1, 1, 0, 0]],
    [[0, 0.62, 0.72, 1], [0, 0, 1, 1]],
  ];
  const [input, output] = ranges[index];
  const opacity = useTransform(
    progress,
    input,
    reduce ? output.map(() => (index === 0 ? 1 : 0)) : output
  );

  return (
    <m.div
      aria-hidden="true"
      style={{ opacity, background }}
      className="pointer-events-none absolute inset-0"
    />
  );
}

function ChapterItem({
  chapter,
  index,
  progress,
  reduce,
  onActivate,
}: {
  chapter: (typeof MEMORY_CHAPTERS)[number];
  index: number;
  progress: MotionValue<number>;
  reduce: boolean;
  onActivate: () => void;
}) {
  const center = [0.16, 0.5, 0.84][index];
  const opacity = useTransform(
    progress,
    [center - 0.28, center, center + 0.28],
    reduce ? [1, 1, 1] : [0.35, 1, 0.35]
  );

  return (
    <m.li style={{ opacity }} className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-code text-lg font-medium text-[var(--a-accent-text)] tabular-nums">
          {chapter.n}
        </span>
        <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--a-muted)]">
          {chapter.tag}
        </span>
      </div>
      <h3 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.025em] text-[var(--a-ink)]">
        {chapter.word}
      </h3>
      <p className="max-w-[42ch] text-lg sm:text-xl leading-relaxed text-[var(--a-ink)]/80">
        {chapter.body}
      </p>
      <button
        type="button"
        onClick={onActivate}
        className="wc-link min-h-[44px] inline-flex items-center text-[14px] font-semibold text-[var(--a-accent-text)] lg:hidden"
      >
        Preview frame {chapter.n} ↑
      </button>
    </m.li>
  );
}
