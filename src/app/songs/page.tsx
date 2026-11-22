import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import FeaturedSongsSection from '@/components/sections/FeaturedSongsSection';
import Closing from '@/components/sections/Closing';
import { FORTHCOMING_TRACKS, SEMI_TRACKS } from '@/data/semi-songs';
import { buildSongsIndexJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Songs & Stories — I/O',
  description:
    `Stream all ${SEMI_TRACKS.length} indie-folk singles by Semi (; - ]), watch the official music videos, read the story & guitar chords behind each song, and download free 320 kbps MP3s.`,
  alternates: {
    canonical: '/songs',
  },
  openGraph: {
    title: 'Songs & Stories — I/O · Semi (; - ])',
    description:
      `All ${SEMI_TRACKS.length} singles from I/O: watch the videos, read lyric stories & guitar chords, and download free 320 kbps MP3s.`,
    url: `${SITE_URL}/songs`,
    type: 'website',
  },
};

export default function SongsIndexPage() {
  const jsonLd = buildSongsIndexJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <FeaturedSongsSection eyebrow="Songs" showAllFeatured />

        <section aria-labelledby="forthcoming-title" className="border-t border-[var(--a-rule)] bg-[var(--a-surface)] py-16 sm:py-28">
          <div className="mx-auto grid max-w-[1400px] gap-8 sm:gap-10 px-5 sm:px-8 lg:px-12 lg:grid-cols-12">
            <div className="lg:col-span-4 min-w-0">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">Coming next</p>
              <h2 id="forthcoming-title" className="mt-3 sm:mt-4 font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)]">
                The rest of <span className="font-serif italic font-normal">I/O.</span>
              </h2>
            </div>
            <ol className="lg:col-span-8 min-w-0 divide-y divide-[var(--a-rule)] border-y border-[var(--a-rule)]">
              {FORTHCOMING_TRACKS.map((ft) => (
                <li key={ft.number} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 py-4 sm:py-5 sm:grid-cols-[3rem_1fr_1.4fr] sm:gap-x-4 sm:items-baseline">
                  <span className="font-code text-[14px] text-[var(--a-muted)]">{ft.number}</span>
                  <span className="font-display text-xl sm:text-2xl font-bold text-[var(--a-ink)]">{ft.title}</span>
                  <span className="col-start-2 sm:col-start-3 text-[15px] leading-relaxed text-[var(--a-muted)]">{ft.note}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Closing
          image="/photos/gallery-brick-walk.jpg"
          alt="Semi walking down a tree-lined brick sidewalk carrying a notebook."
          topFill="#F3EFE9"
        />
      </main>
      <SiteFooter />
    </>
  );
}
