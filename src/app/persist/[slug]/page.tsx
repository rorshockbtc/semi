import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PersistTrackClient from '@/components/persist/PersistTrackClient';
import { PERSIST_TRACKS, getPersistTrack } from '@/data/persist-songs';

export function generateStaticParams() {
  return PERSIST_TRACKS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = getPersistTrack(slug);
  if (!track) return {};
  return {
    title: `${track.title} — Persist`,
    description: track.summary,
    robots: { index: false, follow: false },
  };
}

export default async function PersistTrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = PERSIST_TRACKS.findIndex((t) => t.slug === slug);
  if (idx === -1) notFound();
  const track = PERSIST_TRACKS[idx];
  const prevTrack = PERSIST_TRACKS[(idx - 1 + PERSIST_TRACKS.length) % PERSIST_TRACKS.length];
  const nextTrack = PERSIST_TRACKS[(idx + 1) % PERSIST_TRACKS.length];

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PersistTrackClient track={track} prevTrack={prevTrack} nextTrack={nextTrack} />
      </main>
      <SiteFooter />
    </>
  );
}
