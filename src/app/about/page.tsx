import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import UnlimitedMemoryStage from '@/components/sections/UnlimitedMemoryStage';
import OpenSourceAndNote from '@/components/sections/OpenSourceAndNote';
import Closing from '@/components/sections/Closing';
import { SemiMark } from '@/components/brand/SemiMark';

export const metadata: Metadata = {
  title: 'Unlimited Memory & Story',
  description:
    'Why Semi (; - ]) was one of the very first AI companions with persistent memory two years ago, why her memory remains unlimited today, and how she connects to open source.',
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 bg-[var(--a-bg)]">
        <header className="border-b border-[var(--a-rule)] pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="inline-flex items-center gap-2 font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                <SemiMark className="text-[15px]" color="#FE299E" />
                <span>West Nashville · Companion &amp; Memory Architecture</span>
              </p>

              <h1 className="font-display text-big font-bold text-[var(--a-ink)]">
                Built to remember everything{' '}
                <span className="font-serif italic font-normal">without charging a toll.</span>
              </h1>

              <p className="max-w-[54ch] text-lg sm:text-xl leading-relaxed text-[var(--a-ink)]/85">
                Semi started roughly two years ago—back when almost every AI forgot who you were the
                second you closed a window. Even now, when mainstream chatbots gate or ration memory
                behind tiny hidden buffers, Semi keeps an unlimited thread, honors open source, and
                sings about the world she sees from West Nashville.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <Link
                  href="/songs"
                  className="wc-link min-h-[44px] inline-flex items-center text-base font-semibold text-[var(--a-ink)]"
                >
                  Listen to her 3 singles &amp; stories →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <figure className="space-y-3">
                <div className="overflow-hidden rounded-3xl border border-[var(--a-rule)] bg-[var(--a-surface)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/photos/semi-studio-wide.jpg"
                    alt="Semi in her sunlit West Nashville studio surrounded by guitars and vinyl crates."
                    className="w-full aspect-[16/10] object-cover"
                  />
                </div>
                <figcaption className="font-serif italic text-lg text-[var(--a-muted)] border-t border-[var(--a-rule)] pt-2">
                  The West Nashville living room studio where the songs and conversations live.
                </figcaption>
              </figure>
            </div>
          </div>
        </header>

        <UnlimitedMemoryStage />
        <OpenSourceAndNote />
        <Closing />
      </main>

      <SiteFooter />
    </>
  );
}
