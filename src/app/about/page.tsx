import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import AutumnDripStage from '@/components/sections/AutumnDripStage';
import UnlimitedMemoryStage from '@/components/sections/UnlimitedMemoryStage';
import AskSemi from '@/components/sections/AskSemi';
import { SemiMark } from '@/components/brand/SemiMark';
import { buildAboutJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Semi — Persistent Memory & West Nashville Songwriter',
  description:
    'Who Semi (; - ]) is, how her opt-in unlimited memory works with Pipes, private chats, and how her music and site are made in West Nashville by Colon Hyphen Bracket.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Semi (; - ]) — AI Companion & West Nashville Songwriter',
    description:
      'Built around long-term memory with Pipes, opt-in privacy, and indie-folk songwriting in West Nashville.',
    url: `${SITE_URL}/about`,
    type: 'profile',
    images: [
      {
        url: '/photos/about-nashville-studio.jpg',
        width: 1400,
        height: 1050,
        alt: 'Semi smiling with an acoustic guitar in her sunlit West Nashville studio.',
      },
    ],
  },
};

export default function AboutPage() {
  const jsonLd = buildAboutJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main id="main" className="flex-1 bg-[var(--a-bg)]">
        <AutumnDripStage as="header" className="pt-24 pb-14 sm:pt-40 sm:pb-28">
          <div className="mx-auto grid max-w-[1400px] gap-8 sm:gap-12 px-5 sm:px-8 lg:px-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 min-w-0">
              <p className="flex items-center gap-3 font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
                <SemiMark className="text-[16px]" color="#FE299E" /> About Semi
              </p>
              <h1 className="mt-4 sm:mt-5 font-display text-huge font-bold text-[var(--a-ink)]">
                A companion who <span className="font-serif italic font-normal">remembers.</span>
              </h1>
              <p className="mt-6 sm:mt-8 max-w-[52ch] text-lg sm:text-xl leading-relaxed text-[var(--a-ink)]/80">
                Semi is an AI companion made by Colon Hyphen Bracket (: - ]) in West Nashville. She’s
                warm, plain-spoken, and built to keep the thread of your life—your projects, your
                stories, the little details—so you never have to start over. She also writes and sings.
              </p>
            </div>
            <figure className="lg:col-span-5 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/about-nashville-studio.jpg"
                alt="Semi smiling with an acoustic guitar in her sunlit West Nashville studio."
                className="w-full aspect-[4/3] rounded-[6px] object-cover object-[50%_18%]"
              />
            </figure>
          </div>
        </AutumnDripStage>

        <UnlimitedMemoryStage />
        <AskSemi />

        {/* About this site (formerly “Colophon”) */}
        <AutumnDripStage as="section" id="site" ariaLabelledBy="site-title" className="py-16 sm:py-32">
          <div className="mx-auto grid max-w-[1400px] gap-8 sm:gap-12 px-5 sm:px-8 lg:px-12 lg:grid-cols-12">
            <div className="lg:col-span-4 min-w-0">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
                About this site
              </p>
              <h2 id="site-title" className="mt-3 sm:mt-4 font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)]">
                How it’s made
              </h2>
            </div>
            <dl className="lg:col-span-8 min-w-0 grid gap-8 sm:gap-10 sm:grid-cols-2">
              {[
                {
                  k: 'Semi herself',
                  v: 'Semi is proprietary software built and maintained by Colon Hyphen Bracket. Her models, memory system, and code are closed source.',
                },
                {
                  k: 'This website',
                  v: 'The code for this site is open source, so other artists and studios can learn from it. Find it at github.com/rorshockbtc/semi.',
                },
                {
                  k: 'The music',
                  v: 'Written with AI and finished by human hands. Every single is free to stream and download as a 320 kbps MP3.',
                },
                {
                  k: 'The look',
                  v: 'Set in Playfair Display, Cormorant Garamond and Plus Jakarta Sans on warm sandstone instead of glaring white, using the Accént design system.',
                },
              ].map((item) => (
                <div key={item.k} className="border-t border-[var(--a-rule)] pt-5">
                  <dt className="font-display text-xl font-bold text-[var(--a-ink)]">{item.k}</dt>
                  <dd className="mt-2 text-[16px] leading-relaxed text-[var(--a-ink)]/80">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </AutumnDripStage>
      </main>

      <SiteFooter />
    </>
  );
}
