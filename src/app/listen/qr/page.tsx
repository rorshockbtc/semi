import React from 'react';
import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import ListenQrClient from '@/components/listen/ListenQrClient';

export const metadata: Metadata = {
  title: 'Physical Distribution QR Code — Semi (; - ])',
  description: 'Owner-only print-ready QR code generator for Semi stream-only listening passes.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ListenQrPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-[var(--a-bg)]">
        <ListenQrClient />
      </main>
      <SiteFooter />
    </>
  );
}
