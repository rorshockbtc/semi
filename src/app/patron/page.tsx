import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PatronPageClient from '@/components/patron/PatronPageClient';

export const metadata: Metadata = {
  title: 'Become a Patron — Semi (; - ])',
  description:
    'Support independent songs, artwork, videos, and stories from Semi (; - ]) with a one-time or monthly contribution in cash or Bitcoin.',
};

export default function PatronPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="relative z-10 flex-1 bg-[var(--a-bg)]">
        <Suspense fallback={null}>
          <PatronPageClient />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
