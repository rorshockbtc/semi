'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ChevronDown, ChevronUp, Disc3, Pause, Play, Share2, Wifi } from 'lucide-react';
import { useAudioPlayer, type DockTrack } from '@/context/AudioPlayerContext';
import {
  LyricsLanguageBar,
  type LyricsLang,
  type TranslatedStanza,
} from '@/components/songs/LyricsLanguageBar';
import { PERSIST_ALBUM_META, PERSIST_TRACKS } from '@/data/persist-songs';
import { SEMI_TRACKS } from '@/data/semi-songs';

const DEVICE_STORAGE_KEY = 'semi_listen_device_id';
const PASS_CODE_STORAGE_KEY = 'semi_listen_pass_code';
const LANG_STORAGE_KEY = 'semi_lyrics_lang';

interface TranslationBundle {
  io: Record<string, TranslatedStanza[]>;
  persist: Record<string, string>;
}

const UI_COPY: Record<
  LyricsLang,
  {
    eyebrow: string;
    heading: string;
    subtitle: string;
    deviceBound: string;
    playAlbum: string;
    pauseAlbum: string;
    lyrics: string;
    hideLyrics: string;
    lockedTitle: string;
    lockedBody: string;
    exploreCta: string;
    linerNote: string | null;
  }
> = {
  en: {
    eyebrow: 'Listening Pass · Stream-Only',
    heading: 'Listen to Semi',
    subtitle:
      'Stream the full albums online from this device. Playback requires an internet connection and does not include file downloads.',
    deviceBound: 'Pass remembered on this device · Online stream only · No downloads',
    playAlbum: 'Play album',
    pauseAlbum: 'Pause',
    lyrics: 'Lyrics',
    hideLyrics: 'Hide lyrics',
    lockedTitle: 'Physical Listening Pass Required',
    lockedBody:
      'Scan the QR code on your physical card or insert to activate stream-only listening on this device.',
    exploreCta: 'Explore Semi’s site →',
    linerNote: null,
  },
  es: {
    eyebrow: 'Pase de Escucha · Solo Streaming',
    heading: 'Escucha a Semi',
    subtitle:
      'Escucha los álbumes completos en línea desde este dispositivo. Requiere conexión a internet y no permite descargas.',
    deviceBound: 'Pase recordado en este dispositivo · Solo streaming en línea · Sin descargas',
    playAlbum: 'Reproducir álbum',
    pauseAlbum: 'Pausar',
    lyrics: 'Letra',
    hideLyrics: 'Ocultar letra',
    lockedTitle: 'Se Requiere Pase Físico de Escucha',
    lockedBody:
      'Escanea el código QR de tu tarjeta física para activar la escucha en línea en este dispositivo.',
    exploreCta: 'Explorar el sitio de Semi →',
    linerNote: 'Traducción literaria al español · La canción se canta en inglés.',
  },
  fr: {
    eyebrow: 'Pass d’Écoute · Streaming Uniquement',
    heading: 'Écouter Semi',
    subtitle:
      'Écoutez les albums complets en ligne sur cet appareil. Nécessite une connexion Internet et n’autorise pas le téléchargement.',
    deviceBound: 'Pass mémorisé sur cet appareil · Streaming en ligne uniquement · Sans téléchargement',
    playAlbum: 'Lire l’album',
    pauseAlbum: 'Pause',
    lyrics: 'Paroles',
    hideLyrics: 'Masquer les paroles',
    lockedTitle: 'Pass d’Écoute Physique Requis',
    lockedBody:
      'Scannez le code QR sur votre carte physique pour activer l’écoute en streaming sur cet appareil.',
    exploreCta: 'Découvrir le site de Semi →',
    linerNote: 'Traduction littéraire en français · La chanson est chantée en anglais.',
  },
  ru: {
    eyebrow: 'Пропуск для прослушивания · Только онлайн',
    heading: 'Слушать Semi',
    subtitle:
      'Слушайте полные альбомы онлайн на этом устройстве. Требуется подключение к интернету; скачивание файлов недоступно.',
    deviceBound: 'Пропуск сохранён на этом устройстве · Только онлайн-стриминг · Без скачивания',
    playAlbum: 'Слушать альбом',
    pauseAlbum: 'Пауза',
    lyrics: 'Текст',
    hideLyrics: 'Скрыть текст',
    lockedTitle: 'Требуется физический пропуск',
    lockedBody:
      'Отсканируйте QR-код на вашей физической карточке, чтобы активировать онлайн-прослушивание на этом устройстве.',
    exploreCta: 'Перейти на сайт Semi →',
    linerNote: 'Литературный перевод на русский · Песня исполняется на английском.',
  },
};

