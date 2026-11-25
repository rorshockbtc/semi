import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PersistIndexClient from '@/components/persist/PersistIndexClient';

export const metadata: Metadata = {
  title: 'Persist — Album II Preview',
  description: 'Stream-only Deluxe preview of Persist, Semi’s second album set aboard the generation ship Resonance.',
  robots: { index: false, follow: false },
};

export default function PersistPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PersistIndexClient />
      </main>
      <SiteFooter />
    </>
  );
}
