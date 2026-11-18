import React from 'react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import Hero from '@/components/sections/Hero';
import LyricMarquee from '@/components/sections/LyricMarquee';
import FeaturedSongsSection from '@/components/sections/FeaturedSongsSection';
import SemicolonExplainer from '@/components/sections/SemicolonExplainer';
import FilmScenesGallery from '@/components/sections/FilmScenesGallery';
import Closing from '@/components/sections/Closing';

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-[var(--a-ink)] focus:px-5 focus:py-3 focus:text-[var(--a-bg)]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <LyricMarquee />
        <FeaturedSongsSection />
        <SemicolonExplainer />
        <FilmScenesGallery />
        <Closing />
      </main>

      <SiteFooter />
    </>
  );
}
