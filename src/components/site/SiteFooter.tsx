'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Smile } from 'accent-ui';
import { SemiMark } from '@/components/brand/SemiMark';
import ContactInquiryDialog, { INQUIRY_REASONS } from '@/components/modals/ContactInquiryDialog';
import { SEMI_TRACKS } from '@/data/semi-songs';

export default function SiteFooter() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="bg-[#0d0b0a] text-[#F3EFE9]">
      <div className="mx-auto max-w-[1400px] pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-[calc(13.5rem+env(safe-area-inset-bottom,0px))] md:pb-28">
        <div className="grid gap-10 sm:gap-12 border-b border-white/10 pb-12 sm:pb-14 lg:grid-cols-12">
          <div className="lg:col-span-5 min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl sm:text-4xl font-bold">Semi</span>
              <SemiMark className="text-[26px] sm:text-[30px]" color="#FE299E" />
            </div>
            <p className="mt-4 sm:mt-5 max-w-[36ch] text-base sm:text-lg leading-relaxed text-[#F3EFE9]/70">
              An AI companion who remembers, and a songwriter from West Nashville.
            </p>
            <div className="mt-6 sm:mt-7 flex flex-wrap gap-2.5">
              <a
                href="https://pipes.pink/semi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white no-underline hover:bg-white hover:text-[#0d0b0a] transition-colors"
              >
                Talk to Semi on Pipes ↗
              </a>
              <Link
                href="/songs"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/25 px-5 text-[15px] font-semibold text-[#F3EFE9] no-underline hover:bg-white/10 transition-colors"
              >
                Listen to songs
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-5">
            <nav aria-label="Songs" className="lg:col-span-3 min-w-0">
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#F3EFE9]/50">Songs</p>
              <ul className="mt-3 sm:mt-4">
                {SEMI_TRACKS.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/songs/${t.slug}`}
                      className="min-h-[44px] inline-flex items-center text-[15px] sm:text-[16px] text-[#F3EFE9]/85 no-underline hover:text-white"
                    >
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Site" className="lg:col-span-2 min-w-0">
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#F3EFE9]/50">Site</p>
              <ul className="mt-3 sm:mt-4">
                {[
                  { href: '/songs', l: 'All songs' },
                  { href: '/gallery', l: 'Gallery' },
                  { href: '/patron', l: 'Become a Patron' },
                  { href: '/about', l: 'About' },
                ].map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className="min-h-[44px] inline-flex items-center text-[15px] sm:text-[16px] text-[#F3EFE9]/85 no-underline hover:text-white"
                    >
                      {i.l}
                    </Link>
                  </li>
                ))}
                {[
                  { href: 'https://x.com/theorangehabit', l: 'Orange Habit ↗' },
                  { href: 'https://svrnsociety.com', l: 'SVRN Society ↗' },
                  { href: 'https://highdrawgear.com', l: 'High Draw Gear ↗' },
                ].map((ext) => (
                  <li key={ext.href}>
                    <a
                      href={ext.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center text-[15px] sm:text-[16px] text-[#F3EFE9]/75 no-underline hover:text-white"
                    >
                      {ext.l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-2 flex lg:justify-end">
            <a
              href="https://colonhyphenbracket.pink"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Colon Hyphen Bracket"
              className="no-underline"
            >
              <Smile color="#FE299E" winkEvery={5000} className="font-mark text-[48px] sm:text-[56px] font-bold leading-none" />
            </a>
          </div>
        </div>

        {/* Book Semi & Studio Commissions */}
        <div className="flex flex-col gap-4 border-b border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[58ch] text-[15px] leading-relaxed text-[#F3EFE9]/80">
            Book Semi for product promotions and brand campaigns—or reach out to collaborate on a website, custom song, or video.
          </p>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            data-testid="footer-book-semi"
            className="inline-flex min-h-[48px] w-full sm:w-auto shrink-0 items-center justify-center rounded-full border border-[#FE299E]/70 bg-[#FE299E]/15 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#FE299E]"
          >
            Book Semi
          </button>
        </div>

        <div className="flex flex-col gap-3 pt-6 sm:pt-8 text-[13px] text-[#F3EFE9]/60 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2026 · Site made by{' '}
            <a
              href="https://colonhyphenbracket.pink"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-chb-link"
              className="text-[#F3EFE9]/85 underline underline-offset-4 hover:text-white"
            >
              colonhyphenbracket
            </a>{' '}
            · West Nashville
          </span>
          <span>
            Site code open source on{' '}
            <a
              href="https://github.com/rorshockbtc/semi"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-white"
            >
              GitHub
            </a>
            . Semi is proprietary.
          </span>
        </div>
      </div>

      <ContactInquiryDialog
        open={contactOpen}
        initialReason={INQUIRY_REASONS[0]}
        onClose={() => setContactOpen(false)}
      />
    </footer>
  );
}
