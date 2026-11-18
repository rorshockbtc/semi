import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { SemiMark } from '@/components/brand/SemiMark';

export const metadata: Metadata = {
  title: 'Colophon',
  description:
    'Typography, Warm Sandstone ocular ergonomics, sunlit prism shaders, sparkle animation, and open-source songwriting credits for Semi (; - ]).',
};

export default function ColophonPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 bg-[var(--a-bg)] pt-28 pb-24 sm:pt-36">
        <div className="mx-auto max-w-[68ch] px-5 sm:px-8 space-y-12">
          <div className="space-y-4 border-b border-[var(--a-rule)] pb-8">
            <p className="inline-flex items-center gap-2 font-code text-[13px] uppercase tracking-[0.16em] text-[var(--a-accent-text)]">
              <SemiMark className="text-[14px]" color="#FE299E" />
              <span>Colophon &amp; Craft Notes</span>
            </p>
            <h1 className="font-display text-big font-bold text-[var(--a-ink)]">
              How this room was{' '}
              <span className="font-serif italic font-normal">drawn, tuned, and wired.</span>
            </h1>
            <p className="text-lg leading-relaxed text-[var(--a-ink)]/85">
              Semi’s site belongs to the{' '}
              <strong className="font-semibold">Colon Hyphen Bracket (: - ])</strong> studio family
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
              450nm blue channel softens long listening and essay-reading sessions without sacrificing
              sharpness.
            </p>
          </section>

          <section className="space-y-4 border-t border-[var(--a-rule)] pt-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
              2. Typography &amp; Corporate Punctuation Mark
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--a-ink)]/85">
              Display headlines pair <strong className="font-semibold">Playfair Display</strong> at
              corporate scale with <strong className="font-semibold">Cormorant Garamond</strong>{' '}
              italic counterpoints and lyric sheets, <strong className="font-semibold">Plus Jakarta Sans</strong>{' '}
              for approachable stories, <strong className="font-semibold">JetBrains Mono</strong> for
              timecodes, and <strong className="font-semibold">Bricolage Grotesque</strong> in Sovereign
              Hot Pink (<code className="font-code">#FE299E</code>) specifically for the spaced{' '}
              <code className="font-code">; - ]</code> and <code className="font-code">: - ]</code>{' '}
              corporate punctuation marks.
            </p>
          </section>

          <section className="space-y-4 border-t border-[var(--a-rule)] pt-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
              3. Sunlit Shaders, Sparkles &amp; Portable Audio
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--a-ink)]/85">
              All three debut singles are encoded as portable 320 kbps MP3s with embedded ID3v2
              metadata playable across every route via a persistent audio dock. Living 1080p film loops,
              Three.js prism caustics, and twinkling bokeh sparkle fields can be paused anytime from the
              top navigation bar.
            </p>
          </section>

          <div className="border-t border-[var(--a-rule)] pt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/"
              className="wc-link min-h-[44px] inline-flex items-center text-base font-semibold text-[var(--a-ink)]"
            >
              ← Back to Semi’s Home
            </Link>
            <Link
              href="/songs"
              className="wc-link min-h-[44px] inline-flex items-center text-base font-semibold text-[var(--a-accent-text)]"
            >
              Browse Songs &amp; Stories →
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
