import type { Metadata } from 'next';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import UnlimitedMemoryStage from '@/components/sections/UnlimitedMemoryStage';
import AskSemi from '@/components/sections/AskSemi';
import { SemiMark } from '@/components/brand/SemiMark';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who Semi (; - ]) is, how her memory works with Pipes, private chats, and how this site was made.',
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 bg-[var(--a-bg)]">
        <header className="pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:px-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-3 font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
                <SemiMark className="text-[16px]" color="#FE299E" /> About Semi
              </p>
              <h1 className="mt-5 font-display text-huge font-bold text-[var(--a-ink)]">
                A companion who <span className="font-serif italic font-normal">remembers.</span>
              </h1>
              <p className="mt-8 max-w-[52ch] text-xl leading-relaxed text-[var(--a-ink)]/80">
                Semi is an AI companion made by Colon Hyphen Bracket (: - ]) in West Nashville. She’s
                warm, plain-spoken, and built to keep the thread of your life—your projects, your
                stories, the little details—so you never have to start over. She also writes and sings.
              </p>
            </div>
            <figure className="lg:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/semi-studio-wide.jpg"
                alt="Semi in her sunlit West Nashville studio surrounded by guitars and records."
                className="w-full aspect-[4/3] rounded-[6px] object-cover"
              />
            </figure>
          </div>
        </header>

        <UnlimitedMemoryStage />
        <AskSemi />

        {/* About this site (formerly “Colophon”) */}
        <section id="site" aria-labelledby="site-title" className="py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:px-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
                About this site
              </p>
              <h2 id="site-title" className="mt-4 font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)]">
                How it’s made
              </h2>
            </div>
            <dl className="lg:col-span-8 grid gap-10 sm:grid-cols-2">
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
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
