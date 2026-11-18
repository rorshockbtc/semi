'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import FloatingSparklesCanvas from '@/art/FloatingSparklesCanvas';
import PhotoLightboxDialog from '@/components/modals/PhotoLightboxDialog';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import { FILM_SCENES_GALLERY, type FilmScenePhoto } from '@/data/semi-songs';

export default function FilmScenesGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<FilmScenePhoto | null>(null);
  const { motionActive } = useAmbientMotion();
  const reduce = !motionActive;

  return (
    <section
      id="scenes"
      aria-labelledby="scenes-title"
      className="relative scroll-mt-24 border-b border-[var(--a-rule)] bg-[var(--a-bg)] py-20 sm:py-28 overflow-hidden"
    >
      <FloatingSparklesCanvas count={28} intensity={0.75} />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
              03 · Scenes from the Music Videos &amp; Studio
            </p>
            <h2 id="scenes-title" className="font-display text-big font-bold text-[var(--a-ink)]">
              Six frames in natural light,{' '}
              <span className="font-serif italic font-normal">never repeating a still.</span>
            </h2>
          </div>

          <p className="max-w-[44ch] text-base sm:text-lg text-[var(--a-ink)]/80">
            Pulled directly from her 1080p music video reels—wildflower meadows, the vocal ribbon mic,
            front-porch guitar sketches, and river twilight. Click any frame to enlarge.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {FILM_SCENES_GALLERY.map((photo, idx) => (
            <div key={photo.id} className="flex flex-col space-y-3">
              {/* Keep focusable <button> unclipped so :focus-visible outline renders cleanly */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                data-testid={`gallery-photo-${photo.id}`}
                className="group text-left w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-[var(--a-accent)]"
              >
                <m.div
                  initial={reduce ? false : { clipPath: 'inset(7% 3% 7% 3% round 1rem)', opacity: 0.78 }}
                  whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 1rem)', opacity: 1 }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: idx * 0.04 }}
                  className="relative overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full aspect-video object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
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
          ))}
        </div>
      </div>

      <PhotoLightboxDialog
        photo={selectedPhoto}
        photos={FILM_SCENES_GALLERY}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
        onClose={() => setSelectedPhoto(null)}
      />
    </section>
  );
}
