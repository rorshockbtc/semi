import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import SongEditionClient from '@/components/songs/SongEditionClient';
import { getTrackBySlug, SEMI_TRACKS } from '@/data/semi-songs';
import { buildSongJsonLd, SITE_URL } from '@/lib/seo';

export function generateStaticParams() {
  return SEMI_TRACKS.map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = getTrackBySlug(slug);
  if (!track) return {};

  const canonicalPath = `/songs/${track.slug}`;
  return {
    title: `${track.title} — Lyrics, Chords, Story & Video`,
    description: `${track.shortSummary} ${track.essaySubtitle}`,
    keywords: [
      track.title,
      `${track.title} lyrics`,
      `${track.title} guitar chords`,
      `${track.title} Semi`,
      ...track.themes,
      'I/O',
      'Semi (; - ])',
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${track.title} — Lyrics, Story & Video · Semi (; - ])`,
      description: track.shortSummary,
      url: `${SITE_URL}${canonicalPath}`,
      type: 'article',
      images: [
        {
          url: track.poster,
          width: 1600,
          height: 900,
          type: 'image/jpeg',
          alt: track.posterAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${track.title} — Semi (; - ])`,
      description: track.shortSummary,
      images: [track.poster],
    },
  };
}

export default async function SongDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = SEMI_TRACKS.findIndex((t) => t.slug === slug);
  if (idx === -1) {
    notFound();
  }

  const track = SEMI_TRACKS[idx];
  const prevTrack = SEMI_TRACKS[(idx - 1 + SEMI_TRACKS.length) % SEMI_TRACKS.length];
  const nextTrack = SEMI_TRACKS[(idx + 1) % SEMI_TRACKS.length];
  const jsonLd = buildSongJsonLd(track);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <SongEditionClient
          track={track}
          prevTrack={prevTrack}
          nextTrack={nextTrack}
        />
      </main>
      <SiteFooter />
    </>
  );
}
