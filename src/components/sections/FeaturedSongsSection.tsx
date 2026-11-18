'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  Download,
  ExternalLink,
  Pause,
  Play,
  Video,
  X,
} from 'lucide-react';
import FloatingSparklesCanvas from '@/art/FloatingSparklesCanvas';
import { bloomHandlers } from '@/art/bloom';
import AmbientLoopVideo from '@/components/AmbientLoopVideo';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { SEMI_TRACKS, type SemiTrack } from '@/data/semi-songs';

export default function FeaturedSongsSection() {
  const { currentTrack, isPlaying, playTrack, pauseAudio } = useAudioPlayer();
  const [videoTrack, setVideoTrack] = useState<SemiTrack | null>(null);

  function handleWatchVideo(track: SemiTrack) {
    pauseAudio();
    setVideoTrack(track);
  }

  return (
    <section
      id="songs"
      aria-labelledby="songs-title"
      className="relative scroll-mt-24 border-b border-[var(--a-rule)] bg-[var(--a-bg)] py-20 sm:py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
              01 · The Songs &amp; Stories (Local Current)
            </p>
            <h2 id="songs-title" className="font-display text-big font-bold text-[var(--a-ink)]">
              Listen first.{' '}
              <span className="font-serif italic font-normal">
                Open the story whenever you’re curious.
              </span>
            </h2>
          </div>

          <p className="max-w-[46ch] text-base sm:text-lg text-[var(--a-ink)]/80">
            A good song works even if you never look up a single reference. Play the music videos or
            download the 320 kbps MP3s below—and open any song’s dedicated story page for full lyrics
            and a plain-English guide to what she’s singing about.
          </p>
        </div>

        {/* Inline YouTube Video Screening Theatre (mounts cleanly when user clicks Watch Video) */}
        {videoTrack && (
          <div
            data-testid="home-video-theatre"
            className="rounded-3xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-5 sm:p-8 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--a-rule)] pb-4">
              <div>
                <p className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                  Now Screening · Track {videoTrack.number} · {videoTrack.duration}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
                  {videoTrack.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/songs/${videoTrack.slug}`}
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-[var(--a-ink)] px-5 text-[14px] font-semibold text-[var(--a-bg)] no-underline hover:bg-[var(--a-accent-fill)] transition-colors"
                >
                  <span>Read Story &amp; Lyrics</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setVideoTrack(null)}
                  aria-label="Close video screening"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)] hover:border-[var(--a-ink)]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-[#111827]">
              <iframe
                key={videoTrack.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${videoTrack.youtubeId}?autoplay=1&rel=0`}
                title={`${videoTrack.title} — Semi music video on YouTube`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                data-testid="youtube-embed-iframe"
                className="h-full w-full border-0"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {SEMI_TRACKS.map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => handleWatchVideo(t)}
                    className={`min-h-[44px] rounded-full px-4 text-[14px] font-medium transition-colors ${
                      t.slug === videoTrack.slug
                        ? 'bg-[var(--a-accent-fill)] text-white'
                        : 'border border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                    }`}
                  >
                    {t.number} · {t.title}
                  </button>
                ))}
              </div>
              <a
                href={videoTrack.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wc-link min-h-[44px] inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--a-ink)]"
              >
                <span>Open on YouTube</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}

        {/* Prominent 3-Song Pedestals — Unique Living Video Loop + Story Page + MP3 Download */}
        <div className="divide-y divide-[var(--a-rule)] border-y border-[var(--a-rule)]">
          {SEMI_TRACKS.map((track) => {
            const active = currentTrack.slug === track.slug;
            const playingThis = active && isPlaying;

            return (
              <article
                key={track.slug}
                data-testid={`featured-song-${track.number}`}
                className="py-10 sm:py-12 grid gap-8 lg:grid-cols-12 lg:items-center"
              >
                {/* Left: Unique Animated Film Loop with Subtle Sparkles */}
                <div className="lg:col-span-5">
                  <div className="relative overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[#111827]">
                    <AmbientLoopVideo
                      src={track.loopSrc}
                      poster={track.poster}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0">
                      <FloatingSparklesCanvas
                        count={18}
                        intensity={playingThis ? 1.35 : 0.8}
                        isPlaying={playingThis}
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111827]/75 to-transparent"
                    />
                    <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <span className="font-code text-[13px] text-[#F7B9C9]">
                        Track {track.number} · {track.duration}
                      </span>
                      <span className="font-code text-[13px] opacity-90">{track.subtitle}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Plain-English Description, Play/Watch/Download, & Dedicated Story Page */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {track.themes.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[var(--a-surface)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--a-ink)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)]">
                      <Link
                        href={`/songs/${track.slug}`}
                        className="no-underline text-[var(--a-ink)] hover:text-[var(--a-accent-text)] transition-colors"
                      >
                        {track.title}
                      </Link>
                    </h3>
                    <p className="font-serif italic text-xl sm:text-2xl text-[var(--a-ink)]/85">
                      “{track.pullQuote}”
                    </p>
                  </div>

                  <p className="max-w-[58ch] text-base sm:text-lg leading-relaxed text-[var(--a-ink)]/80">
                    {track.shortSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      href={`/songs/${track.slug}`}
                      data-testid={`story-link-${track.number}`}
                      {...bloomHandlers<HTMLAnchorElement>()}
                      className="wc-cta inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white no-underline shadow-[0_10px_28px_-12px_rgba(254,41,158,0.68)]"
                    >
                      <BookOpenText className="h-4 w-4" aria-hidden="true" />
                      <span>Story &amp; Lyrics</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => playTrack(track.slug)}
                      data-testid={`play-track-${track.number}`}
                      className={`min-h-[46px] inline-flex items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition-colors ${
                        playingThis
                          ? 'bg-[var(--a-ink)] text-white'
                          : 'border border-[var(--a-rule)] bg-[var(--a-surface)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                      }`}
                    >
                      {playingThis ? (
                        <>
                          <Pause className="h-4 w-4" aria-hidden="true" />
                          <span>Pause MP3</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" aria-hidden="true" />
                          <span>Play MP3</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWatchVideo(track)}
                      data-testid={`watch-video-${track.number}`}
                      className="min-h-[46px] inline-flex items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] px-5 text-[15px] font-medium text-[var(--a-ink)] hover:border-[var(--a-ink)] transition-colors"
                    >
                      <Video className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                      <span>Watch Video</span>
                    </button>

                    <a
                      href={track.mp3Src}
                      download={track.downloadName}
                      data-testid={`download-mp3-${track.number}`}
                      className="wc-link min-h-[44px] inline-flex items-center gap-1.5 px-2 text-[15px] font-semibold text-[var(--a-accent-text)]"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      <span>Download MP3</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-code text-[13px] text-[var(--a-muted)]">
            Full debut LP (“Local Current”) in progress · 5 more acoustic tracks on the way.
          </p>
          <Link
            href="/songs"
            className="wc-link min-h-[44px] inline-flex items-center gap-1.5 text-base font-semibold text-[var(--a-ink)]"
          >
            <span>Explore full discography &amp; upcoming tracks →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
