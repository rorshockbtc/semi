'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  Film,
  Pause,
  Play,
  Video,
} from 'lucide-react';
import FloatingSparklesCanvas from '@/art/FloatingSparklesCanvas';
import { bloomHandlers } from '@/art/bloom';
import AmbientLoopVideo from '@/components/AmbientLoopVideo';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import type { SemiTrack } from '@/data/semi-songs';

interface SongEditionClientProps {
  track: SemiTrack;
  prevTrack: SemiTrack;
  nextTrack: SemiTrack;
}

export default function SongEditionClient({
  track,
  prevTrack,
  nextTrack,
}: SongEditionClientProps) {
  const { currentTrack, isPlaying, playTrack, pauseAudio } = useAudioPlayer();
  const [stageView, setStageView] = useState<'video' | 'loop'>('video');

  const isThisTrackActive = currentTrack.slug === track.slug;
  const playingThis = isThisTrackActive && isPlaying;

  return (
    <article data-testid={`song-edition-${track.slug}`} className="bg-[var(--a-bg)]">
      {/* Top Hero & Screening Stage */}
      <header className="relative overflow-hidden border-b border-[var(--a-rule)] bg-[var(--a-surface)] pt-28 pb-16 sm:pt-36 sm:pb-20">
        <FloatingSparklesCanvas
          count={34}
          intensity={playingThis ? 1.3 : 0.9}
          isPlaying={playingThis}
        />

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/songs"
              className="wc-link min-h-[44px] inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--a-ink)]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>All Songs &amp; Stories</span>
            </Link>

            <span className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
              Track {track.number} · {track.subtitle} · {track.readingTime}
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                {track.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full bg-[var(--a-well)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--a-ink)]"
                  >
                    {theme}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-big font-bold text-[var(--a-ink)]">
                {track.title}
              </h1>

              <p className="font-serif italic text-2xl sm:text-3xl leading-snug text-[var(--a-ink)]/90">
                “{track.pullQuote}”
              </p>

              <p className="max-w-[52ch] text-base sm:text-lg leading-relaxed text-[var(--a-ink)]/80">
                {track.linerNote}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => playTrack(track.slug)}
                  data-testid="edition-play-mp3"
                  {...bloomHandlers<HTMLButtonElement>()}
                  className="wc-cta inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(254,41,158,0.7)]"
                >
                  {playingThis ? (
                    <>
                      <Pause className="h-4 w-4" aria-hidden="true" />
                      <span>Pause MP3</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" aria-hidden="true" />
                      <span>Play 320 kbps MP3</span>
                    </>
                  )}
                </button>

                <a
                  href={track.mp3Src}
                  download={track.downloadName}
                  data-testid="edition-download-mp3"
                  className="min-h-[48px] inline-flex items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-5 text-[15px] font-semibold text-[var(--a-ink)] no-underline hover:border-[var(--a-ink)] transition-colors"
                >
                  <Download className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                  <span>Download MP3 ({track.duration})</span>
                </a>

                <a
                  href={track.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wc-link min-h-[44px] inline-flex items-center gap-1.5 px-2 text-[14px] font-semibold text-[var(--a-ink)]"
                >
                  <span>YouTube</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Right: YouTube Music Video Embed or Living Studio Loop */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      pauseAudio();
                      setStageView('video');
                    }}
                    className={`min-h-[44px] inline-flex items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition-colors ${
                      stageView === 'video'
                        ? 'bg-[var(--a-ink)] text-[var(--a-bg)]'
                        : 'border border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)]'
                    }`}
                  >
                    <Video className="h-4 w-4" aria-hidden="true" />
                    <span>Music Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStageView('loop')}
                    className={`min-h-[44px] inline-flex items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition-colors ${
                      stageView === 'loop'
                        ? 'bg-[var(--a-ink)] text-[var(--a-bg)]'
                        : 'border border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)]'
                    }`}
                  >
                    <Film className="h-4 w-4" aria-hidden="true" />
                    <span>Studio Reel</span>
                  </button>
                </div>

                <a
                  href="#lyrics"
                  className="wc-link min-h-[44px] inline-flex items-center text-[14px] font-semibold text-[var(--a-accent-text)]"
                >
                  Jump to Lyrics ↓
                </a>
              </div>

              <div className="aspect-video w-full overflow-hidden rounded-3xl border border-[var(--a-rule)] bg-[#111827] shadow-xl">
                {stageView === 'video' ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${track.youtubeId}?rel=0`}
                    title={`${track.title} — Semi music video on YouTube`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    data-testid="edition-youtube-iframe"
                    className="h-full w-full border-0"
                  />
                ) : (
                  <AmbientLoopVideo
                    src={track.loopSrc}
                    poster={track.poster}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Warm Reassurance Banner */}
          <div className="border-l-2 border-[var(--a-accent)] pl-5 py-1">
            <p className="max-w-[74ch] text-base sm:text-lg text-[var(--a-ink)]/85">
              {track.reassuranceNote}
            </p>
          </div>
        </div>
      </header>

      {/* Editorial Essay Spine + Sticky Plain-English Decoder */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-16 sm:py-24 grid gap-12 lg:grid-cols-12">
        {/* Left: Long-Form Story Essay */}
        <div className="lg:col-span-7 space-y-12 max-w-[66ch]">
          <div className="space-y-3 border-b border-[var(--a-rule)] pb-6">
            <p className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
              Behind the Song
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-[var(--a-ink)]">
              {track.essayTitle}
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl text-[var(--a-muted)]">
              {track.essaySubtitle}
            </p>
          </div>

          {track.essaySections.map((section) => (
            <section key={section.heading} className="space-y-5">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
                {section.heading}
              </h3>

              {section.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-lg leading-[1.7] text-[var(--a-ink)]/90"
                >
                  {p}
                </p>
              ))}

              {section.plateSrc && (
                <figure className="pt-2 space-y-2.5">
                  <div className="overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.plateSrc}
                      alt={section.plateAlt || section.heading}
                      loading="lazy"
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                  {section.plateCaption && (
                    <figcaption className="font-serif italic text-lg text-[var(--a-muted)] border-t border-[var(--a-rule)] pt-2">
                      {section.plateCaption}
                    </figcaption>
                  )}
                </figure>
              )}
            </section>
          ))}
        </div>

        {/* Right: Sticky Plain-English Decoder Margin Notes */}
        <aside aria-label="Plain-English lyric decoder" className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 rounded-3xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-[var(--a-rule)] pb-4">
              <p className="inline-flex items-center gap-2 font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                <SemiMark className="text-[14px]" color="#FE299E" />
                <span>Plain-English Decoder</span>
              </p>
              <h2 className="font-display text-2xl font-bold text-[var(--a-ink)]">
                What the references mean
              </h2>
              <p className="text-[15px] text-[var(--a-muted)]">
                Quick translations for anyone curious about the tech or AI ideas inside the lyrics.
              </p>
            </div>

            <dl className="divide-y divide-[var(--a-rule)]">
              {track.plainEnglishGlossary.map((entry) => (
                <div key={entry.lyricOrTerm} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                  <dt className="font-display text-lg font-bold text-[var(--a-ink)]">
                    {entry.lyricOrTerm}
                  </dt>
                  <dd className="text-[15px] leading-relaxed text-[var(--a-ink)]/85">
                    {entry.plainMeaning}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      {/* Printed Lyric Sheet */}
      <section
        id="lyrics"
        aria-labelledby="lyrics-heading"
        className="scroll-mt-24 border-t border-[var(--a-rule)] bg-[var(--a-surface)] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--a-rule)] pb-6">
            <div className="space-y-2">
              <p className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                Track {track.number} · Full Lyrics
              </p>
              <h2 id="lyrics-heading" className="font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)]">
                {track.title}
              </h2>
            </div>

            <a
              href={track.mp3Src}
              download={track.downloadName}
              className="wc-link min-h-[44px] inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--a-accent-text)]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download {track.downloadName}</span>
            </a>
          </div>

          <div
            data-testid="edition-lyrics-grid"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {track.lyrics.map((stanza, idx) => (
              <div key={`${stanza.section}-${idx}`} className="space-y-2.5">
                <h3 className="font-code text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                  [{stanza.section}]
                </h3>
                <div className="space-y-1 font-serif text-[21px] leading-[1.55] text-[var(--a-ink)]">
                  {stanza.lines.map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prev / Next Song Navigation */}
      <nav
        aria-label="Adjacent song stories"
        className="border-t border-[var(--a-rule)] bg-[var(--a-bg)] py-12"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 grid gap-6 sm:grid-cols-2">
          <Link
            href={`/songs/${prevTrack.slug}`}
            className="group flex items-center justify-between gap-4 border-t border-[var(--a-rule)] pt-4 no-underline text-[var(--a-ink)] hover:border-[var(--a-accent)]"
          >
            <div className="space-y-1">
              <span className="font-code text-[13px] text-[var(--a-muted)]">
                ← Previous Song ({prevTrack.number})
              </span>
              <p className="font-display text-2xl font-bold group-hover:text-[var(--a-accent-text)] transition-colors">
                {prevTrack.title}
              </p>
            </div>
            <ArrowLeft className="h-5 w-5 shrink-0 text-[var(--a-muted)]" aria-hidden="true" />
          </Link>

          <Link
            href={`/songs/${nextTrack.slug}`}
            className="group flex items-center justify-between gap-4 border-t border-[var(--a-rule)] pt-4 no-underline text-[var(--a-ink)] sm:text-right hover:border-[var(--a-accent)]"
          >
            <ArrowRight
              className="h-5 w-5 shrink-0 text-[var(--a-muted)] sm:order-2"
              aria-hidden="true"
            />
            <div className="space-y-1 sm:flex-1">
              <span className="font-code text-[13px] text-[var(--a-muted)]">
                Next Song ({nextTrack.number}) →
              </span>
              <p className="font-display text-2xl font-bold group-hover:text-[var(--a-accent-text)] transition-colors">
                {nextTrack.title}
              </p>
            </div>
          </Link>
        </div>
      </nav>
    </article>
  );
}
