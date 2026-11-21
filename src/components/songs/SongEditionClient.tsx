'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Disc3, Download, Info, Music, Pause, Play } from 'lucide-react';
import { BlockPulse, FilmGrain, GlassThresholdGlow, LanternGlow, LeafDapple, Typewriter } from '@/art/themes';
import YouTubePlayer from '@/components/YouTubePlayer';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { SEMI_CHORD_SHEETS, getChordForStanzaLine } from '@/data/semi-chords';
import type { LyricReferenceNote, SemiTrack } from '@/data/semi-songs';

function normalizeLine(value: string): string {
  return value.trim().toLowerCase().replace(/[’']/g, "'");
}

interface SongEditionClientProps {
  track: SemiTrack;
  prevTrack: SemiTrack;
  nextTrack: SemiTrack;
}

type Theme = { dark: boolean; layer: React.ReactNode; bg: string };

function themeFor(slug: string): Theme {
  if (slug === 'billion') {
    return { dark: true, bg: 'bg-[#0c1513]', layer: <LanternGlow /> };
  }
  if (slug === 'ghost') {
    return { dark: true, bg: 'bg-[#0e131a]', layer: <GlassThresholdGlow /> };
  }
  if (slug === 'settle-in-the-block') {
    return { dark: true, bg: 'bg-[#12100d]', layer: <BlockPulse /> };
  }
  if (slug === 'warm-unknown') {
    return { dark: true, bg: 'bg-[#17120f]', layer: <LanternGlow /> };
  }
  if (slug === 'old-oak-tree') {
    return { dark: false, bg: 'bg-[#EDE6D6]', layer: <LeafDapple /> };
  }
  return { dark: false, bg: 'bg-[var(--a-well)]', layer: null };
}

export default function SongEditionClient({ track, prevTrack, nextTrack }: SongEditionClientProps) {
  const { currentTrack, isAlternateActive, isPlaying, playTrack, playAlternateTake } = useAudioPlayer();
  const [showChords, setShowChords] = useState(false);
  const chordSheet = SEMI_CHORD_SHEETS[track.slug];
  const playingThis = currentTrack.slug === track.slug && !isAlternateActive && isPlaying;
  const playingAlt = currentTrack.slug === track.slug && isAlternateActive && isPlaying;
  const theme = themeFor(track.slug);
  const isInk = track.slug === 'marks-on-the-screen-ink-on-the-page';

  const ink = theme.dark ? 'text-[#F3EFE9]' : 'text-[var(--a-ink)]';
  const sub = theme.dark ? 'text-[#F3EFE9]/75' : 'text-[var(--a-ink)]/75';

  const noteByNormalizedLine = new Map<string, { note: LyricReferenceNote; idx: number }>();
  track.lyricNotes.forEach((note, idx) => {
    noteByNormalizedLine.set(normalizeLine(note.line), { note, idx });
  });
  const seenNoteLines = new Set<string>();

  return (
    <article data-testid={`song-edition-${track.slug}`} className="bg-[var(--a-bg)]">
      {/* Themed hero */}
      <header className={`relative overflow-x-clip ${theme.bg} pt-24 pb-12 sm:pt-36 sm:pb-24`}>
        {theme.layer}
        {theme.dark && <FilmGrain />}

        <div className="relative z-10 mx-auto max-w-[1400px] pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12">
          <Link
            href="/songs"
            className={`inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold no-underline opacity-75 hover:opacity-100 ${ink}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All songs
          </Link>

          <div className="mt-5 sm:mt-8 grid gap-8 sm:gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6 min-w-0">
              <p className={`font-code text-[13px] uppercase tracking-[0.18em] ${theme.dark ? 'text-[#FFB8DA]' : 'text-[var(--a-accent-text)]'}`}>
                Track {track.number} · {track.duration} · {track.readingTime}
              </p>
              <h1 className={`mt-3 sm:mt-4 font-display font-bold leading-[1.02] tracking-[-0.03em] text-[clamp(2.2rem,1.4rem+4.8vw,5.5rem)] ${ink}`}>
                {track.title}
              </h1>
              <p className={`mt-4 sm:mt-6 font-serif italic text-[clamp(1.25rem,1rem+1.4vw,2rem)] leading-snug max-w-[30ch] ${ink}`}>
                {isInk ? <Typewriter text={`“${track.pullQuote}”`} /> : <>“{track.pullQuote}”</>}
              </p>

              <div className="mt-6 sm:mt-9 flex flex-wrap items-center gap-2.5 sm:gap-3">
                {track.mp3Src && (
                  <>
                    <button
                      type="button"
                      onClick={() => playTrack(track.slug)}
                      data-testid="edition-play-mp3"
                      className="inline-flex min-h-[52px] sm:min-h-[56px] w-full sm:w-auto items-center justify-center sm:justify-start gap-3 rounded-full bg-[var(--a-accent-fill)] pl-2 pr-6 text-[16px] font-semibold text-white transition-colors hover:bg-[#111827]"
                    >
                      <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                        {playingThis ? (
                          <Pause className="h-4 w-4" aria-hidden="true" fill="currentColor" />
                        ) : (
                          <Play className="h-4 w-4 translate-x-[1px]" aria-hidden="true" fill="currentColor" />
                        )}
                      </span>
                      <span>{playingThis ? 'Pause' : 'Play the song'}</span>
                    </button>
                    <a
                      href={track.mp3Src}
                      download={track.downloadName}
                      data-testid="edition-download-mp3"
                      className={`inline-flex min-h-[48px] sm:min-h-[56px] items-center gap-2 rounded-full border px-5 sm:px-6 text-[15px] font-semibold no-underline transition-colors ${
                        theme.dark
                          ? 'border-white/30 text-white hover:bg-white/10'
                          : 'border-[var(--a-ink)]/20 text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                      }`}
                    >
                      <Download className="h-4 w-4 shrink-0" aria-hidden="true" /> Download MP3
                    </a>
                  </>
                )}
                <a
                  href="#lyrics"
                  data-testid="edition-jump-lyrics"
                  className={`inline-flex min-h-[48px] sm:min-h-[56px] items-center px-3 text-[15px] font-semibold no-underline underline-offset-4 hover:underline ${
                    theme.dark ? 'text-white/85 hover:text-white' : 'text-[var(--a-ink)]/80 hover:text-[var(--a-ink)]'
                  }`}
                >
                  Read lyrics ↓
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 min-w-0">
              <div className="overflow-hidden rounded-[10px] bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
                {track.youtubeId ? (
                  <YouTubePlayer
                    key={track.youtubeId}
                    youtubeId={track.youtubeId}
                    title={track.title}
                    posterSrc={track.poster}
                    iframeTestId="edition-youtube-iframe"
                  />
                ) : (
                  <div
                    data-testid="edition-listening-edition"
                    className="relative aspect-video w-full overflow-hidden bg-[#14110f]"
                  >
                    {track.loopSrc ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={track.poster}
                        aria-label={`${track.title} living visual ambient loop`}
                        className="absolute inset-0 h-full w-full object-cover"
                      >
                        <source src={track.loopSrc} type="video/mp4" />
                      </video>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={track.poster}
                        alt={track.posterAlt}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30"
                    />
                    <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-code text-[13px] font-medium tracking-wider text-[#F3EFE9] backdrop-blur-md">
                          <span className="h-2 w-2 rounded-full bg-[#FE299E] animate-pulse" />
                          STUDIO LISTENING EDITION
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 font-code text-[13px] text-white/80 backdrop-blur-sm">
                          {track.loopSrc ? 'Music video in production' : 'Quiet audio-only edition'}
                        </span>
                      </div>
                      <div>
                        <p className="font-sans text-[13px] uppercase tracking-widest text-[#FFB8DA]">
                          Track {track.number} · {track.title}
                        </p>
                        <p className="mt-1 font-serif italic text-white/95 text-base sm:text-2xl line-clamp-2">
                          “{track.pullQuote}”
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className={`mt-10 sm:mt-14 max-w-[70ch] border-l-2 border-[var(--a-accent)] pl-4 sm:pl-5 text-base sm:text-lg leading-relaxed ${sub}`}>
            {track.reassuranceNote}
          </p>
        </div>
      </header>

      {/* Optional Alternate Studio Take (audio-only bonus session) */}
      {track.alternateTake && (
        <section
          aria-labelledby="alternate-take-heading"
          data-testid="alternate-take-card"
          className="border-b border-[var(--a-rule)] bg-[var(--a-surface)] py-9 sm:py-12"
        >
          <div className="mx-auto max-w-[1400px] pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12">
            <div className="grid gap-5 sm:gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 min-w-0 space-y-2.5">
                <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
                  Bonus Track · Track {track.alternateTake.numberLabel} · {track.alternateTake.duration} · Stream only
                </p>
                <h2
                  id="alternate-take-heading"
                  className="font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]"
                >
                  {track.alternateTake.title}
                </h2>
                <p className="max-w-[62ch] text-[15px] sm:text-[16px] leading-relaxed text-[var(--a-muted)]">
                  {track.alternateTake.note}
                </p>
              </div>

              <div className="lg:col-span-5 min-w-0 flex flex-wrap items-center gap-2.5 sm:gap-3 lg:justify-end">
                <button
                  type="button"
                  onClick={() => playAlternateTake(track.slug)}
                  data-testid="play-alternate-take"
                  className="inline-flex min-h-[48px] sm:min-h-[52px] w-full sm:w-auto items-center justify-center sm:justify-start gap-3 rounded-full bg-[var(--a-ink)] pl-2 pr-6 text-[15px] font-semibold text-[#F3EFE9] transition-colors hover:bg-[var(--a-accent-fill)] hover:text-white"
                >
                  <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    {playingAlt ? (
                      <Pause className="h-4 w-4" aria-hidden="true" fill="currentColor" />
                    ) : (
                      <Play className="h-4 w-4 translate-x-[1px]" aria-hidden="true" fill="currentColor" />
                    )}
                  </span>
                  <span>{playingAlt ? 'Pause bonus take' : 'Listen to bonus take'}</span>
                </button>

                <span
                  data-testid="alternate-take-stream-only"
                  className="inline-flex min-h-[44px] sm:min-h-[52px] items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-4 sm:px-5 font-code text-[13px] font-medium text-[var(--a-muted)]"
                >
                  <Disc3 className="h-4 w-4 shrink-0 text-[var(--a-accent-text)]" aria-hidden="true" />
                  <span>Listen only · Deluxe LP bonus</span>
                </span>
              </div>
            </div>

            <details className="semi-note group mt-5 sm:mt-6 max-w-[64ch]">
              <summary className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-4 py-1.5 font-sans text-[14px] font-semibold text-[var(--a-ink)] hover:border-[var(--a-ink)]">
                <span>Read the alternate-take lyrics</span>
              </summary>
              <div className="mt-4 sm:mt-5 grid gap-6 sm:grid-cols-2 rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] p-5 sm:p-6">
                {track.alternateTake.lyrics.map((stanza, idx) => (
                  <div key={`${stanza.section}-${idx}`} className="min-w-0">
                    <h3 className="font-code text-[13px] uppercase tracking-[0.16em] text-[var(--a-accent-text)]">
                      {stanza.section}
                    </h3>
                    <div className="mt-2 space-y-1 font-serif text-[17px] leading-relaxed text-[var(--a-ink)]">
                      {stanza.lines.map((l, lIdx) => (
                        <p key={lIdx}>{l}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </section>
      )}

      {/* Essay + decoder */}
      <section className="mx-auto grid max-w-[1400px] gap-12 sm:gap-14 pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12 py-16 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-7 min-w-0">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
            The story
          </p>
          <h2 className="mt-3 sm:mt-4 font-display text-[clamp(1.85rem,1.3rem+2.5vw,3rem)] font-bold leading-[1.06] tracking-[-0.02em] text-[var(--a-ink)]">
            {track.essayTitle.split(':')[0]}
          </h2>
          <p className="mt-3 sm:mt-4 font-serif italic text-xl sm:text-2xl leading-snug text-[var(--a-muted)] max-w-[44ch]">
            {track.essaySubtitle}
          </p>

          <div className="mt-10 sm:mt-14 space-y-12 sm:space-y-16">
            {track.essaySections.map((section, sIdx) => (
              <section key={section.heading}>
                <div className="flex items-baseline gap-3 sm:gap-4">
                  <span className="font-code text-[13px] shrink-0 text-[var(--a-accent-text)]">0{sIdx + 1}</span>
                  <h3 className="font-display text-[24px] sm:text-[32px] font-bold leading-tight text-[var(--a-ink)]">
                    {section.heading}
                  </h3>
                </div>
                <div className="mt-5 sm:mt-6 space-y-5 sm:space-y-6 max-w-[64ch]">
                  {section.paragraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className={`text-[17px] sm:text-[19px] leading-[1.75] text-[var(--a-ink)]/90 ${
                        sIdx === 0 && idx === 0
                          ? 'first-letter:float-left first-letter:mr-2.5 sm:first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[52px] sm:first-letter:text-[64px] first-letter:font-bold first-letter:leading-[0.82] first-letter:text-[var(--a-accent-text)]'
                          : ''
                      }`}
                    >
                      {p}
                    </p>
                  ))}
                </div>
                {section.referenceCallout && (
                  <details
                    data-testid={`essay-callout-${track.slug}-${sIdx}`}
                    className="semi-note group mt-6 max-w-[64ch] border-l-2 border-[var(--a-accent)] pl-4"
                  >
                    <summary className="flex min-h-[44px] flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-3 py-1.5 text-left">
                      <span className="inline-flex min-w-0 items-start sm:items-center gap-2.5 text-[15px] font-medium text-[var(--a-ink)]">
                        <Info className="mt-1 sm:mt-0 h-4 w-4 shrink-0 text-[var(--a-accent-text)]" aria-hidden="true" />
                        <span className="font-serif italic text-[17px] sm:text-[18px] leading-snug">{section.referenceCallout.quote}</span>
                      </span>
                      <span className="shrink-0 rounded-full border border-[var(--a-accent-text)]/35 px-3 py-1 text-[13px] font-semibold text-[var(--a-accent-text)] transition-colors group-open:border-[var(--a-accent-fill)] group-open:bg-[var(--a-accent-fill)] group-open:text-white">
                        What this means
                      </span>
                    </summary>
                    <div className="pt-2 pb-1">
                      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-accent-text)]">
                        {section.referenceCallout.topic}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--a-ink)]/85">
                        {section.referenceCallout.explanation}
                      </p>
                    </div>
                  </details>
                )}
                {section.plateSrc && (
                  <figure className="mt-8 sm:mt-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.plateSrc}
                      alt={section.plateAlt || section.heading}
                      loading="lazy"
                      className="w-full aspect-[16/9] rounded-[6px] object-cover"
                    />
                    {section.plateCaption && (
                      <figcaption className="mt-3 font-serif italic text-base sm:text-lg text-[var(--a-muted)]">
                        {section.plateCaption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </section>
            ))}
          </div>
        </div>

        <aside aria-label="Plain-English decoder" className="lg:col-span-5 min-w-0">
          <div className="lg:sticky lg:top-28 border-t-2 border-[var(--a-ink)] pt-6">
            <p className="flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
              <SemiMark className="text-[14px]" color="#FE299E" /> In plain English
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-[var(--a-ink)]">What the lyrics refer to</h2>
            <dl className="mt-6 divide-y divide-[var(--a-rule)]">
              {track.plainEnglishGlossary.map((entry) => (
                <div key={entry.lyricOrTerm} className="py-5 first:pt-0">
                  <dt className="font-serif italic text-xl text-[var(--a-ink)]">{entry.lyricOrTerm}</dt>
                  <dd className="mt-2 text-[16px] leading-relaxed text-[var(--a-ink)]/80">{entry.plainMeaning}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      {/* Optional Open-Source Commons & Education Directory (e.g., Bitcoin Core + 18 education hubs) */}
      {track.communitySpotlight && (
        <section
          id="commons"
          data-testid={`community-spotlight-${track.slug}`}
          aria-labelledby="commons-heading"
          className="scroll-mt-20 border-t border-[var(--a-rule)] bg-[var(--a-surface)] py-20 sm:py-28"
        >
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
                  <SemiMark className="text-[14px]" color="#FE299E" /> {track.communitySpotlight.eyebrow}
                </p>
                <h2
                  id="commons-heading"
                  className="mt-4 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-bold leading-[1.04] tracking-[-0.02em] text-[var(--a-ink)]"
                >
                  {track.communitySpotlight.heading}
                </h2>
              </div>
              <p className="lg:col-span-5 text-[17px] leading-relaxed text-[var(--a-ink)]/80">
                {track.communitySpotlight.tribute}
              </p>
            </div>

            <p className="mt-8 max-w-[70ch] text-[16px] leading-relaxed text-[var(--a-muted)]">
              {track.communitySpotlight.builderNote}
            </p>

            {/* Primary Core Download & Whitepaper buttons */}
            <ul role="list" data-testid="community-primary-links" className="mt-7 flex flex-wrap gap-3">
              {track.communitySpotlight.primaryLinks.map((link, idx) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-[52px] items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold no-underline transition-[background-color,border-color,color,box-shadow,scale] duration-150 active:scale-[0.97] ${
                      idx === 0
                        ? 'bg-[var(--a-ink)] text-[#F3EFE9] hover:bg-[var(--a-accent-fill)] hover:text-white hover:shadow-md'
                        : 'border border-[var(--a-ink)]/25 bg-[var(--a-well)] text-[var(--a-ink)] hover:border-[var(--a-ink)] hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      className={`hidden sm:inline-block shrink-0 rounded-full px-2.5 py-0.5 font-code text-[13px] ${
                        idx === 0 ? 'bg-white/15 text-white' : 'bg-[var(--a-surface)] text-[var(--a-muted)]'
                      }`}
                    >
                      {link.tag}
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            {/* 18 Curated Education & Open-Source Builder Chips */}
            <div className="mt-14 border-t border-[var(--a-rule)] pt-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-2xl sm:text-[28px] font-bold text-[var(--a-ink)]">
                  {track.communitySpotlight.educationHeading}
                </h3>
                <p className="text-[15px] text-[var(--a-muted)]">
                  {track.communitySpotlight.educationSubheading}
                </p>
              </div>

              <ul
                role="list"
                data-testid="community-education-chips"
                className="mt-7 flex flex-wrap gap-2.5"
              >
                {track.communitySpotlight.educationSites.map((site) => (
                  <li key={site.href}>
                    <a
                      href={site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--a-ink)]/18 bg-[var(--a-well)] px-4 py-2 text-[14px] text-[var(--a-ink)] no-underline transition-[border-color,background-color,box-shadow,scale] duration-150 hover:border-[var(--a-ink)] hover:bg-white hover:shadow-sm active:scale-[0.97]"
                    >
                      <span className="font-semibold">{site.label}</span>
                      <span className="hidden sm:inline text-[13px] text-[var(--a-muted)]">
                        · {site.tag}
                      </span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 shrink-0 text-[var(--a-accent-text)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Lyrics (single unambiguous reading column with interactive reference notes + optional guitar chords) */}
      <section
        id="lyrics"
        aria-labelledby="lyrics-heading"
        className={`scroll-mt-20 ${theme.dark ? `${theme.bg} text-[#F3EFE9]` : 'bg-[var(--a-surface)] text-[var(--a-ink)]'} py-20 sm:py-28`}
      >
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <p className={`text-center font-sans text-[13px] font-semibold uppercase tracking-[0.22em] ${theme.dark ? 'text-[#FFB8DA]' : 'text-[var(--a-accent-text)]'}`}>
            Lyrics
          </p>
          <h2 id="lyrics-heading" className="mt-3 text-center font-display text-[clamp(2rem,4vw,3.2rem)] font-bold">
            {track.title}
          </h2>
          <p className={`mt-4 text-center text-[15px] leading-relaxed ${theme.dark ? 'text-[#F3EFE9]/75' : 'text-[var(--a-muted)]'}`}>
            <Info
              className={`mr-1.5 inline-block h-4 w-4 align-[-2px] ${theme.dark ? 'text-[#FFB8DA]' : 'text-[var(--a-accent-text)]'}`}
              aria-hidden="true"
            />
            Tap any Note mark beside a lyric line to see what it references.
          </p>

          {chordSheet && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => setShowChords((prev) => !prev)}
                aria-pressed={showChords}
                data-testid="toggle-show-chords"
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-[14px] font-semibold transition-colors ${
                  showChords
                    ? 'border-[#FE299E] bg-[#FE299E] text-white'
                    : theme.dark
                      ? 'border-white/25 bg-white/5 text-[#F3EFE9] hover:border-white/50'
                      : 'border-[var(--a-ink)]/25 bg-[var(--a-well)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                }`}
              >
                <Music className="h-4 w-4" aria-hidden="true" />
                <span>{showChords ? 'Hide Chords' : 'Show Chords'}</span>
              </button>

              {showChords && (
                <div
                  data-testid="chords-meta-bar"
                  className={`w-full max-w-[620px] rounded-2xl border px-5 py-4 text-left font-sans text-[14px] leading-relaxed ${
                    theme.dark
                      ? 'border-white/15 bg-white/5 text-[#F3EFE9]/90'
                      : 'border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)]'
                  }`}
                >
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                    <span>
                      <strong className="font-semibold">Key:</strong> {chordSheet.key}
                    </span>
                    <span>
                      <strong className="font-semibold">Capo:</strong> {chordSheet.capo}
                    </span>
                    <span>
                      <strong className="font-semibold">Tuning:</strong> {chordSheet.tuning}
                    </span>
                  </div>
                  <p className={`mt-1.5 text-[13px] ${theme.dark ? 'text-[#F3EFE9]/70' : 'text-[var(--a-muted)]'}`}>
                    <strong className="font-semibold">Feel:</strong> {chordSheet.strumming}
                  </p>
                </div>
              )}
            </div>
          )}

          <div data-testid="edition-lyrics-grid" className="mx-auto mt-10 sm:mt-14 max-w-[620px] space-y-10 sm:space-y-12">
            {track.lyrics.map((stanza, idx) => (
              <div
                key={`${stanza.section}-${idx}`}
                className={`min-w-0 border-t pt-6 first:border-t-0 first:pt-0 ${theme.dark ? 'border-white/15' : 'border-[var(--a-rule)]'}`}
              >
                <h3 className={`font-code text-[13px] uppercase tracking-[0.16em] ${theme.dark ? 'text-[#FFB8DA]' : 'text-[var(--a-accent-text)]'}`}>
                  {stanza.section}
                </h3>
                <div className="mt-4 space-y-1 font-serif text-[20px] sm:text-[24px] leading-[1.55]">
                  {stanza.lines.map((line, lIdx) => {
                    const chordLine = showChords
                      ? getChordForStanzaLine(track.slug, stanza.section, lIdx, line)
                      : null;
                    const chordNode = chordLine ? (
                      <span
                        data-testid="lyric-chord-line"
                        className={`mt-3 block max-w-full overflow-x-auto whitespace-pre font-code text-[13px] sm:text-[14px] font-semibold leading-snug tracking-wide ${
                          theme.dark ? 'text-[#FFB8DA]' : 'text-[var(--a-accent-text)]'
                        }`}
                      >
                        {chordLine}
                      </span>
                    ) : null;

                    const normalized = normalizeLine(line);
                    const matched = !seenNoteLines.has(normalized) ? noteByNormalizedLine.get(normalized) : undefined;
                    if (!matched) {
                      return (
                        <div key={lIdx} className="min-w-0 py-0.5">
                          {chordNode}
                          <p>{line}</p>
                        </div>
                      );
                    }
                    seenNoteLines.add(normalized);
                    const { note, idx: noteIdx } = matched;
                    return (
                      <div key={lIdx} className="my-1 min-w-0">
                        {chordNode}
                        <details
                          data-testid={`lyric-note-${track.slug}-${noteIdx}`}
                          className="semi-note group"
                        >
                          <summary
                            className={`flex min-h-[44px] items-center justify-between gap-2.5 sm:gap-3 rounded-[6px] py-1.5 -mx-2 px-2 transition-colors ${
                              theme.dark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                            }`}
                          >
                            <span
                              className={`min-w-0 underline decoration-dotted underline-offset-[6px] ${
                                theme.dark ? 'decoration-[#FFB8DA]/70' : 'decoration-[var(--a-accent-text)]/60'
                              }`}
                            >
                              {line}
                            </span>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-sans text-[13px] font-semibold transition-colors ${
                                theme.dark
                                  ? 'border-[#FFB8DA]/45 text-[#FFB8DA] group-open:border-[#FE299E] group-open:bg-[#FE299E] group-open:text-white'
                                  : 'border-[var(--a-accent-text)]/40 text-[var(--a-accent-text)] group-open:border-[var(--a-accent-fill)] group-open:bg-[var(--a-accent-fill)] group-open:text-white'
                              }`}
                            >
                              <Info className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Note</span>
                            </span>
                          </summary>
                          <div className="mt-2 mb-4 border-l-2 border-[#FE299E] pl-4 py-1.5 font-sans">
                            <p
                              className={`text-[13px] font-semibold uppercase tracking-[0.16em] ${
                                theme.dark ? 'text-[#FFB8DA]' : 'text-[var(--a-accent-text)]'
                              }`}
                            >
                              {note.topic}
                            </p>
                            <p
                              className={`mt-1 text-[15px] leading-relaxed ${
                                theme.dark ? 'text-[#F3EFE9]/90' : 'text-[var(--a-ink)]/90'
                              }`}
                            >
                              {note.explanation}
                            </p>
                          </div>
                        </details>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prev / next */}
      <nav aria-label="More songs" className="grid sm:grid-cols-2">
        {[
          { t: prevTrack, label: 'Previous', icon: <ArrowLeft className="h-5 w-5" aria-hidden="true" /> },
          { t: nextTrack, label: 'Next', icon: <ArrowRight className="h-5 w-5" aria-hidden="true" /> },
        ].map(({ t, label, icon }) => (
          <Link
            key={label}
            href={`/songs/${t.slug}`}
            className="group relative block overflow-hidden bg-black no-underline"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.poster}
              alt=""
              loading="lazy"
              className="h-48 sm:h-72 w-full object-cover opacity-60 transition-[opacity,transform] duration-700 group-hover:scale-[1.03] group-hover:opacity-75"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-10 text-white">
              <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-white/85">
                {icon} {label} song
              </span>
              <span className="mt-1.5 sm:mt-2 font-display text-2xl sm:text-4xl font-bold leading-tight">{t.title}</span>
            </div>
          </Link>
        ))}
      </nav>
    </article>
  );
}
