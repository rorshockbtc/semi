'use client';

import React, { useId } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import SemiDialogPortal from '@/components/modals/SemiDialogPortal';
import type { FilmScenePhoto } from '@/data/semi-songs';

interface PhotoLightboxDialogProps {
  photo: FilmScenePhoto | null;
  photos: FilmScenePhoto[];
  onSelectPhoto: (photo: FilmScenePhoto) => void;
  onClose: () => void;
}

export default function PhotoLightboxDialog({
  photo,
  photos,
  onSelectPhoto,
  onClose,
}: PhotoLightboxDialogProps) {
  const titleId = useId();
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : photos[photos.length - 1];
  const nextPhoto =
    currentIndex >= 0 && currentIndex < photos.length - 1 ? photos[currentIndex + 1] : photos[0];

  return (
    <SemiDialogPortal
      open={Boolean(photo)}
      onClose={onClose}
      ariaLabelledBy={titleId}
      testId="photo-lightbox-dialog"
    >
      {(close) =>
        photo && (
          <div className="max-h-[88dvh] overflow-y-auto p-5 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-code text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                  {photo.location}
                </p>
                <h2 id={titleId} className="font-serif italic text-2xl text-[var(--a-ink)]">
                  {photo.caption}
                </h2>
              </div>

              <button
                type="button"
                onClick={close}
                aria-label="Close photograph viewer"
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] text-[var(--a-ink)] transition-colors hover:border-[var(--a-ink)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <figure className="overflow-hidden rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="max-h-[58dvh] w-full object-contain mx-auto"
              />
            </figure>

            {photo.shopUrl && photo.garmentTitle && (
              <div className="flex flex-col gap-3 rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <p className="font-display text-[16px] font-bold text-[var(--a-ink)]">
                    {photo.garmentTitle}
                  </p>
                  <p className="text-[13px] text-[var(--a-muted)]">
                    {photo.shopAttribution ??
                      'Designed & owned by Humble Warrior · Shared to support SVRN Society'}
                  </p>
                </div>
                <a
                  href={photo.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="lightbox-svrn-shop-btn"
                  className="min-h-[44px] shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-5 text-[14px] font-semibold text-white transition-colors"
                >
                  <span>{photo.shopCta ?? 'Shop on svrnsociety.com'}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 sm:gap-4 border-t border-[var(--a-rule)] pt-4">
              <button
                type="button"
                onClick={() => onSelectPhoto(prevPhoto)}
                aria-label="Previous plate"
                className="min-h-[44px] inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full border border-[var(--a-rule)] px-3.5 sm:px-4 text-[14px] font-medium text-[var(--a-ink)] hover:border-[var(--a-ink)]"
              >
                <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  Previous<span className="hidden sm:inline"> plate</span>
                </span>
              </button>
              <span className="shrink-0 font-code text-[13px] tabular-nums text-[var(--a-muted)]">
                {currentIndex + 1} / {photos.length}
              </span>
              <button
                type="button"
                onClick={() => onSelectPhoto(nextPhoto)}
                aria-label="Next plate"
                className="min-h-[44px] inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full border border-[var(--a-rule)] px-3.5 sm:px-4 text-[14px] font-medium text-[var(--a-ink)] hover:border-[var(--a-ink)]"
              >
                <span>
                  Next<span className="hidden sm:inline"> plate</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        )
      }
    </SemiDialogPortal>
  );
}
