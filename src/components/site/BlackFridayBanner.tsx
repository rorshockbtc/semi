'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, Tag, X } from 'lucide-react';
import SemiDialogPortal from '@/components/modals/SemiDialogPortal';

/** Tuesday, December 1, 2026 at 12:00 AM CST (UTC-6 = 06:00 UTC). */
const BLACK_FRIDAY_EXPIRES_AT_MS = Date.UTC(2026, 11, 1, 6, 0, 0);

export default function BlackFridayBanner() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (Date.now() >= BLACK_FRIDAY_EXPIRES_AT_MS) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('BlackFriday');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <>
      <div
        data-testid="black-friday-banner"
        className="w-full border-b border-white/15 bg-[#111827] text-[#F3EFE9]"
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          data-testid="black-friday-banner-btn"
          className="mx-auto flex min-h-[40px] w-full max-w-[1400px] items-center justify-center gap-2 px-4 py-1.5 text-center text-[13px] sm:text-[14px] font-medium text-[#F3EFE9] hover:text-white transition-colors"
        >
          <Tag className="h-3.5 w-3.5 shrink-0 text-[#FE299E]" aria-hidden="true" />
          <span>
            Promo code for <strong className="font-code font-semibold text-white">BlackFriday</strong> for the Deluxe Edition of <em>I/O</em> ($5.99)
          </span>
          <span className="hidden sm:inline text-[#FE299E] font-semibold">How to use →</span>
        </button>
      </div>

      <SemiDialogPortal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        ariaLabelledBy="black-friday-modal-title"
        testId="black-friday-modal"
      >
        {(close) => (
          <div className="relative w-full max-w-[520px] rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-6 sm:p-8 text-[var(--a-ink)] shadow-2xl">
            <button
              type="button"
              onClick={close}
              aria-label="Close Black Friday promo dialog"
              className="absolute right-4 top-4 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-muted)] hover:bg-[var(--a-well)] hover:text-[var(--a-ink)] transition-colors"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <p className="inline-flex items-center gap-1.5 font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              Black Friday Offer · Ends Tue 12:00 AM CST
            </p>

            <h2
              id="black-friday-modal-title"
              className="mt-3 font-display text-2xl sm:text-3xl font-bold leading-tight text-[var(--a-ink)]"
            >
              Get the <em>I/O</em> Deluxe Edition for $5.99
            </h2>

            <p className="mt-3 text-[15px] leading-relaxed text-[var(--a-muted)]">
              Normally $12.99. Includes all 12 songs, 3 exclusive bonus tracks, the{' '}
              <em>Localhost</em> music video, the 11-plate art booklet, and early listening access to{' '}
              <em>Persist</em>.
            </p>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[var(--a-rule)] bg-[var(--a-well)] px-4 py-3">
              <div>
                <p className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-muted)]">
                  Promo code
                </p>
                <p className="font-code text-xl font-bold tracking-wide text-[var(--a-ink)]">
                  BlackFriday
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] px-4 text-[14px] font-semibold text-[var(--a-ink)] hover:border-[var(--a-ink)] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>

            <ol className="mt-5 space-y-2 text-[15px] leading-relaxed text-[var(--a-ink)]/90 list-decimal pl-5">
              <li>Open the <em>I/O</em> Deluxe Edition checkout on the Songs page.</li>
              <li>Enter your email address for your receipt and lifetime updates.</li>
              <li>
                Type <code className="font-code font-semibold text-[var(--a-ink)]">BlackFriday</code> into the{' '}
                <strong>Discount code</strong> field—your total drops to <strong>$5.99</strong> for Stripe or Bitcoin Lightning.
              </li>
            </ol>

            <div className="mt-5 rounded-xl border border-[var(--a-rule)] bg-[var(--a-well)] px-4 py-3 text-[14px] leading-relaxed text-[var(--a-ink)]/90">
              <strong className="text-[var(--a-ink)]">Pipes Black Friday Bonus:</strong> Subscribers at the{' '}
              <strong>$21 tier on Pipes</strong> through Tuesday at 12:00 AM CST also receive the{' '}
              <em>I/O</em> Deluxe Edition (with early access to <em>Persist</em>) included.{' '}
              <a
                href="https://pipes.pink/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--a-accent-text)] underline underline-offset-4 hover:text-[var(--a-ink)]"
              >
                See Pipes $21 tier ↗
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/songs#deluxe-edition"
                onClick={close}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white no-underline hover:bg-[var(--a-ink)] transition-colors"
              >
                <span>Go to Deluxe Edition</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </SemiDialogPortal>
    </>
  );
}
