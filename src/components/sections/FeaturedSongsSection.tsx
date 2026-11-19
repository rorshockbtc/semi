'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Download, Pause, Play, X } from 'lucide-react';
import { VinylDisc } from '@/art/themes';
import AmbientLoopVideo from '@/components/AmbientLoopVideo';
import YouTubePlayer from '@/components/YouTubePlayer';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { SEMI_TRACKS, type SemiTrack } from '@/data/semi-songs';

export default function FeaturedSongsSection({
  eyebrow = 'The singles',
  showAllFeatured = false,
}: {
  eyebrow?: string;
  showAllFeatured?: boolean;
}) {
  const { currentTrack, isPlaying, playTrack, pauseAudio } = useAudioPlayer();
  const [videoTrack, setVideoTrack] = useState<SemiTrack | null>(null);

  const featuredTracks = showAllFeatured ? SEMI_TRACKS : SEMI_TRACKS.slice(0, 3);
  const addendumTracks = showAllFeatured ? [] : SEMI_TRACKS.slice(3);

  return (
    <section
      id="songs"
      aria-labelledby="songs-title"
      className="relative scroll-mt-20 bg-[var(--a-bg)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
              {eyebrow} · Local Current
            </p>
            <h2 id="songs-title" className="mt-4 font-display text-big font-bold text-[var(--a-ink)]">
              {showAllFeatured ? 'Four songs.' : 'Three songs.'}{' '}
              <span className="font-serif italic font-normal">Each with a story.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-lg leading-relaxed text-[var(--a-ink)]/75">
            Press play and let the music stand on its own. When you want to know what a lyric means,
            every song has its own page with the story and the full words.
          </p>
        </div>

        {videoTrack && (
          <div data-testid="home-video-theatre" className="mt-14 overflow-hidden rounded-[28px] bg-[#0d0b0a]">
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7 text-white">
              <p className="font-display text-xl sm:text-2xl font-bold">{videoTrack.title}</p>
              <button
                type="button"
                onClick={() => setVideoTrack(null)}
                aria-label="Close video"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <YouTubePlayer
              key={videoTrack.youtubeId}
              youtubeId={videoTrack.youtubeId}
              title={videoTrack.title}
              posterSrc={videoTrack.poster}
              autoplay
              iframeTestId="youtube-embed-iframe"
            />
          </div>
        )}

        <ol className="mt-16 sm:mt-20 space-y-20 sm:space-y-28">
          {featuredTracks.map((track, idx) => {
            const playingThis = currentTrack.slug === track.slug && isPlaying;
            const flip = idx % 2 === 1;

            return (
              <li
                key={track.slug}
                data-testid={`featured-song-${track.number}`}
                className="group grid gap-10 lg:grid-cols-12 lg:items-center"
              >
                {/* Sleeve + vinyl */}
                <div className={`lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}>
                  <div className="relative mx-auto max-w-[560px] pr-[18%]">
                    <div
                      className={`absolute top-[5%] right-0 h-[90%] aspect-square transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        playingThis ? 'translate-x-[2%]' : '-translate-x-[22%] group-hover:-translate-x-[8%]'
                      }`}
                    >
                      <VinylDisc label={track.poster} spinning={playingThis} className="relative h-full w-full" />
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#0d0b0a] shadow-[0_30px_60px_-30px_rgba(17,24,39,0.55)]">
                      <AmbientLoopVideo
                        src={track.loopSrc}
                        poster={track.poster}
                        className="h-full w-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <span className="absolute left-5 bottom-4 font-display text-[64px] leading-none font-bold text-white/90">
                        {track.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className={`lg:col-span-6 ${flip ? 'lg:order-1' : ''}`}>
                  <p className="font-code text-[13px] uppercase tracking-[0.16em] text-[var(--a-muted)]">
                    Track {track.number} · {track.duration}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(2.2rem,4.2vw,3.6rem)] font-bold leading-[1] tracking-[-0.025em] text-[var(--a-ink)]">
                    {track.title}
                  </h3>
                  <p className="mt-5 font-serif italic text-2xl leading-snug text-[var(--a-ink)]/85 max-w-[34ch]">
                    “{track.pullQuote.split(' / ')[0]}”
                  </p>
                  <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-[var(--a-ink)]/75">
                    {track.shortSummary}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => playTrack(track.slug)}
                      data-testid={`play-track-${track.number}`}
                      aria-label={playingThis ? `Pause ${track.title}` : `Play ${track.title}`}
                      className="inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[var(--a-ink)] pl-2 pr-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--a-accent-fill)]"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                        {playingThis ? (
                          <Pause className="h-4 w-4" aria-hidden="true" fill="currentColor" />
                        ) : (
                          <Play className="h-4 w-4 translate-x-[1px]" aria-hidden="true" fill="currentColor" />
                        )}
                      </span>
                      {playingThis ? 'Pause' : 'Play'}
                    </button>

                    <Link
                      href={`/songs/${track.slug}`}
                      data-testid={`story-link-${track.number}`}
                      className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[var(--a-ink)]/20 px-6 text-[15px] font-semibold text-[var(--a-ink)] no-underline transition-colors hover:border-[var(--a-ink)]"
                    >
                      Story &amp; lyrics <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        pauseAudio();
                        setVideoTrack(track);
                        requestAnimationFrame(() =>
                          document.getElementById('songs')?.scrollIntoView({ behavior: 'smooth' })
                        );
                      }}
                      data-testid={`watch-video-${track.number}`}
                      className="min-h-[44px] px-3 text-[15px] font-semibold text-[var(--a-ink)]/80 hover:text-[var(--a-ink)]"
                    >
                      Watch video
                    </button>

                    <a
                      href={track.mp3Src}
                      download={track.downloadName}
                      data-testid={`download-mp3-${track.number}`}
                      aria-label={`Download ${track.title} MP3`}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-accent-text)] hover:bg-[var(--a-surface)]"
                    >
                      <Download className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {addendumTracks.length > 0 && (
          <aside
            aria-label="Song addendum"
            data-testid="songs-addendum"
            className="mt-20 sm:mt-24 border-t border-[var(--a-rule)] pt-12"
          >
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
              Addendum · Also just released
            </p>
            <ul role="list" className="mt-6 divide-y divide-[var(--a-rule)]">
              {addendumTracks.map((track) => {
                const playingThis = currentTrack.slug === track.slug && isPlaying;
                return (
                  <li
                    key={track.slug}
                    data-testid={`addendum-song-${track.number}`}
                    className="grid gap-6 py-6 first:pt-0 lg:grid-cols-12 lg:items-center"
                  >
                    <div className="lg:col-span-3">
                      <div className="overflow-hidden rounded-[6px] bg-[#0d0b0a]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={track.poster}
                          alt={track.posterAlt}
                          loading="lazy"
                          className="aspect-video w-full object-cover object-[50%_22%]"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <p className="font-code text-[13px] uppercase tracking-[0.16em] text-[var(--a-muted)]">
                        Track {track.number} · {track.duration} · {track.subtitle}
                      </p>
                      <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
                        {track.title}
                      </h3>
                      <p className="mt-2 text-[16px] leading-relaxed text-[var(--a-ink)]/75">
                        {track.shortSummary}
                      </p>
                    </div>

                    <div className="lg:col-span-4 flex flex-wrap items-center gap-2.5 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => playTrack(track.slug)}
                        data-testid={`play-track-${track.number}`}
                        aria-label={playingThis ? `Pause ${track.title}` : `Play ${track.title}`}
                        className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[var(--a-ink)] pl-2 pr-5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--a-accent-fill)]"
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                          {playingThis ? (
                            <Pause className="h-3.5 w-3.5" aria-hidden="true" fill="currentColor" />
                          ) : (
                            <Play className="h-3.5 w-3.5 translate-x-[1px]" aria-hidden="true" fill="currentColor" />
                          )}
                        </span>
                        {playingThis ? 'Pause' : 'Play'}
                      </button>

                      <Link
                        href={`/songs/${track.slug}`}
                        data-testid={`story-link-${track.number}`}
                        className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-[var(--a-ink)]/20 px-5 text-[14px] font-semibold text-[var(--a-ink)] no-underline transition-colors hover:border-[var(--a-ink)]"
                      >
                        Story &amp; lyrics <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          pauseAudio();
                          setVideoTrack(track);
                          requestAnimationFrame(() =>
                            document.getElementById('songs')?.scrollIntoView({ behavior: 'smooth' })
                          );
                        }}
                        data-testid={`watch-video-${track.number}`}
                        className="min-h-[44px] px-2.5 text-[14px] font-semibold text-[var(--a-ink)]/80 hover:text-[var(--a-ink)]"
                      >
                        Watch video
                      </button>

                      <a
                        href={track.mp3Src}
                        download={track.downloadName}
                        data-testid={`download-mp3-${track.number}`}
                        aria-label={`Download ${track.title} MP3`}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-accent-text)] hover:bg-[var(--a-surface)]"
                      >
                        <Download className="h-5 w-5" aria-hidden="true" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
}
