import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ListenPassClient from '@/components/listen/ListenPassClient';

export const metadata: Metadata = {
  title: 'Listening Pass — Stream Semi Online',
  description:
    'Stream-only physical distribution listening pass for Semi (; - ]). Online playback bound to your device with English, Spanish, French, and Russian lyrics.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ListenPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-[var(--a-bg)]">
        <Suspense
          fallback={
            <div className="mx-auto max-w-[820px] px-5 pt-32 pb-24 text-center font-code text-[13px] text-[var(--a-muted)]">
              Loading listening pass…
            </div>
          }
        >
          <ListenPassClient />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
