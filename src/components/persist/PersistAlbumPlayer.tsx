'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import type { PersistTrack } from '@/data/persist-songs';

function fmtTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Continuous in-page album player for `/persist` (stream-only, zero downloads).
 * Automatically advances through all unlocked tracks in order without reloading pages.
 */
export default function PersistAlbumPlayer({
  tracks,
  activeIndex,
  playing,
  token,
  onSelectIndex,
  onPlayingChange,
}: {
  tracks: PersistTrack[];
  activeIndex: number;
  playing: boolean;
  token: string;
  onSelectIndex: (index: number) => void;
  onPlayingChange: (playing: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[activeIndex] ?? tracks[0];
  const src = `/api/persist/audio/${track.slug}?token=${encodeURIComponent(token)}`;

  // Sync play/pause & track changes seamlessly
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playing, activeIndex, src]);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      onPlayingChange(true);
      void audio.play().catch(() => {});
    } else {
      onPlayingChange(false);
      audio.pause();
    }
  };

  const handlePrev = () => {
    const prev = (activeIndex - 1 + tracks.length) % tracks.length;
    onSelectIndex(prev);
    onPlayingChange(true);
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % tracks.length;
    onSelectIndex(next);
    onPlayingChange(true);
  };

  const handleEnded = () => {
    if (activeIndex < tracks.length - 1) {
      onSelectIndex(activeIndex + 1);
      onPlayingChange(true);
    } else {
      onPlayingChange(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Number(e.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div
      data-testid="persist-continuous-player"
      className="sticky bottom-3 z-40 mx-auto max-w-[1340px] rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)]/95 p-4 sm:p-5 shadow-[0_20px_50px_-18px_rgba(17,24,39,0.35)] backdrop-blur-md"
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        controlsList="nodownload noplaybackrate"
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onPlay={() => onPlayingChange(true)}
        onPause={() => onPlayingChange(false)}
        onEnded={handleEnded}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Track Identity */}
        <div className="flex min-w-0 items-center gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={track.artworkSrc}
            alt={track.title}
            className="h-12 w-12 shrink-0 rounded-lg border border-[var(--a-rule)] object-cover"
          />
          <div className="min-w-0">
            <p className="font-code text-[13px] text-[var(--a-accent-text)] truncate">
              {track.number} · {track.zoneLabel} · Stream-only
            </p>
            <p className="font-display text-[17px] font-bold text-[var(--a-ink)] truncate">
              {track.title}
            </p>
          </div>
        </div>

        {/* Transport Controls + Scrub Bar */}
        <div className="flex flex-1 flex-col gap-2 sm:max-w-[480px]">
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous track"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)] transition-colors hover:border-[var(--a-ink)]"
            >
              <SkipBack className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleToggle}
              aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
              data-testid="persist-bar-play-btn"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white transition-colors hover:bg-[var(--a-ink)]"
            >
              {playing ? (
                <Pause className="h-4 w-4" fill="currentColor" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next track"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)] transition-colors hover:border-[var(--a-ink)]"
            >
              <SkipForward className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-code text-[13px] tabular-nums text-[var(--a-muted)]">
              {fmtTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.5}
              value={Math.min(currentTime, duration || 1)}
              onChange={handleSeek}
              aria-label={`Seek ${track.title}`}
              className="h-1.5 flex-1 cursor-pointer accent-[var(--a-accent-fill)]"
            />
            <span className="font-code text-[13px] tabular-nums text-[var(--a-muted)]">
              {duration ? fmtTime(duration) : track.duration}
            </span>
          </div>
        </div>

        {/* Story & Chords link */}
        <Link
          href={`/persist/${track.slug}`}
          className="hidden lg:inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-4 text-[14px] font-semibold text-[var(--a-ink)] no-underline transition-colors hover:border-[var(--a-ink)]"
        >
          <span>Story &amp; Chords</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
