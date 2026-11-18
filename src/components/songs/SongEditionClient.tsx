'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Info, Pause, Play } from 'lucide-react';
import { FilmGrain, LanternGlow, LeafDapple, Typewriter } from '@/art/themes';
import YouTubePlayer from '@/components/YouTubePlayer';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
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
  if (slug === 'warm-unknown') {
    return { dark: true, bg: 'bg-[#17120f]', layer: <LanternGlow /> };
  }
  if (slug === 'old-oak-tree') {
    return { dark: false, bg: 'bg-[#EDE6D6]', layer: <LeafDapple /> };
  }
  return { dark: false, bg: 'bg-[var(--a-well)]', layer: null };
}

export default function SongEditionClient({ track, prevTrack, nextTrack }: SongEditionClientProps) {
  const { currentTrack, isPlaying, playTrack } = useAudioPlayer();
  const playingThis = currentTrack.slug === track.slug && isPlaying;
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
      <header className={`relative overflow-hidden ${theme.bg} pt-28 pb-16 sm:pt-36 sm:pb-24`}>
        {theme.layer}
        {theme.dark && <FilmGrain />}

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <Link
            href="/songs"
            className={`inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold no-underline opacity-75 hover:opacity-100 ${ink}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All songs
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className={`font-code text-[13px] uppercase tracking-[0.18em] ${theme.dark ? 'text-[#FFB8DA]' : 'text-[var(--a-accent-text)]'}`}>
                Track {track.number} · {track.duration} · {track.readingTime}
              </p>
              <h1 className={`mt-4 font-display font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(2.8rem,6.4vw,6rem)] ${ink}`}>
                {track.title}
              </h1>
              <p className={`mt-6 font-serif italic text-[clamp(1.4rem,2.2vw,2rem)] leading-snug max-w-[30ch] ${ink}`}>
                {isInk ? <Typewriter text={`“${track.pullQuote}”`} /> : <>“{track.pullQuote}”</>}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => playTrack(track.slug)}
                  data-testid="edition-play-mp3"
                  className="inline-flex min-h-[56px] items-center gap-3 rounded-full bg-[var(--a-accent-fill)] pl-2 pr-6 text-[16px] font-semibold text-white transition-colors hover:bg-[#111827]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    {playingThis ? (
                      <Pause className="h-4 w-4" aria-hidden="true" fill="currentColor" />
                    ) : (
                      <Play className="h-4 w-4 translate-x-[1px]" aria-hidden="true" fill="currentColor" />
                    )}
                  </span>
                  {playingThis ? 'Pause' : 'Play the song'}
                </button>
                <a
                  href={track.mp3Src}
                  download={track.downloadName}
                  data-testid="edition-download-mp3"
                  className={`inline-flex min-h-[56px] items-center gap-2 rounded-full border px-6 text-[15px] font-semibold no-underline transition-colors ${
                    theme.dark
                      ? 'border-white/30 text-white hover:bg-white/10'
                      : 'border-[var(--a-ink)]/20 text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                  }`}
                >
                  <Download className="h-4 w-4" aria-hidden="true" /> Download MP3
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-[10px] bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
                <YouTubePlayer
                  key={track.youtubeId}
                  youtubeId={track.youtubeId}
                  title={track.title}
                  posterSrc={track.poster}
                  iframeTestId="edition-youtube-iframe"
                />
              </div>
            </div>
          </div>

          <p className={`mt-14 max-w-[70ch] border-l-2 border-[var(--a-accent)] pl-5 text-lg leading-relaxed ${sub}`}>
            {track.reassuranceNote}
          </p>
        </div>
      </header>

      {/* Essay + decoder */}
      <section className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:px-12 py-20 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
            The story
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--a-ink)]">
            {track.essayTitle.split(':')[0]}
          </h2>
          <p className="mt-4 font-serif italic text-2xl leading-snug text-[var(--a-muted)] max-w-[44ch]">
            {track.essaySubtitle}
          </p>

          <div className="mt-14 space-y-16">
            {track.essaySections.map((section, sIdx) => (
              <section key={section.heading}>
                <div className="flex items-baseline gap-4">
                  <span className="font-code text-[13px] text-[var(--a-accent-text)]">0{sIdx + 1}</span>
                  <h3 className="font-display text-[28px] sm:text-[32px] font-bold leading-tight text-[var(--a-ink)]">
                    {section.heading}
                  </h3>
                </div>
                <div className="mt-6 space-y-6 max-w-[64ch]">
                  {section.paragraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className={`text-[19px] leading-[1.75] text-[var(--a-ink)]/90 ${
                        sIdx === 0 && idx === 0
                          ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[64px] first-letter:font-bold first-letter:leading-[0.8] first-letter:text-[var(--a-accent-text)]'
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
                    <summary className="flex min-h-[44px] items-center justify-between gap-3 py-1 text-left">
                      <span className="inline-flex items-center gap-2.5 text-[15px] font-medium text-[var(--a-ink)]">
                        <Info className="h-4 w-4 shrink-0 text-[var(--a-accent-text)]" aria-hidden="true" />
                        <span className="font-serif italic text-[18px]">{section.referenceCallout.quote}</span>
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
                  <figure className="mt-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.plateSrc}
                      alt={section.plateAlt || section.heading}
                      loading="lazy"
                      className="w-full aspect-[16/9] rounded-[6px] object-cover"
                    />
                    {section.plateCaption && (
                      <figcaption className="mt-3 font-serif italic text-lg text-[var(--a-muted)]">
                        {section.plateCaption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </section>
            ))}
          </div>
        </div>

        <aside aria-label="Plain-English decoder" className="lg:col-span-5">
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

      {/* Lyrics (single unambiguous reading column with interactive reference notes) */}
      <section
        id="lyrics"
        aria-labelledby="lyrics-heading"
        className={`scroll-mt-20 ${theme.dark ? 'bg-[#17120f] text-[#F3EFE9]' : 'bg-[var(--a-surface)] text-[var(--a-ink)]'} py-20 sm:py-28`}
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

          <div data-testid="edition-lyrics-grid" className="mx-auto mt-14 max-w-[620px] space-y-12">
            {track.lyrics.map((stanza, idx) => (
              <div
                key={`${stanza.section}-${idx}`}
                className={`border-t pt-6 first:border-t-0 first:pt-0 ${theme.dark ? 'border-white/15' : 'border-[var(--a-rule)]'}`}
              >
                <h3 className={`font-code text-[13px] uppercase tracking-[0.16em] ${theme.dark ? 'text-[#FFB8DA]' : 'text-[var(--a-accent-text)]'}`}>
                  {stanza.section}
                </h3>
                <div className="mt-4 space-y-1 font-serif text-[22px] sm:text-[24px] leading-[1.55]">
                  {stanza.lines.map((line, lIdx) => {
                    const normalized = normalizeLine(line);
                    const matched = !seenNoteLines.has(normalized) ? noteByNormalizedLine.get(normalized) : undefined;
                    if (!matched) {
                      return (
                        <p key={lIdx} className="py-0.5">
                          {line}
                        </p>
                      );
                    }
                    seenNoteLines.add(normalized);
                    const { note, idx: noteIdx } = matched;
                    return (
                      <details
                        key={lIdx}
                        data-testid={`lyric-note-${track.slug}-${noteIdx}`}
                        className="semi-note group my-1"
                      >
                        <summary
                          className={`flex min-h-[44px] items-center justify-between gap-3 rounded-[6px] py-1.5 -mx-2 px-2 transition-colors ${
                            theme.dark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                          }`}
                        >
                          <span
                            className={`underline decoration-dotted underline-offset-[6px] ${
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
              className="h-56 sm:h-72 w-full object-cover opacity-60 transition-[opacity,transform] duration-700 group-hover:scale-[1.03] group-hover:opacity-75"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-white">
              <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-white/80">
                {icon} {label} song
              </span>
              <span className="mt-2 font-display text-3xl sm:text-4xl font-bold">{t.title}</span>
            </div>
          </Link>
        ))}
      </nav>
    </article>
  );
}
