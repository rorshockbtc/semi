'use client';

import React from 'react';
import { ChevronDown, Smartphone } from 'lucide-react';

export function PhonePlaybackFaq() {
  return (
    <div
      data-testid="phone-playback-faq"
      className="rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] divide-y divide-[var(--a-rule)]"
    >
      <div className="px-4 py-3 flex items-center gap-2.5">
        <Smartphone className="w-4 h-4 shrink-0 text-[var(--a-accent-text)]" />
        <p className="font-code text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--a-muted)]">
          How to Play on Your Phone (FAQ)
        </p>
      </div>

      <details className="group">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[14px] font-semibold text-[var(--a-ink)] hover:bg-[var(--a-bg)]/50">
          <span>iPhone: How do I listen without iTunes / computer sync?</span>
          <ChevronDown className="w-4 h-4 shrink-0 text-[var(--a-muted)] transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-4 pt-1 space-y-2 text-[14px] leading-relaxed text-[var(--a-ink)]/85">
          <p>
            Apple does not allow Safari or the Files app to add MP3s directly into the built-in{' '}
            <strong>Apple Music</strong> app without a Mac or PC.
          </p>
          <p>
            <strong>Fastest way (no computer):</strong> Download the <code>.ZIP</code> in Safari,
            open the built-in <strong>Files</strong> app → <strong>Downloads</strong>, and tap the{' '}
            <code>.ZIP</code> once to unzip it. You can play tracks right inside Files, or install{' '}
            <strong>VLC for Mobile</strong> (free, no ads) and open the unzipped folder for
            gapless album playback.
          </p>
          <p>
            <strong>To put it in Apple Music:</strong> Unzip on a Mac or PC, drag the folder into
            the <strong>Music</strong> app (Mac) or <strong>Apple Devices / iTunes</strong>{' '}
            (Windows), then sync your iPhone.
          </p>
        </div>
      </details>

      <details className="group">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[14px] font-semibold text-[var(--a-ink)] hover:bg-[var(--a-bg)]/50">
          <span>Android: My music app doesn’t show the songs</span>
          <ChevronDown className="w-4 h-4 shrink-0 text-[var(--a-muted)] transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-4 pt-1 space-y-2 text-[14px] leading-relaxed text-[var(--a-ink)]/85">
          <p>
            Many Android and carrier phones (such as Claro Música or YouTube Music) hide local
            files or cannot read inside a <code>.ZIP</code> archive.
          </p>
          <p>
            <strong>1. Unzip first:</strong> Open <strong>Files</strong> (or{' '}
            <strong>Files by Google</strong>) → <strong>Downloads</strong> → tap the{' '}
            <code>.ZIP</code> → tap <strong>Extract</strong>.
          </p>
          <p>
            <strong>2. Use a local player:</strong> If your stock app still won’t list the MP3s,
            install <strong>Musicolet</strong> (free, lightweight, zero ads, offline) or{' '}
            <strong>VLC for Android</strong> from the Play Store—it will automatically scan your
            Downloads folder and play the full album in order.
          </p>
        </div>
      </details>
    </div>
  );
}
