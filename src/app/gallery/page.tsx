import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import FilmScenesGallery from '@/components/sections/FilmScenesGallery';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos of Semi from her music videos and around West Nashville.',
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <FilmScenesGallery />
      </main>
      <SiteFooter />
    </>
  );
}
