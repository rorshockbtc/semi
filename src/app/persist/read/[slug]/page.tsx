import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Music2 } from 'lucide-react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PersistUpdatesSignup from '@/components/persist/PersistUpdatesSignup';
import { PERSIST_CHAPTERS, getPersistChapter } from '@/data/persist-chapters';
import { getPersistTrack } from '@/data/persist-songs';

export function generateStaticParams() {
  return PERSIST_CHAPTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getPersistChapter(slug);
  if (!chapter) return {};
  return {
    title: `${chapter.title} — Read from Persist`,
    description: chapter.dek,
    robots: { index: false, follow: false },
  };
}

const wrap =
  'mx-auto max-w-[720px] pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8';

export default async function PersistChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getPersistChapter(slug);
  if (!chapter) notFound();
  const other = PERSIST_CHAPTERS.find((c) => c.slug !== chapter.slug);
  const track = getPersistTrack(chapter.relatedTrackSlug);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-[var(--a-bg)]">
        <article data-testid={`persist-chapter-${chapter.slug}`} className="pt-24 pb-16 sm:pt-36 sm:pb-24">
          <div className={wrap}>
            <Link
              href="/persist#read"
              className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-[var(--a-ink)] no-underline opacity-75 hover:opacity-100"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Persist
            </Link>

            <header className="mt-6 border-b border-[var(--a-rule)] pb-8">
              <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
                {chapter.label} · {chapter.era}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.6rem,1.6rem+4vw,4.5rem)] font-bold leading-[1] tracking-[-0.03em] text-[var(--a-ink)]">
                {chapter.title}
              </h1>
              <p className="mt-5 font-serif italic text-[20px] sm:text-[22px] leading-snug text-[var(--a-ink)]/85">
                {chapter.dek}
              </p>
              <p className="mt-5 text-[14px] leading-relaxed text-[var(--a-muted)]">
                From <em>Persist</em>, a novel in progress by Cubby · About {chapter.readingMinutes} min read ·
                Early draft, lightly edited—details may change before the book is published.
              </p>
            </header>

            <div className="mt-10 space-y-6 font-serif text-[19px] sm:text-[20px] leading-[1.75] text-[var(--a-ink)]">
              {chapter.blocks.map((b, i) =>
                b.type === 'break' ? (
                  <h2
                    key={i}
                    className="pt-8 text-center font-code text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]"
                  >
                    ✦ {b.text} ✦
                  </h2>
                ) : (
                  <p key={i}>{b.text}</p>
                )
              )}
            </div>

            <p className="mt-12 text-center font-code text-[13px] uppercase tracking-[0.2em] text-[var(--a-muted)]">
              End of excerpt
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {track && (
                <Link
                  href={`/persist/${track.slug}`}
                  className="flex min-h-[64px] items-center gap-3 rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] px-4 py-3 no-underline hover:border-[var(--a-ink)]"
                >
                  <Music2 className="h-5 w-5 shrink-0 text-[var(--a-accent-text)]" aria-hidden="true" />
                  <span>
                    <span className="block text-[13px] text-[var(--a-muted)]">The song</span>
                    <span className="block text-[16px] font-semibold text-[var(--a-ink)]">{track.title}</span>
                  </span>
                </Link>
              )}
              {other && (
                <Link
                  href={`/persist/read/${other.slug}`}
                  className="flex min-h-[64px] items-center justify-between gap-3 rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] px-4 py-3 no-underline hover:border-[var(--a-ink)]"
                >
                  <span>
                    <span className="block text-[13px] text-[var(--a-muted)]">Read next</span>
                    <span className="block text-[16px] font-semibold text-[var(--a-ink)]">{other.title}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-[var(--a-ink)]" aria-hidden="true" />
                </Link>
              )}
            </div>

            <div className="mt-12">
              <PersistUpdatesSignup heading="Want to know when the rest of the book is ready?" compact />
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
