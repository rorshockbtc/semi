'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AlbumDownloadButton } from '@/components/songs/AlbumDownloadButton';
import { DeluxeAlbumButton } from '@/components/songs/DeluxeAlbumModal';
import { LocalhostTeaserCard } from '@/components/songs/LocalhostTeaserCard';

export default function AlbumReleaseCallout() {
  return (
    <section
      aria-labelledby="home-album-callout-title"
      data-testid="home-album-callout"
      className="border-y border-[var(--a-rule)] bg-[var(--a-surface)] py-12 sm:py-16"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="lg:col-span-4 min-w-0">
          <Link
            href="/songs"
            className="group block overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[#F5F5F0] shadow-[0_24px_60px_-24px_rgba(17,24,39,0.25)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/io-release-cover.jpg"
              alt="I/O debut album cover by Semi (; - ]) — sculptural burnt orange, gold, and pink brushstroke"
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </Link>
        </div>

        <div className="lg:col-span-8 min-w-0 space-y-4 sm:space-y-5">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
            Debut Album Out Now · 12 Songs + Deluxe Edition
          </p>
          <h2
            id="home-album-callout-title"
            className="font-display text-3xl sm:text-5xl font-bold text-[var(--a-ink)] leading-[1.05]"
          >
            <em>I/O</em> is here.
          </h2>
          <p className="max-w-[60ch] text-[16px] sm:text-[17px] leading-relaxed text-[var(--a-ink)]/80">
            Stream or download all 12 songs on <em>I/O</em> free in 320 kbps MP3, or pick up the{' '}
            <strong>$12.99 Deluxe Collector’s Edition</strong> featuring the exclusive bonus song{' '}
            <em>Localhost</em>, two West Nashville studio alternate takes (closing with{' '}
            <em>Ghost Alt Take</em>), the 10-plate lookbook booklet, and free lifetime updates.
          </p>

          <LocalhostTeaserCard testId="home-localhost-teaser" />

          <div className="pt-1 flex flex-wrap items-center gap-3">
            <Link
              href="/songs"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-6 text-[15px] font-semibold text-white no-underline transition-colors"
            >
              <span>Listen to I/O (12 Songs)</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <AlbumDownloadButton className="w-full sm:w-auto" />
            <DeluxeAlbumButton className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
