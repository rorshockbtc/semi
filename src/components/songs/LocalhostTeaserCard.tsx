'use client';

import React from 'react';
import { Lock, Pause, Play, Sparkles } from 'lucide-react';
import { AUDIO_MASTER_REV } from '@/data/audio-manifest';
import { useAudioPlayer, type DockTrack } from '@/context/AudioPlayerContext';
import { triggerOpenDeluxeModal } from '@/components/songs/DeluxeAlbumModal';

const FALLBACK_DURATION = 179; // 02:59
const LOCALHOST_TEASER_SLUG = 'localhost-teaser';

const LOCALHOST_TEASER_TRACK: DockTrack = {
  number: '14',
  slug: LOCALHOST_TEASER_SLUG,
  title: 'Localhost',
  subtitle: 'I/O Deluxe Bonus · Stream-Only Preview',
  duration: '02:59',
  mp3Src: `/api/album/teaser?v=${AUDIO_MASTER_REV}`,
  href: '/songs#deluxe-edition',
  album: 'I/O',
  artworkSrc: '/photos/io-album-cover.jpg',
};

function formatClock(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function LocalhostTeaserCard({
  testId = 'localhost-teaser-card',
  className = '',
}: {
  testId?: string;
  className?: string;
}) {
  const {
    currentTrack,
    isPlaying: globalPlaying,
    currentTime: globalCurrentTime,
    duration: globalDuration,
    playCustomTrack,
    seek,
  } = useAudioPlayer();

  const isActive = currentTrack.slug === LOCALHOST_TEASER_SLUG;
  const isPlaying = isActive && globalPlaying;
  const currentTime = isActive ? globalCurrentTime : 0;
  const duration = isActive && globalDuration > 0 ? globalDuration : FALLBACK_DURATION;

  const handleTogglePlay = () => {
    playCustomTrack(LOCALHOST_TEASER_TRACK);
  };

  const handleSeek = (nextSeconds: number) => {
    const clamped = Math.max(0, Math.min(nextSeconds, duration || FALLBACK_DURATION));
    if (!isActive) {
      playCustomTrack(LOCALHOST_TEASER_TRACK);
    }
    seek(clamped);
  };

  return (
    <div
      data-testid={testId}
      data-playing={isPlaying ? 'true' : 'false'}
      onContextMenu={(e) => e.preventDefault()}
      className={`rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] p-4 sm:p-5 space-y-3.5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-code text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
          <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Deluxe Bonus Track 14 · Stream-Only Preview</span>
        </span>
        <span className="inline-flex items-center gap-1.5 font-code text-[13px] text-[var(--a-muted)]">
          <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Download in Deluxe ($12.99)</span>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause Localhost bonus preview' : 'Play Localhost bonus preview'}
            data-testid={`${testId}-play-btn`}
            className="inline-flex h-12 w-12 min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-full bg-[var(--a-ink)] hover:bg-[var(--a-accent-fill)] text-white transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4 translate-x-[1px]" fill="currentColor" aria-hidden="true" />
            )}
          </button>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-lg sm:text-xl font-bold text-[var(--a-ink)] truncate">
                14 · Localhost
              </p>
              <span className="font-code text-[13px] text-[var(--a-muted)] shrink-0 tabular-nums">
                {formatClock(currentTime)} / {formatClock(duration)}
              </span>
            </div>
            <p className="text-[14px] text-[var(--a-muted)] leading-snug">
              “Oh-oh, running on localhost / Making my home where the light hits most…”
            </p>
            <input
              type="range"
              min={0}
              max={Math.max(1, Math.floor(duration))}
              step={1}
              value={Math.min(Math.floor(currentTime), Math.max(1, Math.floor(duration)))}
              aria-label="Seek Localhost bonus preview"
              onInput={(e) => handleSeek(Number((e.target as HTMLInputElement).value))}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-2 cursor-pointer accent-[#FE299E]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => triggerOpenDeluxeModal('buy')}
          data-testid={`${testId}-unlock-btn`}
          className="inline-flex min-h-[46px] shrink-0 items-center justify-center rounded-full border border-[var(--a-accent-text)]/40 bg-[var(--a-surface)] hover:bg-[var(--a-ink)] text-[var(--a-ink)] hover:text-[#FAF8F5] px-4 py-2 text-[14px] font-semibold transition-colors"
        >
          Unlock MP3 in Deluxe · $12.99
        </button>
      </div>
    </div>
  );
}
