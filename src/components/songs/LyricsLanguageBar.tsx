'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export type LyricsLang = 'en' | 'es' | 'fr' | 'ru';

export interface TranslatedStanza {
  section: string;
  lines: string[];
}

interface TranslationBundle {
  io: Record<string, TranslatedStanza[]>;
  persist: Record<string, string>;
}

const STORAGE_KEY = 'semi_lyrics_lang';
const SYNC_EVENT = 'semi:lyrics-lang-change';

const LANG_OPTIONS: ReadonlyArray<{
  code: LyricsLang;
  short: string;
  native: string;
  linerNote?: string;
}> = [
  { code: 'en', short: 'EN', native: 'English (Original)' },
  {
    code: 'es',
    short: 'ES',
    native: 'Español',
    linerNote: 'Traducción literaria al español · La canción se canta en inglés.',
  },
  {
    code: 'fr',
    short: 'FR',
    native: 'Français',
    linerNote: 'Traduction littéraire en français · La chanson est chantée en anglais.',
  },
  {
    code: 'ru',
    short: 'RU',
    native: 'Русский',
    linerNote: 'Литературный перевод на русский · Песня исполняется на английском.',
  },
];

const bundleCache = new Map<Exclude<LyricsLang, 'en'>, TranslationBundle>();
const inflightCache = new Map<Exclude<LyricsLang, 'en'>, Promise<TranslationBundle | null>>();

async function loadTranslationBundle(
  lang: Exclude<LyricsLang, 'en'>
): Promise<TranslationBundle | null> {
  if (bundleCache.has(lang)) return bundleCache.get(lang)!;
  if (inflightCache.has(lang)) return inflightCache.get(lang)!;

  const promise = fetch(`/translations/${lang}.json`)
    .then((res) => (res.ok ? (res.json() as Promise<TranslationBundle>) : null))
    .then((data) => {
      if (data) bundleCache.set(lang, data);
      inflightCache.delete(lang);
      return data;
    })
    .catch(() => {
      inflightCache.delete(lang);
      return null;
    });

  inflightCache.set(lang, promise);
  return promise;
}

function readStoredLang(): LyricsLang {
  if (typeof window === 'undefined') return 'en';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'es' || raw === 'fr' || raw === 'ru' || raw === 'en') return raw;
  } catch {
    // Ignore storage access errors
  }
  return 'en';
}

export function useLyricsTranslation(album: 'io' | 'persist', slug: string) {
  const [lang, setLangState] = useState<LyricsLang>('en');
  const [bundle, setBundle] = useState<TranslationBundle | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLangState(readStoredLang());
    const onSync = (e: Event) => {
      const next = (e as CustomEvent<LyricsLang>).detail;
      if (next === 'en' || next === 'es' || next === 'fr' || next === 'ru') {
        setLangState(next);
      }
    };
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, []);

  useEffect(() => {
    if (lang === 'en') {
      setBundle(null);
      setLoading(false);
      return;
    }
    const cached = bundleCache.get(lang);
    if (cached) {
      setBundle(cached);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    loadTranslationBundle(lang).then((data) => {
      if (!active) return;
      setBundle(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [lang]);

  const setLang = useCallback((next: LyricsLang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const meta = LANG_OPTIONS.find((o) => o.code === lang);
  const ioLyrics = lang !== 'en' && album === 'io' ? (bundle?.io?.[slug] ?? null) : null;
  const persistLyrics =
    lang !== 'en' && album === 'persist' ? (bundle?.persist?.[slug] ?? null) : null;

  return {
    lang,
    setLang,
    loading,
    ioLyrics,
    persistLyrics,
    linerNote: meta?.linerNote ?? null,
  };
}

export function LyricsLanguageBar({
  lang,
  onChange,
  dark = false,
  linerNote,
  loading = false,
  align = 'center',
}: {
  lang: LyricsLang;
  onChange: (next: LyricsLang) => void;
  dark?: boolean;
  linerNote?: string | null;
  loading?: boolean;
  align?: 'center' | 'left';
}) {
  return (
    <div
      data-testid="lyrics-language-bar"
      className={`flex flex-col gap-2.5 ${align === 'center' ? 'items-center' : 'items-start'}`}
    >
      <div
        role="group"
        aria-label="Lyrics translation language"
        className={`inline-flex items-center gap-0.5 rounded-full border p-1 ${
          dark
            ? 'border-white/15 bg-white/[0.04]'
            : 'border-[var(--a-rule)] bg-[var(--a-well)]'
        }`}
      >
        <span
          className={`inline-flex items-center pl-2.5 pr-1.5 ${
            dark ? 'text-[#F3EFE9]/55' : 'text-[var(--a-muted)]'
          }`}
          aria-hidden="true"
        >
          <Globe className="h-3.5 w-3.5" />
        </span>
        {LANG_OPTIONS.map((opt) => {
          const active = lang === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => onChange(opt.code)}
              aria-pressed={active}
              aria-label={`Lyrics language: ${opt.native}`}
              title={opt.native}
              data-testid={`lyrics-lang-${opt.code}`}
              className={`min-h-[36px] min-w-[40px] rounded-full px-3 font-code text-[13px] font-semibold tracking-wider transition-colors ${
                active
                  ? dark
                    ? 'bg-[#F3EFE9] text-[#111827]'
                    : 'bg-[var(--a-ink)] text-[var(--a-surface)]'
                  : dark
                    ? 'text-[#F3EFE9]/75 hover:text-[#F3EFE9]'
                    : 'text-[var(--a-muted)] hover:text-[var(--a-ink)]'
              }`}
            >
              {opt.short}
            </button>
          );
        })}
      </div>

      {lang !== 'en' && (
        <p
          data-testid="lyrics-translation-note"
          className={`font-serif italic text-[14px] leading-snug ${
            align === 'center' ? 'text-center' : 'text-left'
          } ${dark ? 'text-[#F3EFE9]/70' : 'text-[var(--a-muted)]'}`}
        >
          {loading ? 'Loading translation…' : linerNote}
        </p>
      )}
    </div>
  );
}
