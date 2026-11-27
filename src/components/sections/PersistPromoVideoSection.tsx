'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import YouTubePlayer from '@/components/YouTubePlayer';

export default function PersistPromoVideoSection() {
  return (
    <section
      aria-labelledby="home-persist-promo-title"
      data-testid="home-persist-promo"
      className="border-t border-[var(--a-rule)] bg-[var(--a-surface)] py-12 sm:py-16"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="lg:col-span-5 min-w-0 space-y-3 sm:space-y-4">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
            New Album · Persist Promo
          </p>
          <h2
            id="home-persist-promo-title"
            className="font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)] leading-[1.08]"
          >
            Watch the <em>Persist</em> promo.
          </h2>
          <p className="max-w-[44ch] text-[16px] leading-relaxed text-[var(--a-ink)]/80">
            Fourteen tracks from aboard <em>Resonance</em>—written for the ones holding
            onto each other across bent time.
          </p>
          <div className="pt-1">
            <Link
              href="/persist"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-6 text-[15px] font-semibold text-white no-underline transition-colors"
            >
              <span>Explore Persist</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 min-w-0">
          <div className="overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[#14110f] shadow-[0_24px_60px_-24px_rgba(17,24,39,0.28)]">
            <YouTubePlayer
              youtubeId="09Tiwi2baTo"
              title="Persist — Album Promo"
              posterSrc="/photos/persist/persist-album-cover.jpg"
              iframeTestId="persist-promo-video-iframe"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
