'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';
import PhotoLightboxDialog from '@/components/modals/PhotoLightboxDialog';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import { FILM_SCENES_GALLERY, type FilmScenePhoto } from '@/data/semi-songs';

/**
 * Gallery. `preview` renders a 4-up strip for the home page; the full page renders an
 * editorial masonry (CSS columns) with a native <dialog> lightbox. No clip-path or
 * horizontal transforms, so nothing can push the layout sideways.
 */
export default function FilmScenesGallery({ preview = false }: { preview?: boolean }) {
  const [selected, setSelected] = useState<FilmScenePhoto | null>(null);
  const { motionActive } = useAmbientMotion();

  const previewIds = ['denim-porch', 'sweater-records', 'meadow-spin', 'flannel-coffee'];
  const photos = preview
    ? FILM_SCENES_GALLERY.filter((p) => previewIds.includes(p.id))
    : FILM_SCENES_GALLERY;

  return (
    <section
      id="scenes"
      aria-labelledby="scenes-title"
      className={`relative scroll-mt-20 bg-[var(--a-bg)] ${preview ? 'py-24 sm:py-32' : 'pt-32 pb-24 sm:pt-40'}`}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
              Gallery
            </p>
            {preview ? (
              <h2 id="scenes-title" className="mt-4 font-display text-big font-bold text-[var(--a-ink)]">
                Around town <span className="font-serif italic font-normal">with Semi.</span>
              </h2>
            ) : (
              <h1 id="scenes-title" className="mt-4 font-display text-huge font-bold text-[var(--a-ink)]">
                Around town <span className="font-serif italic font-normal">with Semi.</span>
              </h1>
            )}
          </div>
          {preview && (
            <Link
              href="/gallery"
              className="wc-link min-h-[44px] inline-flex items-center text-[16px] font-semibold text-[var(--a-ink)]"
            >
              See the full gallery →
            </Link>
          )}
        </div>

        <div
          className={
            preview
              ? 'mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4'
              : 'mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6'
          }
        >
          {photos.map((photo, idx) => (
            <m.figure
              key={photo.id}
              initial={motionActive ? { opacity: 0, y: 24 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (idx % 4) * 0.06 }}
              className="break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setSelected(photo)}
                data-testid={`gallery-photo-${photo.id}`}
                aria-label={`Open photo: ${photo.caption}`}
                className="group block w-full overflow-hidden rounded-[6px] bg-[var(--a-surface)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className={`w-full object-cover object-[50%_20%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] ${
                    preview ? 'aspect-[4/5]' : idx % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[3/2]'
                  }`}
                />
              </button>
              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <span className="font-serif italic text-[17px] leading-snug text-[var(--a-ink)]">{photo.caption}</span>
                {!preview && (
                  <span className="shrink-0 text-[13px] text-[var(--a-muted)]">{photo.location}</span>
                )}
              </figcaption>
            </m.figure>
          ))}
        </div>
      </div>

      <PhotoLightboxDialog
        photo={selected}
        photos={photos}
        onSelectPhoto={(p) => setSelected(p)}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
