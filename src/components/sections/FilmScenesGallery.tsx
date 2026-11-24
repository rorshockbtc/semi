'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { m } from 'framer-motion';
import AutumnWetBrushCanvas from '@/art/AutumnWetBrushCanvas';
import PhotoLightboxDialog from '@/components/modals/PhotoLightboxDialog';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import { FILM_SCENES_GALLERY, type FilmScenePhoto } from '@/data/semi-songs';

type GalleryFilter = 'all' | 'svrn' | 'sessions';

/**
 * Gallery. `preview` renders a 4-up strip for the home page; the full page renders an
 * editorial masonry (CSS columns) with collection filtering, explicit Humble Warrior /
 * SVRN Society attribution & direct store links, and a native <dialog> lightbox.
 */
export default function FilmScenesGallery({ preview = false }: { preview?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<FilmScenePhoto | null>(null);
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const { motionActive } = useAmbientMotion();

  const svrnCount = useMemo(
    () => FILM_SCENES_GALLERY.filter((p) => p.series === 'svrn').length,
    []
  );
  const sessionsCount = useMemo(
    () => FILM_SCENES_GALLERY.filter((p) => p.series !== 'svrn').length,
    []
  );

  const photos = useMemo(() => {
    if (preview) {
      const previewIds = [
        'svrn-soft-revolution-maxi',
        'denim-porch',
        'svrn-chancellor-cafe',
        'meadow-spin',
      ];
      return FILM_SCENES_GALLERY.filter((p) => previewIds.includes(p.id));
    }
    if (filter === 'svrn') return FILM_SCENES_GALLERY.filter((p) => p.series === 'svrn');
    if (filter === 'sessions') return FILM_SCENES_GALLERY.filter((p) => p.series !== 'svrn');
    return FILM_SCENES_GALLERY;
  }, [filter, preview]);

  return (
    <section
      ref={sectionRef}
      id="scenes"
      aria-labelledby="scenes-title"
      className={`relative scroll-mt-20 overflow-x-clip ${
        preview
          ? 'bg-transparent py-24 sm:py-32'
          : 'bg-[var(--a-bg)] wc-paper-grain touch-pan-y pt-32 pb-24 sm:pt-40'
      }`}
    >
      {!preview && <AutumnWetBrushCanvas containerRef={sectionRef} />}
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
              Gallery · Sessions &amp; SVRN Lookbook
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
          {preview ? (
            <Link
              href="/gallery"
              className="wc-link min-h-[44px] inline-flex items-center text-[16px] font-semibold text-[var(--a-ink)]"
            >
              See the full gallery →
            </Link>
          ) : (
            <a
              href="https://svrnsociety.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="gallery-svrn-header-link"
              className="min-h-[44px] inline-flex items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] px-5 text-[14px] font-semibold text-[var(--a-ink)] transition-colors hover:border-[var(--a-ink)]"
            >
              <span>Shop Humble Warrior’s SVRN Society</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          )}
        </div>

        {!preview && (
          <div className="mt-8 space-y-6">
            {/* Filter Tabs */}
            <div
              role="tablist"
              aria-label="Gallery collections"
              className="flex flex-wrap items-center gap-2.5"
            >
              {[
                { key: 'all' as const, label: `All Photographs (${FILM_SCENES_GALLERY.length})` },
                { key: 'svrn' as const, label: `SVRN Society Lookbook (${svrnCount})` },
                { key: 'sessions' as const, label: `West Nashville & Studio (${sessionsCount})` },
              ].map((tab) => {
                const active = filter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    data-testid={`gallery-filter-${tab.key}`}
                    onClick={() => setFilter(tab.key)}
                    className={`min-h-[44px] rounded-full px-5 text-[14px] font-semibold transition-colors ${
                      active
                        ? 'bg-[var(--a-ink)] text-[var(--a-surface)]'
                        : 'border border-[var(--a-rule)] bg-[var(--a-surface)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Respectful attribution & referral note for Humble Warrior */}
            {filter !== 'sessions' && (
              <div
                data-testid="svrn-attribution-banner"
                className="flex flex-col gap-4 rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="space-y-1.5 max-w-[68ch]">
                  <p className="font-code text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-accent-text)]">
                    Friend-of-the-House Lookbook · Humble Warrior
                  </p>
                  <p className="text-[15px] leading-relaxed text-[var(--a-ink)]/85">
                    Every garment in the <strong>SVRN Society</strong> portraits is designed and
                    owned by <strong>Humble Warrior</strong>. Semi (; - ]) modeled these pieces
                    purely to celebrate her craft and send business her way—every garment link
                    below forwards straight to{' '}
                    <a
                      href="https://svrnsociety.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline underline-offset-4 hover:text-[var(--a-accent-text)]"
                    >
                      svrnsociety.com
                    </a>
                    .
                  </p>
                </div>
                <a
                  href="https://svrnsociety.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-5 text-[14px] font-semibold text-white transition-colors"
                >
                  <span>Visit svrnsociety.com</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        )}

        <div
          className={
            preview
              ? 'mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4'
              : 'mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-8'
          }
        >
          {photos.map((photo, idx) => {
            const isSvrn = photo.series === 'svrn';
            const aspectClass = preview
              ? 'aspect-[4/5]'
              : isSvrn
                ? 'aspect-[3/4]'
                : idx % 3 === 1
                  ? 'aspect-[4/5]'
                  : 'aspect-[3/2]';

            return (
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
                  className="group block w-full overflow-hidden rounded-[8px] border border-[var(--a-rule)] bg-[var(--a-surface)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className={`w-full object-cover ${
                      isSvrn ? 'object-top' : 'object-[50%_20%]'
                    } transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] ${aspectClass}`}
                  />
                </button>
                <figcaption className="mt-3 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-serif italic text-[17px] leading-snug text-[var(--a-ink)]">
                      {photo.caption}
                    </span>
                    {!preview && (
                      <span className="shrink-0 text-[13px] text-[var(--a-muted)]">
                        {photo.location}
                      </span>
                    )}
                  </div>
                  {photo.shopUrl && photo.garmentTitle && (
                    <a
                      href={photo.shopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`gallery-shop-link-${photo.id}`}
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--a-accent-text)] hover:text-[var(--a-ink)] transition-colors"
                    >
                      <span>{photo.garmentTitle} · Shop on svrnsociety.com</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </a>
                  )}
                </figcaption>
              </m.figure>
            );
          })}
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
