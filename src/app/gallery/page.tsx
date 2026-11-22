import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import FilmScenesGallery from '@/components/sections/FilmScenesGallery';
import { buildGalleryJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Gallery — Around Town in West Nashville',
  description:
    'Editorial photographs and music-video scenes of Semi (; - ]) from her sessions and walks around West Nashville.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Gallery — Around Town with Semi (; - ])',
    description:
      'Music-video stills and West Nashville session photographs from I/O.',
    url: `${SITE_URL}/gallery`,
    type: 'website',
    images: [
      {
        url: '/photos/gallery-meadow-spin.jpg',
        width: 1400,
        height: 1000,
        alt: 'Semi spinning in a wildflower meadow above a river valley at golden hour.',
      },
    ],
  },
};

export default function GalleryPage() {
  const jsonLd = buildGalleryJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <FilmScenesGallery />
      </main>
      <SiteFooter />
    </>
  );
}