function getOrCreateDeviceId(): string {
  try {
    const existing = window.localStorage.getItem(DEVICE_STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;
    const next =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '')
        : `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(DEVICE_STORAGE_KEY, next);
    return next;
  } catch {
    return `dev_${Date.now().toString(36)}`;
  }
}

export default function ListenPassClient() {
  const searchParams = useSearchParams();
  const passParam = searchParams.get('pass') ?? '';

  const { currentTrack, isPlaying, playStreamQueue, pauseAudio } = useAudioPlayer();

  const [status, setStatus] = useState<'checking' | 'active' | 'locked'>('checking');
  const [streamToken, setStreamToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [album, setAlbum] = useState<'persist' | 'io'>('persist');
  const [lang, setLang] = useState<LyricsLang>('en');
  const [bundle, setBundle] = useState<TranslationBundle | null>(null);
  const [loadingLang, setLoadingLang] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [passCode, setPassCode] = useState<string | null>(null);
  const [sharedCopied, setSharedCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === 'en' || stored === 'es' || stored === 'fr' || stored === 'ru') {
        setLang(stored);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (lang === 'en') {
      setBundle(null);
      setLoadingLang(false);
      return;
    }
    let active = true;
    setLoadingLang(true);
    fetch(`/translations/${lang}.json`)
      .then((res) => (res.ok ? (res.json() as Promise<TranslationBundle>) : null))
      .then((data) => {
        if (!active) return;
        setBundle(data);
        setLoadingLang(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadingLang(false);
      });
    return () => {
      active = false;
    };
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    const id = getOrCreateDeviceId();
    let storedPass = '';
    try {
      storedPass = window.localStorage.getItem(PASS_CODE_STORAGE_KEY) ?? '';
    } catch {
      // Ignore storage errors
    }
    const effectivePass = passParam || storedPass;

    fetch('/api/listen-pass/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pass: effectivePass, deviceId: id }),
    })
      .then((res) => res.json())
      .then(
        (data: {
          active?: boolean;
          streamToken?: string;
          deviceId?: string;
          passCode?: string;
        }) => {
          if (cancelled) return;
          if (data?.active && data?.streamToken) {
            setStreamToken(data.streamToken);
            setDeviceId(data.deviceId ?? id);
            if (data.passCode) {
              setPassCode(data.passCode);
              try {
                window.localStorage.setItem(PASS_CODE_STORAGE_KEY, data.passCode);
              } catch {
                // Ignore storage errors
              }
            }
            setStatus('active');
            // Strip ?pass= from URL cleanly while preserving Next.js history state
            if (passParam && typeof window !== 'undefined') {
              window.history.replaceState({ ...(window.history.state || {}) }, '', '/listen');
            }
          } else {
            setStatus('locked');
          }
        }
      )
      .catch(() => {
        if (!cancelled) setStatus('locked');
      });
    return () => {
      cancelled = true;
    };
  }, [passParam]);

  const handleSharePass = async () => {
    if (!passCode || typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/listen?pass=${encodeURIComponent(passCode)}`;
    const shareTitle = 'Semi (; - ]) — Listen Free';
    const shareText =
      lang === 'es'
        ? 'Escucha los álbumes de Semi en línea:'
        : lang === 'fr'
          ? 'Écoutez les albums de Semi en ligne :'
          : lang === 'ru'
            ? 'Слушайте альбомы Semi онлайн:'
            : 'Listen to Semi’s albums online:';

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch {
        // User cancelled or share failed; fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setSharedCopied(true);
      setTimeout(() => setSharedCopied(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleLangChange = (next: LyricsLang) => {
    setLang(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Ignore storage errors
    }
  };

  const persistQueue: DockTrack[] = useMemo(() => {
    if (!streamToken) return [];
    return PERSIST_TRACKS.map((t) => ({
      number: t.number,
      slug: t.slug,
      title: t.title,
      subtitle: `Persist · Stream-Only Pass`,
      duration: t.duration,
      mp3Src: `/api/listen-pass/audio/${t.slug}?token=${encodeURIComponent(streamToken)}`,
      href: '/listen',
      album: 'Persist',
      artworkSrc: PERSIST_ALBUM_META.coverSrc,
      // Strictly stream-only: never attach downloadName
    }));
  }, [streamToken]);

  const ioQueue: DockTrack[] = useMemo(() => {
    if (!streamToken) return [];
    return SEMI_TRACKS.filter((t) => Boolean(t.mp3Src)).map((t) => ({
      number: t.number,
      slug: t.slug,
      title: t.title,
      subtitle: `I/O · Stream-Only Pass`,
      duration: t.duration,
      mp3Src: `/api/listen-pass/audio/${t.slug}?token=${encodeURIComponent(streamToken)}`,
      href: '/listen',
      album: 'I/O',
      artworkSrc: '/photos/io-album-cover.jpg',
      // Strictly stream-only: never attach downloadName
    }));
  }, [streamToken]);

  const activeQueue = album === 'persist' ? persistQueue : ioQueue;
  const copy = UI_COPY[lang];
  const isPlayingCurrentAlbum =
    isPlaying && activeQueue.some((t) => t.slug === currentTrack.slug);

  if (status === 'checking') {
    return (
      <section className="mx-auto max-w-[820px] px-5 sm:px-8 pt-32 pb-24 text-center">
        <p className="font-code text-[13px] uppercase tracking-[0.2em] text-[var(--a-muted)]">
          Checking listening pass…
        </p>
      </section>
    );
  }

  if (status === 'locked') {
    return (
      <section
        data-testid="listen-pass-locked"
        className="mx-auto max-w-[680px] px-5 sm:px-8 pt-32 pb-24 text-center space-y-6"
      >
        <div className="flex justify-center">
          <LyricsLanguageBar
            lang={lang}
            onChange={handleLangChange}
            align="center"
            linerNote={null}
          />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)]">
          {copy.lockedTitle}
        </h1>
        <p className="text-[16px] leading-relaxed text-[var(--a-muted)]">{copy.lockedBody}</p>
        <div>
          <Link
            href="/"
            className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-[var(--a-ink)] px-6 text-[14px] font-semibold text-[var(--a-surface)] hover:bg-[var(--a-accent-fill)] hover:text-white transition-colors"
          >
            {copy.exploreCta}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      data-testid="listen-pass-active"
      onContextMenu={(e) => e.preventDefault()}
      className="mx-auto max-w-[920px] px-5 sm:px-8 pt-28 pb-32 space-y-8"
    >
      {/* Header + Simple Language Toggle */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--a-rule)] pb-6">
        <div className="space-y-2 max-w-[54ch]">
          <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--a-ink)]">
            {copy.heading}
          </h1>
          <p className="text-[15px] leading-relaxed text-[var(--a-ink)]/80">{copy.subtitle}</p>
        </div>

        <LyricsLanguageBar
          lang={lang}
          onChange={handleLangChange}
          linerNote={copy.linerNote}
          loading={loadingLang}
          align="left"
        />
      </div>

      {/* Device-Bound Online-Only Notice */}
      <div
        data-testid="listen-pass-device-badge"
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] px-4 py-3 text-[13px] text-[var(--a-muted)]"
      >
        <span className="inline-flex items-center gap-2 font-medium text-[var(--a-ink)]/85">
          <Wifi className="h-4 w-4 text-[var(--a-accent-text)] shrink-0" aria-hidden="true" />
          <span>{copy.deviceBound}</span>
        </span>
        {deviceId && (
          <span className="font-code text-[13px] text-[var(--a-muted)]">
            ID: {deviceId.slice(0, 8)}
          </span>
        )}
      </div>

      {/* Album Selector + Play Album CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Albums" className="inline-flex items-center gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={album === 'persist'}
            data-testid="listen-album-persist"
            onClick={() => {
              setAlbum('persist');
              setExpandedSlug(null);
            }}
            className={`min-h-[44px] rounded-full px-5 text-[14px] font-semibold transition-colors ${
              album === 'persist'
                ? 'bg-[var(--a-ink)] text-[var(--a-surface)]'
                : 'border border-[var(--a-rule)] bg-[var(--a-surface)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
            }`}
          >
            Persist (14)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={album === 'io'}
            data-testid="listen-album-io"
            onClick={() => {
              setAlbum('io');
              setExpandedSlug(null);
            }}
            className={`min-h-[44px] rounded-full px-5 text-[14px] font-semibold transition-colors ${
              album === 'io'
                ? 'bg-[var(--a-ink)] text-[var(--a-surface)]'
                : 'border border-[var(--a-rule)] bg-[var(--a-surface)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
            }`}
          >
            I/O (12)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {passCode && (
            <button
              type="button"
              onClick={handleSharePass}
              data-testid="listen-share-pass-btn"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] hover:border-[var(--a-ink)] px-5 text-[14px] font-semibold text-[var(--a-ink)] transition-colors"
            >
              {sharedCopied ? (
                <>
                  <Check className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                  <span>
                    {lang === 'es'
                      ? 'Enlace copiado'
                      : lang === 'fr'
                        ? 'Lien copié'
                        : lang === 'ru'
                          ? 'Ссылка скопирована'
                          : 'Link copied'}
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {lang === 'es'
                      ? 'Compartir'
                      : lang === 'fr'
                        ? 'Partager'
                        : lang === 'ru'
                          ? 'Поделиться'
                          : 'Share'}
                  </span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            data-testid="listen-play-album-btn"
            onClick={() => {
              if (isPlayingCurrentAlbum) {
                pauseAudio();
              } else {
                playStreamQueue(activeQueue, album, 0);
              }
            }}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-6 text-[14px] font-semibold text-white transition-colors"
          >
            {isPlayingCurrentAlbum ? (
              <>
                <Pause className="h-4 w-4" aria-hidden="true" />
                <span>{copy.pauseAlbum}</span>
              </>
            ) : (
              <>
                <Disc3 className="h-4 w-4" aria-hidden="true" />
                <span>{copy.playAlbum}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stream-Only Tracklist (Zero Download Buttons) */}
      <div className="divide-y divide-[var(--a-rule)] rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] overflow-hidden">
        {activeQueue.map((track, idx) => {
          const isCurrent = currentTrack.slug === track.slug;
          const isThisPlaying = isCurrent && isPlaying;
          const isExpanded = expandedSlug === track.slug;

          return (
            <div key={track.slug} className="p-4 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  data-testid={`listen-track-${track.slug}`}
                  onClick={() => playStreamQueue(activeQueue, album, idx)}
                  className="min-h-[44px] flex items-center gap-3.5 text-left flex-1 min-w-0"
                >
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isThisPlaying
                        ? 'bg-[var(--a-accent-fill)] text-white'
                        : 'bg-[var(--a-ink)] text-[var(--a-surface)]'
                    }`}
                  >
                    {isThisPlaying ? (
                      <Pause className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Play className="h-4 w-4 translate-x-0.5" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[17px] sm:text-[19px] font-bold text-[var(--a-ink)] truncate">
                      {track.number} · {track.title}
                    </span>
                    <span className="block font-code text-[13px] text-[var(--a-muted)]">
                      {track.duration}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setExpandedSlug(isExpanded ? null : track.slug)}
                  aria-expanded={isExpanded}
                  data-testid={`listen-lyrics-toggle-${track.slug}`}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-[var(--a-rule)] px-4 text-[13px] font-semibold text-[var(--a-ink)] hover:border-[var(--a-ink)] transition-colors shrink-0"
                >
                  <span>{isExpanded ? copy.hideLyrics : copy.lyrics}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div
                  data-testid={`listen-lyrics-panel-${track.slug}`}
                  className="mt-4 border-t border-[var(--a-rule)] pt-4 font-serif text-[17px] leading-[1.7] text-[var(--a-ink)] space-y-4"
                >
                  {album === 'persist' ? (
                    (() => {
                      const raw =
                        lang !== 'en' && bundle?.persist?.[track.slug]
                          ? bundle.persist[track.slug]
                          : PERSIST_TRACKS.find((t) => t.slug === track.slug)?.lyrics ?? '';
                      return (
                        <div className="space-y-1">
                          {raw.split('\n').map((line, lIdx) =>
                            line.trim() ? (
                              <p key={lIdx}>{line}</p>
                            ) : (
                              <div key={lIdx} className="h-3" aria-hidden="true" />
                            )
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    (() => {
                      const stanzas =
                        lang !== 'en' && bundle?.io?.[track.slug]
                          ? bundle.io[track.slug]
                          : SEMI_TRACKS.find((t) => t.slug === track.slug)?.lyrics ?? [];
                      return stanzas.map((stanza, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          <p className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                            {stanza.section}
                          </p>
                          {stanza.lines.map((line, lIdx) => (
                            <p key={lIdx}>{line}</p>
                          ))}
                        </div>
                      ));
                    })()
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
