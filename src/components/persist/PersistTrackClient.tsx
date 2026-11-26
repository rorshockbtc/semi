'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Info, Music, Pause, Play } from 'lucide-react';
import RelativisticHorizonCanvas from '@/art/RelativisticHorizonCanvas';
import PersistAccessGate from '@/components/persist/PersistAccessGate';
import { usePersistAccess } from '@/components/persist/usePersistAccess';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { PERSIST_CHORD_SHEETS, getPersistChordForLine } from '@/data/persist-chords';
import type { PersistTrack } from '@/data/persist-songs';

const wrap =
  'relative z-10 mx-auto max-w-[1400px] pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12';

export default function PersistTrackClient({
  track,
  prevTrack,
  nextTrack,
}: {
  track: PersistTrack;
  prevTrack: PersistTrack;
  nextTrack: PersistTrack;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const access = usePersistAccess();
  const { currentTrack, queueAlbum, isPlaying, playPersistTrack } = useAudioPlayer();
  const [showChords, setShowChords] = useState(false);
  const chordSheet = PERSIST_CHORD_SHEETS[track.slug];
  const playing = queueAlbum === 'persist' && currentTrack.slug === track.slug && isPlaying;

  return (
    <>
      {/* HERO */}
      <header ref={heroRef} className="relative overflow-x-clip bg-[var(--a-bg)] wc-paper-grain pt-24 pb-12 sm:pt-36 sm:pb-20">
        <RelativisticHorizonCanvas containerRef={heroRef} />
        <div className={wrap}>
          <Link
            href="/persist"
            className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-[var(--a-ink)] no-underline opacity-75 hover:opacity-100"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Persist
          </Link>

          <div className="mt-5 sm:mt-8 grid gap-8 sm:gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6 min-w-0">
              <p className="font-code text-[13px] uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
                Persist · {track.isBonus ? 'Bonus' : 'Track'} {track.number} · {track.zoneLabel}
              </p>
              <h1 className="mt-3 sm:mt-4 font-display font-bold leading-[1.02] tracking-[-0.03em] text-[clamp(2.2rem,1.4rem+4.8vw,5.5rem)] text-[var(--a-ink)]">
                {track.title}
              </h1>
              <p className="mt-4 sm:mt-6 font-serif italic text-[clamp(1.25rem,1rem+1.4vw,2rem)] leading-snug max-w-[30ch] text-[var(--a-ink)]">
                {track.summary}
              </p>

              <div className="mt-6 sm:mt-9 flex flex-wrap items-center gap-3">
                {access.unlocked && access.token ? (
                  <button
                    type="button"
                    onClick={() => playPersistTrack(track.slug, access.token!)}
                    data-testid="persist-play-btn"
                    className="inline-flex min-h-[56px] w-full sm:w-auto items-center justify-center sm:justify-start gap-3 rounded-full bg-[var(--a-accent-fill)] pl-2 pr-6 text-[16px] font-semibold text-white transition-colors hover:bg-[var(--a-ink)]"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      {playing ? (
                        <Pause className="h-4 w-4" fill="currentColor" aria-hidden="true" />
                      ) : (
                        <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true" />
                      )}
                    </span>
                    {playing ? 'Pause' : 'Play'} “{track.title}” · {track.duration}
                  </button>
                ) : (
                  <a
                    href="#listen"
                    className="inline-flex min-h-[56px] items-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-6 text-[16px] font-semibold text-white no-underline transition-colors hover:bg-[var(--a-ink)]"
                  >
                    Unlock to listen
                  </a>
                )}
                <a
                  href="#lyrics"
                  className="inline-flex min-h-[56px] items-center px-3 text-[15px] font-semibold text-[var(--a-ink)] no-underline underline-offset-4 hover:underline"
                >
                  Read the lyrics
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 min-w-0">
              <div className="overflow-hidden rounded-[10px] shadow-[0_40px_80px_-40px_rgba(17,24,39,0.45)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={track.artworkSrc} alt={track.artworkAlt} className="aspect-[4/3] w-full object-cover" />
              </div>
            </div>
          </div>

          <p className="mt-10 sm:mt-14 max-w-[70ch] border-l-2 border-[var(--a-accent)] pl-4 sm:pl-5 text-base sm:text-lg leading-relaxed text-[var(--a-muted)]">
            <span className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-ink)]">Sound · </span>
            {track.sonicNote}{' '}
            <span className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-ink)]">· Time · </span>
            {track.properTimeLabel}
          </p>
        </div>
      </header>

      {!access.checking && !access.unlocked && (
        <section id="listen" className="scroll-mt-24 border-y border-[var(--a-rule)] bg-[var(--a-surface)] py-10 sm:py-12">
          <div className={wrap}>
            <PersistAccessGate access={access} />
          </div>
        </section>
      )}

      {/* STORY + LYRICS */}
      <section className={`${wrap} grid gap-12 sm:gap-14 py-16 sm:py-28 lg:grid-cols-12`}>
        <article className="lg:col-span-7 min-w-0">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
            The story behind the song
          </p>
          <h2 className="mt-3 sm:mt-4 font-display text-[clamp(1.85rem,1.3rem+2.5vw,3rem)] font-bold leading-[1.06] tracking-[-0.02em] text-[var(--a-ink)]">
            {track.essayTitle}
          </h2>
          <p className="mt-3 sm:mt-4 font-serif italic text-xl sm:text-2xl leading-snug text-[var(--a-muted)] max-w-[44ch]">
            {track.essaySubtitle}
          </p>

          <div className="mt-10 sm:mt-14 space-y-12 sm:space-y-16">
            {track.essaySections.map((section, i) => (
              <section key={section.heading}>
                <div className="flex items-baseline gap-3 sm:gap-4">
                  <span className="font-code text-[13px] shrink-0 text-[var(--a-accent-text)]">0{i + 1}</span>
                  <h3 className="font-display text-[24px] sm:text-[32px] font-bold leading-tight text-[var(--a-ink)]">
                    {section.heading}
                  </h3>
                </div>
                <div className="mt-5 sm:mt-6 space-y-5 sm:space-y-6 max-w-[64ch]">
                  {section.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className={`text-[17px] sm:text-[19px] leading-[1.75] text-[var(--a-ink)]/90 ${
                        i === 0 && j === 0 ? 'first-letter:font-display first-letter:text-[3.2em] first-letter:font-bold first-letter:float-left first-letter:leading-[0.85] first-letter:mr-2 first-letter:text-[var(--a-accent-text)]' : ''
                      }`}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 space-y-4 border-t border-[var(--a-rule)] pt-8">
            <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
              Lyric notes
            </p>
            {track.lyricNotes.map((n) => (
              <details key={n.line} className="semi-note group max-w-[64ch] border-l-2 border-[var(--a-accent)] pl-4">
                <summary className="flex min-h-[44px] items-center justify-between gap-3 py-1.5 text-left cursor-pointer">
                  <span className="inline-flex items-start gap-2.5">
                    <Info className="mt-1 h-4 w-4 shrink-0 text-[var(--a-accent-text)]" aria-hidden="true" />
                    <span className="font-serif italic text-[17px] sm:text-[18px] leading-snug text-[var(--a-ink)]">
                      “{n.line}”
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full border border-[var(--a-accent-text)]/35 px-3 py-1 text-[13px] font-semibold text-[var(--a-accent-text)] group-open:bg-[var(--a-accent-fill)] group-open:text-white group-open:border-[var(--a-accent-fill)]">
                    Note
                  </span>
                </summary>
                <p className="pb-2 pt-2 text-[16px] leading-relaxed text-[var(--a-muted)]">{n.note}</p>
              </details>
            ))}
          </div>
        </article>

        <aside id="lyrics" className="lg:col-span-5 min-w-0 scroll-mt-24">
          <div className="lg:sticky lg:top-24 rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
                  Lyrics &amp; Chords
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-[var(--a-ink)]">{track.title}</h2>
              </div>
              {chordSheet && (
                <button
                  type="button"
                  onClick={() => setShowChords((prev) => !prev)}
                  aria-pressed={showChords}
                  data-testid="toggle-show-chords"
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-colors ${
                    showChords
                      ? 'border-[var(--a-accent-fill)] bg-[var(--a-accent-fill)] text-white'
                      : 'border-[var(--a-ink)]/25 bg-[var(--a-well)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                  }`}
                >
                  <Music className="h-4 w-4" aria-hidden="true" />
                  <span>{showChords ? 'Hide Chords' : 'Show Chords'}</span>
                </button>
              )}
            </div>

            {chordSheet && showChords && (
              <div
                data-testid="chords-meta-bar"
                className="rounded-xl border border-[var(--a-rule)] bg-[var(--a-well)] px-4 py-3 text-[13px] leading-relaxed text-[var(--a-ink)] space-y-1"
              >
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    <strong>Key:</strong> {chordSheet.key}
                  </span>
                  <span>
                    <strong>Capo:</strong> {chordSheet.capo}
                  </span>
                  <span>
                    <strong>Tuning:</strong> {chordSheet.tuning}
                  </span>
                </div>
                <p className="text-[var(--a-muted)]">
                  <strong>Feel:</strong> {chordSheet.strumming}
                </p>
              </div>
            )}

            <div className="max-h-none lg:max-h-[65vh] lg:overflow-y-auto pr-1 space-y-1 font-serif text-[17px] leading-[1.75] text-[var(--a-ink)]">
              {track.lyrics.split('\n').map((line, idx) => {
                if (!line.trim()) {
                  return <div key={idx} className="h-3" aria-hidden="true" />;
                }
                const chordLine = showChords ? getPersistChordForLine(track.slug, idx) : null;
                return (
                  <div key={idx} className="min-w-0">
                    {chordLine && (
                      <span
                        data-testid="lyric-chord-line"
                        className="mt-2 block overflow-x-auto whitespace-pre font-code text-[13px] font-semibold leading-snug tracking-wide text-[var(--a-accent-text)]"
                      >
                        {chordLine}
                      </span>
                    )}
                    <p>{line}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </section>

      {/* PREV / NEXT */}
      <nav className="border-t border-[var(--a-rule)] bg-[var(--a-surface)]" aria-label="More Persist songs">
        <div className={`${wrap} grid grid-cols-2 gap-4 py-8`}>
          <Link href={`/persist/${prevTrack.slug}`} className="group flex min-h-[56px] flex-col no-underline">
            <span className="inline-flex items-center gap-1.5 font-code text-[13px] text-[var(--a-muted)]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Previous
            </span>
            <span className="mt-1 font-display text-[18px] sm:text-[22px] font-bold text-[var(--a-ink)]">{prevTrack.title}</span>
          </Link>
          <Link href={`/persist/${nextTrack.slug}`} className="group flex min-h-[56px] flex-col items-end text-right no-underline">
            <span className="inline-flex items-center gap-1.5 font-code text-[13px] text-[var(--a-muted)]">
              Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="mt-1 font-display text-[18px] sm:text-[22px] font-bold text-[var(--a-ink)]">{nextTrack.title}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
