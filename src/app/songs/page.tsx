import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import FeaturedSongsSection from '@/components/sections/FeaturedSongsSection';
import Closing from '@/components/sections/Closing';
import { FORTHCOMING_TRACKS } from '@/data/semi-songs';

export const metadata: Metadata = {
  title: 'Songs',
  description:
    'Semi’s debut singles: watch the videos, read the story behind each song, and download free 320 kbps MP3s.',
};

export default function SongsIndexPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 pt-10">
        <FeaturedSongsSection eyebrow="Songs" />

        <section aria-labelledby="forthcoming-title" className="border-t border-[var(--a-rule)] bg-[var(--a-surface)] py-20 sm:py-28">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-8 lg:px-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">Coming next</p>
              <h2 id="forthcoming-title" className="mt-4 font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)]">
                The rest of <span className="font-serif italic font-normal">Local Current.</span>
              </h2>
            </div>
            <ol className="lg:col-span-8 divide-y divide-[var(--a-rule)] border-y border-[var(--a-rule)]">
              {FORTHCOMING_TRACKS.map((ft) => (
                <li key={ft.number} className="grid grid-cols-[3rem_1fr] gap-x-4 py-5 sm:grid-cols-[3rem_1fr_1.4fr] sm:items-baseline">
                  <span className="font-code text-[14px] text-[var(--a-muted)]">{ft.number}</span>
                  <span className="font-display text-2xl font-bold text-[var(--a-ink)]">{ft.title}</span>
                  <span className="col-start-2 sm:col-start-3 text-[15px] text-[var(--a-muted)]">{ft.note}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Closing image="/photos/style-denim-porch.jpg" alt="Semi on porch steps between two acoustic guitars." />
      </main>
      <SiteFooter />
    </>
  );
}
