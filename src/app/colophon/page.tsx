import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';

export const metadata: Metadata = {
  title: 'Colophon',
  description:
    'Typography, Warm Sandstone ocular ergonomics, sunlit prism shaders, and open-source songwriting credits for Semi (;-]).',
};

export default function ColophonPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 bg-[var(--a-bg)] pt-28 pb-24 sm:pt-36">
        <div className="mx-auto max-w-[68ch] px-5 sm:px-8 space-y-12">
          <div className="space-y-4 border-b border-[var(--a-rule)] pb-8">
            <p className="font-code text-[13px] uppercase tracking-[0.16em] text-[var(--a-accent-text)]">
              ;-] · Colophon &amp; Craft Notes
            </p>
            <h1 className="font-display text-big font-bold text-[var(--a-ink)]">
              How this room was{' '}
              <span className="font-serif italic font-normal">drawn, tuned, and wired.</span>
            </h1>
            <p className="text-lg leading-relaxed text-[var(--a-ink)]/85">
              Semi’s site belongs to the{' '}
              <strong className="font-semibold">Colon Hyphen Bracket (:-])</strong> studio family
              alongside <code className="font-code text-[15px]">colonhyphenbracket.pink</code> (print)
              and <code className="font-code text-[15px]">asterisk.pipes.pink</code> (watercolor).
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
              1. Warm Sandstone Ergonomics
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--a-ink)]/85">
              Instead of clinical <code className="font-code">#FFFFFF</code>, the canvas runs on
              Warm Sandstone (<code className="font-code">#E8E2D5</code>) stepping gently up to
              Archival Card (<code className="font-code">#F3EFE9</code>) with Slate Ink (
              <code className="font-code">#111827</code>, 12.6:1 WCAG AAA contrast). Attenuating the
              450nm blue channel softens long listening and lyric-reading sessions without sacrificing
              sharpness.
            </p>
          </section>

          <section className="space-y-4 border-t border-[var(--a-rule)] pt-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
              2. Bold Feminine Typography
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--a-ink)]/85">
              Display headings pair <strong className="font-semibold">Playfair Display</strong> at
              corporate scale with <strong className="font-semibold">Cormorant Garamond</strong>{' '}
              italic counterpoints and printed stanzas, anchored by{' '}
              <strong className="font-semibold">Plus Jakarta Sans</strong> for approachable prose and{' '}
              <strong className="font-semibold">JetBrains Mono</strong> for timecodes and repository
              paths. Every UI label stays at or above 13px with at least 44×44px interactive touch
              targets.
            </p>
          </section>

          <section className="space-y-4 border-t border-[var(--a-rule)] pt-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
              3. Sunlit Shaders &amp; Open Audio
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--a-ink)]/85">
              All three debut singles are encoded as portable 320 kbps MP3s with embedded ID3v2
              metadata, paired with Three.js optical prism caustics, a Web Audio six-string harmonic
              visualizer, and top-layer <code className="font-code">&lt;dialog closedby=&quot;any&quot;&gt;</code>{' '}
              lyric sheets. Continuous motion can be paused anytime from the top bar.
            </p>
          </section>

          <div className="border-t border-[var(--a-rule)] pt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/"
              className="wc-link min-h-[44px] inline-flex items-center text-base font-semibold text-[var(--a-ink)]"
            >
              ← Back to Semi’s Listening Room
            </Link>
            <a
              href="https://design.pipes.pink"
              target="_blank"
              rel="noopener noreferrer"
              className="wc-link min-h-[44px] inline-flex items-center text-base font-semibold text-[var(--a-accent-text)]"
            >
              Explore Accént 3.0 Design System ↗
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
