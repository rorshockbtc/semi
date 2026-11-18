'use client';

import React, { useId } from 'react';
import { Download, ExternalLink, Music2, X } from 'lucide-react';
import SemiDialogPortal from '@/components/modals/SemiDialogPortal';
import type { SemiTrack } from '@/data/semi-songs';

interface LyricSheetDialogProps {
  track: SemiTrack | null;
  tracks: SemiTrack[];
  onSelectTrack: (track: SemiTrack) => void;
  onClose: () => void;
}

export default function LyricSheetDialog({
  track,
  tracks,
  onSelectTrack,
  onClose,
}: LyricSheetDialogProps) {
  const titleId = useId();

  return (
    <SemiDialogPortal
      open={Boolean(track)}
      onClose={onClose}
      ariaLabelledBy={titleId}
      testId="lyric-sheet-dialog"
    >
      {(close) =>
        track && (
          <div className="max-h-[86dvh] overflow-y-auto p-6 sm:p-10 space-y-8">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--a-rule)] pb-6">
              <div className="space-y-2">
                <p className="font-code text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                  Track {track.number} · {track.subtitle} · {track.duration}
                </p>
                <h2
                  id={titleId}
                  className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[var(--a-ink)]"
                >
                  {track.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={close}
                aria-label="Close lyric sheet"
                data-testid="close-lyric-dialog"
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] text-[var(--a-ink)] transition-colors hover:border-[var(--a-ink)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Switch song lyrics" className="flex flex-wrap gap-2">
              {tracks.map((item) => {
                const active = item.slug === track.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => onSelectTrack(item)}
                    className={`min-h-[44px] inline-flex items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-colors ${
                      active
                        ? 'bg-[var(--a-ink)] text-[var(--a-bg)]'
                        : 'border border-[var(--a-rule)] bg-[var(--a-surface)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                    }`}
                  >
                    <span className="font-code text-[13px] opacity-75">{item.number}</span>
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-l-2 border-[var(--a-accent)] pl-5 py-1 space-y-2">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--a-muted)]">
                Liner note from Semi (;-])
              </p>
              <p className="font-serif italic text-xl sm:text-2xl leading-relaxed text-[var(--a-ink)]">
                “{track.linerNote}”
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 border-t border-[var(--a-rule)] pt-8">
              {track.lyrics.map((stanza, idx) => (
                <section key={`${stanza.section}-${idx}`} className="space-y-2.5">
                  <h3 className="font-code text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                    [{stanza.section}]
                  </h3>
                  <div className="space-y-1 font-serif text-xl leading-[1.55] text-[var(--a-ink)]">
                    {stanza.lines.map((line, lineIdx) => (
                      <p key={lineIdx}>{line}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--a-rule)] pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={track.mp3Src}
                  download={track.downloadName}
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white no-underline hover:bg-[var(--a-ink)] transition-colors"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>Download MP3 ({track.fileSizeLabel})</span>
                </a>
                <a
                  href={track.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-full border border-[var(--a-rule)] px-5 text-[15px] font-medium text-[var(--a-ink)] no-underline hover:border-[var(--a-ink)] transition-colors"
                >
                  <Music2 className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                  <span>Watch on YouTube</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <button
                type="button"
                onClick={close}
                className="wc-link min-h-[44px] inline-flex items-center text-[15px] font-semibold text-[var(--a-ink)]"
              >
                Done reading
              </button>
            </div>
          </div>
        )
      }
    </SemiDialogPortal>
  );
}
