'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Download, Pause, Play, X } from 'lucide-react';
import { VinylDisc } from '@/art/themes';
import AmbientLoopVideo from '@/components/AmbientLoopVideo';
import YouTubePlayer from '@/components/YouTubePlayer';
import SongNotifyCard from '@/components/sections/SongNotifyCard';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { SEMI_TRACKS, type SemiTrack } from '@/data/semi-songs';

export default function FeaturedSongsSection({
  eyebrow = 'The singles',
  showAllFeatured = false,
}: {
  eyebrow?: string;
  showAllFeatured?: boolean;
}) {
  const { currentTrack, isPlaying, playAllActive, playTrack, playAll, pauseAudio } = useAudioPlayer();
  const [videoTrack, setVideoTrack] = useState<SemiTrack | null>(null);

  const featuredTracks = showAllFeatured ? SEMI_TRACKS : SEMI_TRACKS.slice(0, 3);
  const addendumTracks = showAllFeatured ? [] : SEMI_TRACKS.slice(3);
  const playableCount = SEMI_TRACKS.filter((t) => Boolean(t.mp3Src)).length;
  const playingAllNow = playAllActive && isPlaying;

  return (
    <section
      id="songs"
      aria-labelledby="songs-title"
      className="relative scroll-mt-20 overflow-x-clip bg-[var(--a-bg)] py-16 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px] pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 min-w-0">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
              {eyebrow} · Local Current
            </p>
            <h2 id="songs-title" className="mt-3 sm:mt-4 font-display text-big font-bold text-[var(--a-ink)]">
              {showAllFeatured ? `${SEMI_TRACKS.length} songs.` : 'Three songs.'}{' '}
              <span className="font-serif italic font-normal">Each with a story.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 min-w-0 space-y-4 sm:space-y-5">
            <p className="text-base sm:text-lg leading-relaxed text-[var(--a-ink)]/75">
              Press play and let the music stand on its own. When you want to know what a lyric means,
              every song has its own page with the story and the full words.
            </p>
            <button
              type="button"
              onClick={playAll}
              data-testid="play-all-button"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center sm:justify-start gap-3 rounded-full bg-[var(--a-accent-fill)] pl-2 pr-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--a-ink)]"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
                {playingAllNow ? (
                  <Pause className="h-4 w-4" aria-hidden="true" fill="currentColor" />
                ) : (
                  <Play className="h-4 w-4 translate-x-[1px]" aria-hidden="true" fill="currentColor" />
                )}
              </span>
              <span>
                {playingAllNow
                  ? `Playing all · ${currentTrack.number}/${playableCount}`
                  : `Play all (${playableCount} songs)`}
              </span>
            </button>
          </div>
        </div>

        {videoTrack && (
          <div data-testid="home-video-theatre" className="mt-10 sm:mt-14 overflow-hidden rounded-[20px] sm:rounded-[28px] bg-[#0d0b0a]">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-7 sm:py-4 text-white">
              <p className="min-w-0 truncate font-display text-lg sm:text-2xl font-bold">{videoTrack.title}</p>
              <button
                type="button"
                onClick={() => setVideoTrack(null)}
                aria-label="Close video"
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full hover:bg-white/10"
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

        <ol className="mt-12 sm:mt-20 space-y-16 sm:space-y-28">
          {featuredTracks.map((track, idx) => {
            const playingThis = currentTrack.slug === track.slug && isPlaying;
            const flip = idx % 2 === 1;

            return (
              <li
                key={track.slug}
                data-testid={`featured-song-${track.number}`}
                className="group grid gap-7 sm:gap-10 lg:grid-cols-12 lg:items-center"
              >
                {/* Sleeve + vinyl */}
                <div className={`lg:col-span-6 min-w-0 overflow-x-clip py-2 -my-2 ${flip ? 'lg:order-2' : ''}`}>
                  <div className="relative mx-auto max-w-[560px] pr-[16%] sm:pr-[18%]">
                    <div
                      className={`absolute top-[5%] right-[2%] h-[90%] aspect-square transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        playingThis ? 'translate-x-0' : '-translate-x-[20%] group-hover:-translate-x-[8%]'
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
                      <span className="absolute left-4 bottom-3 sm:left-5 sm:bottom-4 font-display text-[44px] sm:text-[64px] leading-none font-bold text-white/90">
                        {track.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className={`lg:col-span-6 min-w-0 ${flip ? 'lg:order-1' : ''}`}>
                  <p className="font-code text-[13px] uppercase tracking-[0.16em] text-[var(--a-muted)]">
                    Track {track.number} · {track.duration}
                  </p>
                  <h3 className="mt-2.5 sm:mt-3 font-display text-[clamp(1.85rem,1.25rem+2.8vw,3.6rem)] font-bold leading-[1.03] tracking-[-0.025em] text-[var(--a-ink)]">
                    {track.title}
                  </h3>
                  <p className="mt-4 sm:mt-5 font-serif italic text-xl sm:text-2xl leading-snug text-[var(--a-ink)]/85 max-w-[34ch]">
                    “{track.pullQuote.split(' / ')[0]}”
                  </p>
                  <p className="mt-4 sm:mt-5 max-w-[48ch] text-base sm:text-lg leading-relaxed text-[var(--a-ink)]/75">
                    {track.shortSummary}
                  </p>

                  <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {track.mp3Src && (
                      <button
                        type="button"
                        onClick={() => playTrack(track.slug)}
                        data-testid={`play-track-${track.number}`}
                        aria-label={playingThis ? `Pause ${track.title}` : `Play ${track.title}`}
                        className="inline-flex min-h-[48px] sm:min-h-[52px] items-center gap-2.5 sm:gap-3 rounded-full bg-[var(--a-ink)] pl-2 pr-5 sm:pr-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--a-accent-fill)]"
                      >
                        <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                          {playingThis ? (
                            <Pause className="h-4 w-4" aria-hidden="true" fill="currentColor" />
                          ) : (
                            <Play className="h-4 w-4 translate-x-[1px]" aria-hidden="true" fill="currentColor" />
                          )}
                        </span>
                        {playingThis ? 'Pause' : 'Play'}
                      </button>
                    )}

                    <Link
                      href={`/songs/${track.slug}`}
                      data-testid={`story-link-${track.number}`}
                      className="inline-flex min-h-[48px] sm:min-h-[52px] items-center gap-2 rounded-full border border-[var(--a-ink)]/20 px-5 sm:px-6 text-[15px] font-semibold text-[var(--a-ink)] no-underline transition-colors hover:border-[var(--a-ink)]"
                    >
                      Story &amp; lyrics <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>

                    {track.youtubeId ? (
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
                    ) : (
                      <span className="inline-flex items-center min-h-[44px] px-3 font-code text-[13px] text-[var(--a-muted)]">
                        Video coming soon
                      </span>
                    )}

                    {track.mp3Src && (
                      <a
                        href={track.mp3Src}
                        download={track.downloadName}
                        data-testid={`download-mp3-${track.number}`}
                        aria-label={`Download ${track.title} MP3`}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-accent-text)] hover:bg-[var(--a-surface)]"
                      >
                        <Download className="h-5 w-5" aria-hidden="true" />
                      </a>
                    )}
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
            className="mt-16 sm:mt-24 border-t border-[var(--a-rule)] pt-10 sm:pt-12"
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
                    className="grid gap-5 sm:gap-6 py-6 first:pt-0 lg:grid-cols-12 lg:items-center"
                  >
                    <div className="lg:col-span-3 min-w-0">
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

                    <div className="lg:col-span-5 min-w-0">
                      <p className="font-code text-[13px] uppercase tracking-[0.16em] text-[var(--a-muted)]">
                        Track {track.number} · {track.duration} · {track.subtitle}
                      </p>
                      <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
                        {track.title}
                      </h3>
                      <p className="mt-2 text-[15px] sm:text-[16px] leading-relaxed text-[var(--a-ink)]/75">
                        {track.shortSummary}
                      </p>
                    </div>

                    <div className="lg:col-span-4 min-w-0 flex flex-wrap items-center gap-2.5 lg:justify-end">
                      {track.mp3Src && (
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
                      )}

                      <Link
                        href={`/songs/${track.slug}`}
                        data-testid={`story-link-${track.number}`}
                        className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-[var(--a-ink)]/20 px-5 text-[14px] font-semibold text-[var(--a-ink)] no-underline transition-colors hover:border-[var(--a-ink)]"
                      >
                        Story &amp; lyrics <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>

                      {track.youtubeId ? (
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
                      ) : (
                        <span className="inline-flex items-center min-h-[44px] px-2.5 font-code text-[13px] text-[var(--a-muted)]">
                          Video coming soon
                        </span>
                      )}

                      {track.mp3Src && (
                        <a
                          href={track.mp3Src}
                          download={track.downloadName}
                          data-testid={`download-mp3-${track.number}`}
                          aria-label={`Download ${track.title} MP3`}
                          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-accent-text)] hover:bg-[var(--a-surface)]"
                        >
                          <Download className="h-5 w-5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}

        <SongNotifyCard />
      </div>
    </section>
  );
}
