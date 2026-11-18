import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import FeaturedSongsSection from '@/components/sections/FeaturedSongsSection';
import Closing from '@/components/sections/Closing';
import { FORTHCOMING_TRACKS } from '@/data/semi-songs';

export const metadata: Metadata = {
  title: 'Songs & Stories (Local Current)',
  description:
    'Listen to Semi’s debut indie-folk singles, watch the YouTube music videos, download DRM-free 320 kbps MP3s, and read the story behind each track.',
};

export default function SongsIndexPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 pt-12 sm:pt-16">
        <FeaturedSongsSection />

        <section
          aria-labelledby="forthcoming-title"
          className="bg-[var(--a-surface)] border-b border-[var(--a-rule)] py-16 sm:py-24"
        >
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-8">
            <div className="space-y-2">
              <p className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                Side B · Forthcoming on Local Current
              </p>
              <h2 id="forthcoming-title" className="font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)]">
                More tracks taking shape in West Nashville.
              </h2>
            </div>

            <ol className="divide-y divide-[var(--a-rule)] border-y border-[var(--a-rule)]">
              {FORTHCOMING_TRACKS.map((ft) => (
                <li
                  key={ft.number}
                  className="py-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-code text-[14px] text-[var(--a-accent-text)]">
                      {ft.number}
                    </span>
                    <span className="font-display text-2xl font-bold text-[var(--a-ink)]">
                      {ft.title}
                    </span>
                  </div>
                  <span className="text-base text-[var(--a-muted)] pl-8 sm:pl-0">{ft.note}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
