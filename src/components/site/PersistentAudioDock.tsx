'use client';

import React from 'react';
import Link from 'next/link';
import { Download, Pause, Play, SkipBack, SkipForward, X } from 'lucide-react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PersistentAudioDock() {
  const {
    currentTrack,
    hasStarted,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    dismissDock,
  } = useAudioPlayer();

  if (!hasStarted) return null;

  const maxDuration = duration > 0 ? duration : 180;

  return (
    <aside
      aria-label="Persistent music player"
      data-testid="persistent-audio-dock"
      className="fixed inset-x-0 bottom-3 z-40 px-3 sm:px-6 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-[1160px] rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)]/96 backdrop-blur-md px-4 py-3 shadow-[0_20px_50px_-15px_rgba(17,24,39,0.28)] flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={prevTrack}
            aria-label="Previous track"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)] transition-colors"
          >
            <SkipBack className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
            data-testid="dock-play-toggle"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white hover:bg-[var(--a-ink)] transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4 translate-x-0.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            aria-label="Next track"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)] transition-colors"
          >
            <SkipForward className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="min-w-0 pl-1">
            <Link
              href={`/songs/${currentTrack.slug}`}
              className="wc-link inline-block font-display text-base sm:text-lg font-bold text-[var(--a-ink)] truncate max-w-full"
            >
              {currentTrack.number} · {currentTrack.title}
            </Link>
            <p className="font-code text-[13px] text-[var(--a-muted)] truncate">
              Semi (; - ]) · {currentTrack.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 md:max-w-sm">
          <span className="font-code text-[13px] tabular-nums text-[var(--a-muted)]">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={maxDuration}
            step={0.5}
            value={Math.min(currentTime, maxDuration)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek track progress"
            className="semi-range flex-1 min-h-[44px]"
          />
          <span className="font-code text-[13px] tabular-nums text-[var(--a-muted)]">
            {duration > 0 ? formatTime(duration) : currentTrack.duration}
          </span>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2">
          <a
            href={currentTrack.mp3Src}
            download={currentTrack.downloadName}
            className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] px-4 text-[14px] font-semibold text-[var(--a-accent-text)] no-underline hover:border-[var(--a-accent-text)] transition-colors"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>MP3</span>
          </a>

          <button
            type="button"
            onClick={dismissDock}
            aria-label="Close persistent audio player"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-muted)] hover:text-[var(--a-ink)] hover:bg-[var(--a-surface)] transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
