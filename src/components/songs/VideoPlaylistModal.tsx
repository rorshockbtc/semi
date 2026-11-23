'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, SkipBack, SkipForward, Film, Play } from 'lucide-react';
import { SEMI_TRACKS, type SemiTrack } from '@/data/semi-songs';

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState?: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerInstance {
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

const VIDEO_TRACKS: SemiTrack[] = SEMI_TRACKS.filter((t) => Boolean(t.youtubeId));

interface VideoPlaylistButtonProps {
  className?: string;
}

export function VideoPlaylistButton({ className = '' }: VideoPlaylistButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="watch-all-videos-btn"
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-ink)] hover:bg-[var(--a-accent-fill)] text-[#FAF8F5] px-5 py-2.5 text-[14px] font-semibold transition-colors min-h-[48px] ${className}`}
      >
        <Film className="w-4 h-4 text-semi-pink" aria-hidden="true" />
        <span>Watch All Videos ({VIDEO_TRACKS.length} in Order)</span>
      </button>

      {open && <VideoPlaylistModal onClose={() => setOpen(false)} />}
    </>
  );
}

function VideoPlaylistModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    return () => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initPlayer = () => {
      if (cancelled || !playerHostRef.current || !window.YT?.Player) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(playerHostRef.current, {
        videoId: VIDEO_TRACKS[0].youtubeId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === 0) {
              // Video ended -> advance to next video in album order
              const next = activeIndexRef.current + 1;
              if (next < VIDEO_TRACKS.length) {
                activeIndexRef.current = next;
                setActiveIndex(next);
                event.target.loadVideoById(VIDEO_TRACKS[next].youtubeId);
              }
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevReady?.();
        initPlayer();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    }

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // Ignore teardown errors
      }
      playerRef.current = null;
    };
  }, []);

  const selectVideo = (idx: number) => {
    const clamped = (idx + VIDEO_TRACKS.length) % VIDEO_TRACKS.length;
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
    playerRef.current?.loadVideoById(VIDEO_TRACKS[clamped].youtubeId);
  };

  const current = VIDEO_TRACKS[activeIndex] ?? VIDEO_TRACKS[0];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label="I/O Album Video Film Series"
      className="fixed inset-0 z-50 m-auto w-[min(96vw,1080px)] max-h-[92vh] rounded-2xl border border-ink/15 bg-[#111827] text-[#FAF8F5] p-0 shadow-2xl backdrop:bg-black/75 overflow-hidden"
    >
      <div className="flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-white/10">
          <div className="min-w-0">
            <p className="text-[13px] uppercase tracking-[0.14em] text-semi-pink font-medium">
              I/O · Continuous Film Sequence ({activeIndex + 1} of {VIDEO_TRACKS.length})
            </p>
            <h2 className="text-[18px] font-semibold truncate">
              {current.number} · {current.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => selectVideo(activeIndex - 1)}
              aria-label="Previous video"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => selectVideo(activeIndex + 1)}
              aria-label="Next video"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video theater"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body: Video + Tracklist */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] flex-1 min-h-0 overflow-y-auto">
          <div className="bg-black flex items-center justify-center aspect-video w-full">
            <div ref={playerHostRef} className="w-full h-full" />
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto max-h-[300px] lg:max-h-[540px] divide-y divide-white/10">
            {VIDEO_TRACKS.map((track, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={track.slug}
                  type="button"
                  onClick={() => selectVideo(idx)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors min-h-[48px] ${
                    isCurrent ? 'bg-semi-pink/20 text-white' : 'hover:bg-white/5 text-white/80'
                  }`}
                >
                  <span className="text-[13px] font-mono text-semi-pink shrink-0 w-6">
                    {track.number}
                  </span>
                  <span className="text-[14px] font-medium truncate flex-1">{track.title}</span>
                  {isCurrent && <Play className="w-3.5 h-3.5 text-semi-pink shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
