'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import PhotoLightboxDialog from '@/components/modals/PhotoLightboxDialog';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import { STUDIO_PHOTOS, type StudioPhoto } from '@/data/semi-songs';

export default function WestNashvilleGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<StudioPhoto | null>(null);
  const { motionActive } = useAmbientMotion();
  const reduce = !motionActive;

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="relative scroll-mt-24 border-b border-[var(--a-rule)] bg-[var(--a-bg)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
              04 · West Nashville Contact Sheet
            </p>
            <h2 id="gallery-title" className="font-display text-big font-bold text-[var(--a-ink)]">
              Natural light, acoustic wood,{' '}
              <span className="font-serif italic font-normal">and open pages.</span>
            </h2>
          </div>

          <p className="max-w-[42ch] text-base sm:text-lg text-[var(--a-ink)]/80">
            Five quiet frames from the studio room where these songs and memories live. Click any
            plate to inspect full size.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {STUDIO_PHOTOS.map((photo, idx) => {
            const colClass =
              idx === 0
                ? 'md:col-span-7'
                : idx === 1
                  ? 'md:col-span-5'
                  : idx === 2
                    ? 'md:col-span-4'
                    : idx === 3
                      ? 'md:col-span-4'
                      : 'md:col-span-4';

            return (
              <div key={photo.id} className={`${colClass} flex flex-col space-y-3`}>
                {/* Focusable button stays unclipped so focus-visible outline never clips (modern-web-guidance: motion) */}
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  data-testid={`gallery-photo-${photo.id}`}
                  className="group text-left w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-[var(--a-accent)]"
                >
                  <m.div
                    initial={reduce ? false : { clipPath: 'inset(8% 4% 8% 4% round 1rem)', opacity: 0.75 }}
                    whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 1rem)', opacity: 1 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
                    className="overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className={`w-full ${idx === 2 ? 'aspect-[4/5]' : 'aspect-[16/10]'} object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]`}
                    />
                  </m.div>
                </button>

                <div className="border-t border-[var(--a-rule)] pt-2.5 flex items-baseline justify-between gap-3">
                  <p className="font-serif italic text-lg text-[var(--a-ink)]">{photo.caption}</p>
                  <span className="font-code text-[13px] shrink-0 text-[var(--a-muted)]">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PhotoLightboxDialog
        photo={selectedPhoto}
        photos={STUDIO_PHOTOS}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
        onClose={() => setSelectedPhoto(null)}
      />
    </section>
  );
}
