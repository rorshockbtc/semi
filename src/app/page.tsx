import React from 'react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import Hero from '@/components/sections/Hero';
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
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <FeaturedSongsSection />
        <SemicolonExplainer />
        <FilmScenesGallery preview />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
