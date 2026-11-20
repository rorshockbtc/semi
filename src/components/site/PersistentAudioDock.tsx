'use client';

import React from 'react';
import Link from 'next/link';
import { Download, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX, X } from 'lucide-react';
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
    playAllActive,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    dismissDock,
  } = useAudioPlayer();

  const [isScrubbing, setIsScrubbing] = React.useState(false);
  const [scrubValue, setScrubValue] = React.useState(0);

  if (!hasStarted) return null;

  const maxDuration = duration > 0 ? duration : 180;
  const displayTime = isScrubbing ? scrubValue : currentTime;
  const effectiveVolume = isMuted ? 0 : volume;
  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  return (
    <aside
      aria-label="Persistent music player"
      data-testid="persistent-audio-dock"
      data-play-all={playAllActive ? 'true' : 'false'}
      className="fixed inset-x-0 bottom-[max(0.625rem,env(safe-area-inset-bottom,0px))] z-40 pl-[max(0.625rem,env(safe-area-inset-left,0px))] pr-[max(0.625rem,env(safe-area-inset-right,0px))] sm:px-6 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-[1160px] rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)]/96 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 shadow-[0_20px_50px_-15px_rgba(17,24,39,0.28)]">
        {/* Desktop: single stable horizontal bar. Mobile: fixed 2-row compact layout with zero reflow */}
        <div className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0,1fr)_minmax(200px,340px)_auto] md:items-center md:gap-4">
          {/* Row 1 on mobile / Left on desktop: Track title + mobile Mute/MP3/Close actions */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="hidden md:flex items-center gap-1 shrink-0">
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
            </div>

            <div className="min-w-0 flex-1 md:pl-1">
              <Link
                href={`/songs/${currentTrack.slug}`}
                className="wc-link block font-display text-[15px] sm:text-lg font-bold text-[var(--a-ink)] truncate"
              >
                {currentTrack.number} · {currentTrack.title}
              </Link>
              <p className="font-code text-[13px] text-[var(--a-muted)] truncate">
                Semi (; - ]) · {currentTrack.subtitle}
                {playAllActive ? ' · Playing all' : ''}
              </p>
            </div>

            {/* Mobile-only right utility buttons so the dock stays compact (2 rows max) */}
            <div className="flex md:hidden items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={effectiveVolume === 0 ? 'Unmute audio' : 'Mute audio'}
                aria-pressed={effectiveVolume === 0}
                data-testid="dock-mute-mobile"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)] transition-colors"
              >
                <VolumeIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              {currentTrack.mp3Src && (
                <a
                  href={currentTrack.mp3Src}
                  download={currentTrack.downloadName}
                  aria-label={`Download ${currentTrack.title} MP3`}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-accent-text)] hover:bg-[var(--a-surface)] transition-colors"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
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

          {/* Row 2 on mobile / Middle on desktop: Transport (mobile) + fixed-width time + scrubber */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <div className="flex md:hidden items-center shrink-0">
              <button
                type="button"
                onClick={prevTrack}
                aria-label="Previous track (mobile)"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)] transition-colors"
              >
                <SkipBack className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
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
                aria-label="Next track (mobile)"
                data-testid="dock-next-mobile"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)] transition-colors"
              >
                <SkipForward className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <span className="w-[2.75rem] shrink-0 text-right font-code text-[13px] tabular-nums text-[var(--a-muted)]">
              {formatTime(displayTime)}
            </span>
            <input
              type="range"
              min={0}
              max={maxDuration}
              step={0.5}
              value={Math.min(displayTime, maxDuration)}
              onPointerDown={(e) => {
                setIsScrubbing(true);
                setScrubValue(currentTime);
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                  // Pointer capture not supported on this device
                }
              }}
              onChange={(e) => {
                const val = Number(e.target.value);
                setScrubValue(val);
                if (!isScrubbing) {
                  seek(val);
                }
              }}
              onPointerUp={(e) => {
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {
                  // Ignore
                }
                seek(scrubValue);
                setIsScrubbing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  const step = e.key === 'ArrowLeft' ? -5 : 5;
                  const target = Math.max(0, Math.min(maxDuration, currentTime + step));
                  seek(target);
                }
              }}
              aria-label="Seek track progress"
              className="semi-range min-w-0 flex-1 min-h-[44px]"
            />
            <span className="w-[2.75rem] shrink-0 text-left font-code text-[13px] tabular-nums text-[var(--a-muted)]">
              {duration > 0 ? formatTime(duration) : currentTrack.duration}
            </span>
          </div>

          {/* Desktop-only right utility buttons: Volume + MP3 + Close */}
          <div className="hidden md:flex items-center justify-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={effectiveVolume === 0 ? 'Unmute audio' : 'Mute audio'}
                aria-pressed={effectiveVolume === 0}
                data-testid="dock-mute-toggle"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)] transition-colors"
              >
                <VolumeIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={effectiveVolume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
                data-testid="dock-volume-slider"
                className="semi-range w-20 min-h-[44px]"
              />
            </div>

            {currentTrack.mp3Src && (
              <a
                href={currentTrack.mp3Src}
                download={currentTrack.downloadName}
                className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] px-4 text-[14px] font-semibold text-[var(--a-accent-text)] no-underline hover:border-[var(--a-accent-text)] transition-colors"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>MP3</span>
              </a>
            )}

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
      </div>
    </aside>
  );
}
