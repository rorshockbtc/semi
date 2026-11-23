'use client';

import React, { useRef, useState } from 'react';
import { Play } from 'lucide-react';

export default function WelcomeVideoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setHasStarted(true);
    void vid.play();
  };

  return (
    <section
      aria-labelledby="home-welcome-video-title"
      data-testid="home-welcome-video"
      className="border-b border-[var(--a-rule)] py-12 sm:py-16"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="lg:col-span-5 min-w-0 space-y-3 sm:space-y-4">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
            00:15 · Studio Note
          </p>
          <h2
            id="home-welcome-video-title"
            className="font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)] leading-[1.08]"
          >
            Welcome to the site.
          </h2>
          <p className="max-w-[44ch] text-[16px] leading-relaxed text-[var(--a-ink)]/80">
            A quick hello from Semi (; - ]) before you explore the <em>I/O</em> sessions,
            press play on a track, or read the studio notes.
          </p>
        </div>

        <div className="lg:col-span-7 min-w-0">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[#111827] shadow-[0_24px_60px_-24px_rgba(17,24,39,0.28)]">
            <video
              ref={videoRef}
              src="/loops/semi-welcome.mp4"
              poster="/photos/semi-welcome-poster.jpg"
              controls={hasStarted}
              playsInline
              preload="metadata"
              onPlay={() => setHasStarted(true)}
              className="aspect-video w-full object-cover"
            />
            {!hasStarted && (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Play welcome video from Semi"
                data-testid="welcome-video-play-btn"
                className="group absolute inset-0 flex items-center justify-center bg-[#111827]/20 transition-colors hover:bg-[#111827]/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--a-accent-fill)]"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--a-surface)]/95 text-[var(--a-ink)] shadow-lg transition-transform duration-200 group-hover:scale-105">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
