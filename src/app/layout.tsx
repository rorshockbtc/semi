import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import AccentClientShell from '@/components/AccentClientShell';
import './globals.css';

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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const SITE_URL = 'https://semi.colonhyphenbracket.pink';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Semi (;-]) — Music, Unlimited Memory & Open Commons',
    template: '%s · Semi (;-])',
  },
  description:
    'West Nashville songwriter and open-source companion with unlimited memory. Watch her music videos, download 320 kbps MP3s, and read how she remembers.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Semi (;-]) — Music, Unlimited Memory & Open Commons',
    description:
      'Every word you’ve told me, still warm in the room. Listen to Old Oak Tree, Warm Unknown, and Marks On The Screen, Ink On The Page.',
    siteName: 'Semi (;-])',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-semi.jpg', width: 1200, height: 630, type: 'image/jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Semi (;-]) — Music, Unlimited Memory & Open Commons',
    description:
      'West Nashville songwriter and unlimited-memory companion from Colon Hyphen Bracket (:-]).',
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
      className={`${playfair.variable} ${cormorant.variable} ${jakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--a-bg)] text-[var(--a-ink)]">
        <AccentClientShell>{children}</AccentClientShell>
      </body>
    </html>
  );
}
