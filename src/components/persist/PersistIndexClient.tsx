'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Lock, Play } from 'lucide-react';
import RelativisticHorizonCanvas from '@/art/RelativisticHorizonCanvas';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import PersistAccessGate from '@/components/persist/PersistAccessGate';
import ProperTimeClocks from '@/components/persist/ProperTimeClocks';
import ResonanceSpineVisualizer from '@/components/persist/ResonanceSpineVisualizer';
import { usePersistAccess } from '@/components/persist/usePersistAccess';
import {
  PERSIST_ALBUM_META,
  PERSIST_TRACKS,
  RESONANCE_ZONES,
  type ResonanceZoneId,
} from '@/data/persist-songs';

const wrap =
  'relative z-10 mx-auto max-w-[1400px] pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12';

export default function PersistIndexClient() {
  const heroRef = useRef<HTMLElement>(null);
  const { motionActive } = useAmbientMotion();
  const access = usePersistAccess();
  const [zone, setZone] = useState<ResonanceZoneId>('slow-country');
  const zoneSpec = RESONANCE_ZONES.find((z) => z.id === zone) ?? RESONANCE_ZONES[0];
  const mainTracks = PERSIST_TRACKS.filter((t) => !t.isBonus);
  const bonusTracks = PERSIST_TRACKS.filter((t) => t.isBonus);

  const fade = (delay = 0) => ({
    initial: motionActive ? { opacity: 0, y: 18 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative overflow-x-clip bg-[var(--a-bg)] wc-paper-grain pt-28 pb-16 sm:pt-40 sm:pb-24"
      >
        <RelativisticHorizonCanvas containerRef={heroRef} />
        <div className={`${wrap} grid gap-10 lg:grid-cols-12 lg:items-end`}>
          <m.div {...fade()} className="lg:col-span-7 min-w-0">
            <p className="font-code text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--a-accent-text)]">
              {PERSIST_ALBUM_META.statusLabel} · Companion to the novel
            </p>
            <h1 className="mt-4 font-display font-bold leading-[0.98] tracking-[-0.03em] text-[clamp(3rem,1.8rem+6vw,7rem)] text-[var(--a-ink)]">
              Persist
            </h1>
            <p className="mt-4 font-serif italic text-[clamp(1.4rem,1rem+1.6vw,2.25rem)] leading-snug text-[var(--a-ink)]">
              Same sky, different clocks.
            </p>
            <p className="mt-6 max-w-[60ch] border-l-2 border-[var(--a-accent)] pl-4 sm:pl-5 text-[17px] sm:text-lg leading-relaxed text-[var(--a-ink)]/85">
              Semi’s second album is set inside the world of Kyle’s speculative-fiction novel{' '}
              <em className="font-serif">Persist</em>. It keeps the acoustic porch-light warmth of{' '}
              <em className="font-serif">I/O</em>—fingerpicked guitar, close breath, honest
              harmony—and braids it with deep-space electronics for a story about loving people who
              live on a different clock than you do.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {access.checking ? (
                <span className="font-code text-[13px] text-[var(--a-muted)]">Checking your listening pass…</span>
              ) : access.unlocked ? (
                <>
                  <Link
                    href={`/persist/${PERSIST_TRACKS[0].slug}`}
                    className="inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[var(--a-accent-fill)] pl-2 pr-6 text-[16px] font-semibold text-white no-underline transition-colors hover:bg-[var(--a-ink)]"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                      <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true" />
                    </span>
                    Start with “Redshift”
                  </Link>
                  <span className="inline-flex items-center gap-2 text-[14px] text-[var(--a-muted)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                    Listening as {access.email ?? 'a Deluxe owner'}
                  </span>
                </>
              ) : (
                <a
                  href="#listen"
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-6 text-[16px] font-semibold text-white no-underline transition-colors hover:bg-[var(--a-ink)]"
                >
                  <Lock className="h-4 w-4" aria-hidden="true" /> Unlock the listening room
                </a>
              )}
              <a
                href="#world-of-persist"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] px-5 text-[15px] font-semibold text-[var(--a-ink)] no-underline transition-colors hover:border-[var(--a-ink)]"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" /> Read the story of Resonance
              </a>
            </div>
          </m.div>

          <m.div {...fade(0.1)} className="lg:col-span-5 min-w-0">
            <div className="overflow-hidden rounded-[10px] shadow-[0_40px_80px_-40px_rgba(17,24,39,0.45)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PERSIST_ALBUM_META.coverSrc}
                alt={PERSIST_ALBUM_META.coverAlt}
                className="aspect-square w-full object-cover"
              />
            </div>
          </m.div>
        </div>
      </section>

      {/* STORY PROLOGUE: LIFE ABOARD RESONANCE + PROPER TIME CLOCKS */}
      <section
        id="world-of-persist"
        className="scroll-mt-20 border-y border-[var(--a-rule)] bg-[var(--a-surface)] py-16 sm:py-24"
      >
        <div className={`${wrap} space-y-14`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 space-y-4">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
                The world of the novel · Resonance
              </p>
              <h2 className="font-display text-[clamp(2rem,1.4rem+2.8vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.02em] text-[var(--a-ink)]">
                A ship the length of Alaska, where time itself splits in three.
              </h2>
              <p className="font-serif italic text-[20px] leading-snug text-[var(--a-muted)]">
                Everyone aboard shares the same hull. Nobody shares the same clock.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-5 max-w-[66ch] text-[17px] sm:text-[18px] leading-[1.78] text-[var(--a-ink)]/90">
              <p>
                <strong className="font-semibold text-[var(--a-ink)]">Resonance</strong> is a
                2,000-kilometer-long generation ship—roughly the length of Alaska—held in a steep
                gravitational gradient just outside the event horizon of a supermassive black hole.
                Because the ship is so vast and sits so close to the gravity well, time does not
                pass at the same speed from one end of the hull to the other.
              </p>
              <p>
                Down in <strong className="font-semibold text-[var(--a-ink)]">Slow Country</strong>{' '}
                (the Old Country), closest to the black hole, gravity pulls so hard that every
                second feels thick and unhurried. Travel up-ship to{' '}
                <strong className="font-semibold text-[var(--a-ink)]">The Tip</strong> for a week of
                work or friendship, and you can return home to find the people you just met have
                already lived entire lifetimes and passed away. Between them lies{' '}
                <strong className="font-semibold text-[var(--a-ink)]">The Midship</strong>—a
                volatile corridor of localized time pockets where stepping three meters past a
                painted doorway can cost you ten winters.
              </p>
              <p>
                Built as a 600-page braided narrative, the novel{' '}
                <em className="font-serif">Persist</em> flashes back between pivotal moments in
                human history—how foundational breakthroughs like the wheel (Ana and her son Pyotr
                pulling a sledge through ancient mud) or artificial light first changed how we
                measure effort and time—and the lived reality aboard{' '}
                <em className="font-serif">Resonance</em>, where characters like Jax, Leo, and Marek
                confront a cold ship AI that flattens living memory into spotless data. Each song on
                this album is a dispatch from somewhere along that timeline.
              </p>
            </div>
          </div>

          {/* VISUAL TRIPTYCH OF RESONANCE */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                src: '/photos/persist/resonance-exterior.jpg',
                alt: 'The 2,000-kilometer generation ship Resonance suspended outside the luminous golden-amber accretion horizon of a supermassive black hole.',
                label: 'Resonance · 2,000 km Hull',
                caption: 'Held in orbit just outside the accretion horizon.',
              },
              {
                src: '/photos/persist/resonance-slow-country.jpg',
                alt: 'Inside Slow Country: wooden porches, warm amber tungsten streetlamps, and oak saplings beneath massive riveted hull ribs.',
                label: 'Slow Country · Lower Hull',
                caption: 'Where gravity stretches every second heavy and thick.',
              },
              {
                src: '/photos/persist/resonance-tip.jpg',
                alt: 'Inside The Tip observatory promenade: bright daylight glass and silver birch trees looking down the 2,000-kilometer spine.',
                label: 'The Tip · 2,000 km Up-Ship',
                caption: 'Where generations rise while Slow Country barely turns a page.',
              },
            ].map((plate) => (
              <figure key={plate.src} className="space-y-2.5">
                <div className="overflow-hidden rounded-[8px] border border-[var(--a-rule)] bg-[var(--a-well)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={plate.src}
                    alt={plate.alt}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <figcaption className="space-y-0.5">
                  <p className="font-code text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                    {plate.label}
                  </p>
                  <p className="font-serif italic text-[15px] text-[var(--a-muted)]">
                    {plate.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* LIVE PROPER-TIME CLOCKS — now earned by the story above */}
          <div className="space-y-4 border-t border-[var(--a-rule)] pt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
                  Live Proper-Time Divergence · Since you opened this page
                </p>
                <p className="mt-1 text-[15px] text-[var(--a-muted)]">
                  Slow Country ticks in real seconds. The Midship jumps across doorways. The Tip
                  burns through days while you read a single paragraph.
                </p>
              </div>
            </div>
            <ResonanceSpineVisualizer activeZone={zone} onSelectZone={setZone} />
            <ProperTimeClocks />
          </div>

          {/* INTERACTIVE THREE ZONES EXPLORER */}
          <div className="grid gap-8 border-t border-[var(--a-rule)] pt-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4 space-y-3">
              <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
                Explore the three zones
              </p>
              <div role="tablist" aria-label="Zones of Resonance" className="flex flex-wrap gap-2">
                {RESONANCE_ZONES.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    role="tab"
                    aria-selected={z.id === zone}
                    onClick={() => setZone(z.id)}
                    className={`min-h-[44px] rounded-full px-5 text-[14px] font-semibold transition-colors ${
                      z.id === zone
                        ? 'bg-[var(--a-ink)] text-[var(--a-surface)]'
                        : 'border border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                    }`}
                  >
                    {z.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 border-l-2 border-[var(--a-accent)] pl-5 space-y-3">
              <div>
                <h3 className="font-display text-2xl font-bold text-[var(--a-ink)]">{zoneSpec.name}</h3>
                <p className="mt-1 font-code text-[13px] text-[var(--a-muted)]">
                  {zoneSpec.hullPosition} · {zoneSpec.clockRate}
                </p>
              </div>
              <p className="text-[17px] leading-[1.75] text-[var(--a-ink)]/90">{zoneSpec.physics}</p>
              <p className="font-serif italic text-[18px] leading-relaxed text-[var(--a-ink)]">
                {zoneSpec.humanExperience}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GATE */}
      {!access.checking && !access.unlocked && (
        <section id="listen" className="scroll-mt-24 bg-[var(--a-bg)] pt-16 sm:pt-24">
          <div className={wrap}>
            <PersistAccessGate access={access} />
          </div>
        </section>
      )}

      {/* TRACKLIST */}
      <section className="bg-[var(--a-bg)] py-16 sm:py-24">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--a-rule)] pb-5">
            <div>
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
                Songs &amp; stories
              </p>
              <h2 className="mt-3 font-display text-[clamp(1.85rem,1.3rem+2.5vw,3rem)] font-bold leading-[1.06] tracking-[-0.02em] text-[var(--a-ink)]">
                {mainTracks.length} of {PERSIST_ALBUM_META.plannedTrackCount} songs finished
              </h2>
            </div>
            <p className="font-code text-[13px] text-[var(--a-muted)]">More arriving as they’re recorded</p>
          </div>

          <ol className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {mainTracks.map((t, i) => (
              <m.li
                key={t.slug}
                initial={motionActive ? { opacity: 0, y: 24 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/persist/${t.slug}`}
                  data-testid={`persist-track-card-${t.slug}`}
                  className="group block no-underline"
                >
                  <div className="overflow-hidden rounded-[8px] border border-[var(--a-rule)] bg-[var(--a-surface)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.artworkSrc}
                      alt={t.artworkAlt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-code text-[13px] text-[var(--a-accent-text)]">{t.number}</span>
                    <h3 className="font-display text-[24px] font-bold leading-tight text-[var(--a-ink)]">{t.title}</h3>
                  </div>
                  <p className="mt-1 font-code text-[13px] text-[var(--a-muted)]">
                    {t.zoneLabel} · {t.duration}
                  </p>
                  <p className="mt-3 font-serif italic text-[17px] leading-snug text-[var(--a-ink)]/85">{t.summary}</p>
                  <span className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-[var(--a-ink)]">
                    Story &amp; lyrics <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </m.li>
            ))}
          </ol>

          {bonusTracks.length > 0 && (
            <div className="mt-16 border-t border-[var(--a-rule)] pt-8">
              <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
                Deluxe bonus takes
              </p>
              <ul className="mt-4 divide-y divide-[var(--a-rule)]">
                {bonusTracks.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/persist/${t.slug}`}
                      className="group flex min-h-[64px] items-center justify-between gap-4 py-4 no-underline"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-code text-[13px] text-[var(--a-accent-text)]">{t.number}</span>
                        <span className="font-display text-[19px] font-bold text-[var(--a-ink)]">{t.title}</span>
                      </span>
                      <span className="flex items-center gap-3 font-code text-[13px] text-[var(--a-muted)]">
                        {t.duration}
                        <ArrowRight className="h-4 w-4 text-[var(--a-ink)] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
