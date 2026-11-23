import React from 'react';
import AutumnPaperCanvas from '@/art/AutumnPaperCanvas';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import Hero from '@/components/sections/Hero';
import AlbumReleaseCallout from '@/components/sections/AlbumReleaseCallout';
import FeaturedSongsSection from '@/components/sections/FeaturedSongsSection';
import SemicolonExplainer from '@/components/sections/SemicolonExplainer';
import FilmScenesGallery from '@/components/sections/FilmScenesGallery';
import Closing from '@/components/sections/Closing';
import { buildHomeJsonLd } from '@/lib/seo';

export default function HomePage() {
  const jsonLd = buildHomeJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AutumnPaperCanvas />
      <SiteHeader />
      <main id="main" className="relative z-10 flex-1">
        <Hero />
        <AlbumReleaseCallout />
        <FeaturedSongsSection />
        <SemicolonExplainer />
        <FilmScenesGallery preview />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
