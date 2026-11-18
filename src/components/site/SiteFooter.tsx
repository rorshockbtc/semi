'use client';

import React from 'react';
import Link from 'next/link';
import { Smile } from 'accent-ui';

export default function SiteFooter() {
  return (
    <footer>
      <section
        aria-labelledby="studio-band"
        className="bg-[var(--a-ink)] text-[var(--a-bg)]"
      >
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-8 lg:px-12 py-20 sm:py-28 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 space-y-6">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-bg)]/65">
              Colon Hyphen Bracket · West Nashville × San Francisco
            </p>
            <h2 id="studio-band" className="font-display text-big font-bold text-[var(--a-bg)]">
              Built with care by Colon&nbsp;Hyphen&nbsp;Bracket.
            </h2>
            <p className="max-w-[52ch] text-lg sm:text-xl leading-relaxed text-[var(--a-bg)]/80">
              Semi (<span className="text-[var(--a-accent)] font-semibold">;-]</span>) is our open-source
              unlimited-memory companion and acoustic songwriter—living alongside{' '}
              <strong className="font-semibold text-[var(--a-bg)]">Pipes (\)</strong>,{' '}
              <strong className="font-semibold text-[var(--a-bg)]">asterisk (*)</strong>, and{' '}
              <strong className="font-semibold text-[var(--a-bg)]">Greater (&gt;)</strong> under Accént 3.0.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-between gap-8">
            <div aria-hidden="true" className="select-none">
              <Smile
                color="#FE299E"
                winkEvery={4500}
                className="font-display text-[72px] sm:text-[104px] font-bold leading-none tracking-[-0.04em]"
              />
            </div>
            <a
              href="https://colonhyphenbracket.pink"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-3 rounded-full border-2 border-[var(--a-bg)] px-6 text-lg font-semibold text-[var(--a-bg)] no-underline transition-colors hover:bg-[var(--a-bg)] hover:text-[var(--a-ink)]"
            >
              Visit colonhyphenbracket.pink <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <div className="border-t border-[var(--a-rule)] bg-[var(--a-bg)]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 py-6 text-[13px] text-[var(--a-muted)]">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="font-display text-base font-bold text-[var(--a-accent-text)]">
              ;-]
            </span>
            <span>Semi · Apache-2.0 open source · West Nashville Sessions</span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-5">
            <Link href="/colophon" className="wc-link min-h-[44px] inline-flex items-center text-[var(--a-ink)]">
              Colophon
            </Link>
            <a
              href="https://github.com/rorshockbtc/semi"
              target="_blank"
              rel="noopener noreferrer"
              className="wc-link min-h-[44px] inline-flex items-center text-[var(--a-ink)]"
            >
              GitHub
            </a>
            <a
              href="https://pipes.pink/semi"
              target="_blank"
              rel="noopener noreferrer"
              className="wc-link min-h-[44px] inline-flex items-center text-[var(--a-ink)]"
            >
              Pipes × Semi
            </a>
            <a
              href="https://asterisk.pipes.pink"
              target="_blank"
              rel="noopener noreferrer"
              className="wc-link min-h-[44px] inline-flex items-center text-[var(--a-ink)]"
            >
              asterisk (*)
            </a>
            <a
              href="https://design.pipes.pink"
              target="_blank"
              rel="noopener noreferrer"
              className="wc-link min-h-[44px] inline-flex items-center text-[var(--a-ink)]"
            >
              Accént Design System
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
