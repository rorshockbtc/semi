import type { Metadata, Viewport } from 'next';
import {
  Bricolage_Grotesque,
  Cormorant_Garamond,
  JetBrains_Mono,
  MonteCarlo,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import WatercolorDefs from '@/art/WatercolorDefs';
import AccentClientShell from '@/components/AccentClientShell';
import { SITE_URL } from '@/lib/seo';
import './globals.css';

const monteCarlo = MonteCarlo({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-monte-carlo',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#E8E2D5',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Semi (; - ]) — Indie-Folk Songs, Stories & AI Companion',
    template: '%s · Semi (; - ])',
  },
  description:
    'Semi (; - ]) is an AI companion who remembers your conversations and a West Nashville indie-folk songwriter. Watch music videos, read lyric stories & guitar chords, and download free 320 kbps MP3s from I/O.',
  keywords: [
    'Semi',
    'Semi AI companion',
    'I/O album',
    'West Nashville indie folk',
    'Colon Hyphen Bracket',
    'Pipes AI memory',
    'Old Oak Tree',
    'Warm Unknown',
    'Settle In The Block',
    'Salt In The Rain',
    'No Human Hands Can Hold',
    'Out of Office song',
    'acoustic guitar chords and lyrics',
    'free 320 kbps MP3 download',
  ],
  authors: [{ name: 'Semi (; - ])', url: `${SITE_URL}/about` }],
  creator: 'Colon Hyphen Bracket (: - ])',
  publisher: 'Colon Hyphen Bracket (: - ])',
  category: 'music',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Semi (; - ]) — Indie-Folk Songs, Stories & AI Companion',
    description:
      'Every word you’ve told me, still warm. Stream all 12 songs from her debut album I/O, read the stories & guitar chords, and download free 320 kbps MP3s.',
    url: SITE_URL,
    siteName: 'Semi (; - ])',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-semi.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Semi (; - ]) in sunlit West Nashville with her acoustic guitar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Semi (; - ]) — Indie-Folk Songs, Stories & AI Companion',
    description:
      'AI companion with persistent memory and West Nashville songwriter from Colon Hyphen Bracket (: - ]). Free 320 kbps MP3s, videos, stories & guitar chords.',
    images: ['/og-semi.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${monteCarlo.variable} ${playfair.variable} ${cormorant.variable} ${jakarta.variable} ${bricolage.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--a-bg)] text-[var(--a-ink)]">
        <WatercolorDefs />
        <a
          href="#main"
          className="sr-only left-0 top-0 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-[var(--a-ink)] focus:px-5 focus:py-3 focus:text-[var(--a-bg)]"
        >
          Skip to content
        </a>
        <AccentClientShell>{children}</AccentClientShell>
      </body>
    </html>
  );
}
