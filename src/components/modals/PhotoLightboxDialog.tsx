'use client';

import React, { useId } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import SemiDialogPortal from '@/components/modals/SemiDialogPortal';
import type { StudioPhoto } from '@/data/semi-songs';

interface PhotoLightboxDialogProps {
  photo: StudioPhoto | null;
  photos: StudioPhoto[];
  onSelectPhoto: (photo: StudioPhoto) => void;
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
                className="max-h-[62dvh] w-full object-contain mx-auto"
              />
            </figure>

            <div className="flex items-center justify-between gap-4 border-t border-[var(--a-rule)] pt-4">
              <button
                type="button"
                onClick={() => onSelectPhoto(prevPhoto)}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-full border border-[var(--a-rule)] px-4 text-[14px] font-medium text-[var(--a-ink)] hover:border-[var(--a-ink)]"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span>Previous plate</span>
              </button>
              <span className="font-code text-[13px] text-[var(--a-muted)]">
                {currentIndex + 1} / {photos.length}
              </span>
              <button
                type="button"
                onClick={() => onSelectPhoto(nextPhoto)}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-full border border-[var(--a-rule)] px-4 text-[14px] font-medium text-[var(--a-ink)] hover:border-[var(--a-ink)]"
              >
                <span>Next plate</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )
      }
    </SemiDialogPortal>
  );
}
