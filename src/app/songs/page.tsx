import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import FeaturedSongsSection from '@/components/sections/FeaturedSongsSection';
import Closing from '@/components/sections/Closing';
import SongsVinylWash from '@/art/SongsVinylWash';
import { DeluxeAlbumSection } from '@/components/songs/DeluxeAlbumModal';
import { SEMI_TRACKS } from '@/data/semi-songs';
import { buildSongsIndexJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Songs & Stories — I/O',
  description:
    `Stream all ${SEMI_TRACKS.length} indie-folk songs on I/O by Semi (; - ]), watch the official music videos in order, read the stories & guitar chords, download free 320 kbps MP3s, or get the 15-track Deluxe Edition.`,
  alternates: {
    canonical: '/songs',
  },
  openGraph: {
    title: 'Songs & Stories — I/O · Semi (; - ])',
    description:
      `All ${SEMI_TRACKS.length} songs from I/O: watch the videos, read lyric stories & guitar chords, and download the album.`,
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
      <SongsVinylWash />
      <SiteHeader />
      <main id="main" className="relative z-10 flex-1">
        <FeaturedSongsSection eyebrow="Songs" showAllFeatured />

        <DeluxeAlbumSection />

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
