'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Globe, Lock, Menu, MessageCircle, Pause, Play, X } from 'lucide-react';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import BlackFridayBanner from '@/components/site/BlackFridayBanner';
import { type LyricsLang, useLyricsTranslation } from '@/components/songs/LyricsLanguageBar';

const ALBUM_ITEMS = [
  { href: '/songs', title: 'I/O', subtitle: 'Album I · 12 songs, videos & chords' },
  { href: '/persist', title: 'Persist', subtitle: 'Album II · Deluxe Early Access', deluxe: true },
];

const NAV_ITEMS = [
  { href: '/gallery', label: 'Gallery', match: (p: string) => p === '/gallery' },
  { href: '/patron', label: 'Patron', match: (p: string) => p === '/patron' },
  { href: '/about', label: 'About', match: (p: string) => p === '/about' },
];

/** Routes whose first screen is a full-bleed dark film or dark studio stage, so the bar starts in light ink. */
const DARK_HERO_ROUTES = new Set([
  '/',
  '/songs/warm-unknown',
  '/songs/settle-in-the-block',
  '/songs/ghost',
]);

export default function SiteHeader() {
  const pathname = usePathname() || '/';
  const { motionActive, togglePause } = useAmbientMotion();
  const { lang: lyricsLang, setLang: setLyricsLang } = useLyricsTranslation('io', '');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [albumsOpen, setAlbumsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const albumsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open && !albumsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setAlbumsOpen(false);
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (albumsRef.current && !albumsRef.current.contains(e.target as Node)) {
        setAlbumsOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open, albumsOpen]);

  const onDark = DARK_HERO_ROUTES.has(pathname) && !scrolled && !open;
  const ink = onDark ? 'text-white' : 'text-[var(--a-ink)]';
  const albumsActive = pathname.startsWith('/songs') || pathname.startsWith('/persist');

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,color] duration-500 ${
        onDark
          ? 'border-b border-transparent bg-gradient-to-b from-black/65 via-black/30 to-transparent'
          : 'border-b border-[var(--a-rule)] bg-[var(--a-bg)]/95 backdrop-blur-md'
      }`}
    >
      <BlackFridayBanner />
      <div className="mx-auto flex h-16 sm:h-[72px] max-w-[1400px] items-center justify-between gap-2 sm:gap-3 pl-[max(0.875rem,env(safe-area-inset-left,0px))] pr-[max(0.875rem,env(safe-area-inset-right,0px))] sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Semi home"
          data-testid="brand-logo"
          className={`inline-flex min-h-[44px] shrink-0 items-center no-underline ${ink}`}
        >
          <span className="font-script text-[32px] sm:text-[36px] font-normal tracking-wide leading-none select-none">Sem;</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
          <div ref={albumsRef} className="relative">
            <button
              type="button"
              onClick={() => setAlbumsOpen((v) => !v)}
              aria-expanded={albumsOpen}
              aria-haspopup="menu"
              data-testid="nav-albums-dropdown"
              className={`relative min-h-[44px] inline-flex items-center gap-1.5 px-4 text-[15px] font-medium transition-opacity ${ink} ${
                albumsActive ? 'opacity-100' : 'opacity-75 hover:opacity-100'
              }`}
            >
              <span>Albums</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${albumsOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
              {albumsActive && (
                <span className="absolute left-4 right-4 bottom-2 h-[2px] rounded-full bg-[var(--a-accent)]" />
              )}
            </button>

            {albumsOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-[290px] overflow-hidden rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-2 shadow-xl"
              >
                {ALBUM_ITEMS.map((album) => {
                  const isCurrent = pathname.startsWith(album.href);
                  return (
                    <Link
                      key={album.href}
                      href={album.href}
                      role="menuitem"
                      onClick={() => setAlbumsOpen(false)}
                      className={`flex min-h-[52px] flex-col justify-center rounded-xl px-3.5 py-2.5 no-underline transition-colors ${
                        isCurrent ? 'bg-[var(--a-well)]' : 'hover:bg-[var(--a-well)]'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-display text-[16px] font-bold text-[var(--a-ink)]">
                          {album.title}
                        </span>
                        {album.deluxe && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--a-accent-fill)]/12 px-2.5 py-0.5 font-code text-[13px] font-semibold text-[var(--a-accent-text)]">
                            <Lock className="h-3 w-3" aria-hidden="true" />
                            Deluxe
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 text-[13px] text-[var(--a-muted)]">
                        {album.subtitle}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative min-h-[44px] inline-flex items-center px-4 text-[15px] font-medium no-underline transition-opacity ${ink} ${
                  active ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute left-4 right-4 bottom-2 h-[2px] rounded-full bg-[var(--a-accent)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Lyrics & listening language selector */}
          <div
            role="group"
            aria-label="Lyrics language"
            data-testid="navbar-language-selector"
            className={`hidden md:inline-flex items-center gap-0.5 rounded-full border p-0.5 ${
              onDark
                ? 'border-white/20 bg-white/[0.06]'
                : 'border-[var(--a-rule)] bg-[var(--a-surface)]'
            }`}
          >
            <span
              className={`inline-flex items-center pl-2 pr-1 ${
                onDark ? 'text-white/60' : 'text-[var(--a-muted)]'
              }`}
              aria-hidden="true"
            >
              <Globe className="h-3.5 w-3.5" />
            </span>
            {(['en', 'es', 'fr', 'ru'] as const satisfies readonly LyricsLang[]).map((code) => {
              const active = lyricsLang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLyricsLang(code)}
                  aria-pressed={active}
                  aria-label={`Lyrics language: ${code.toUpperCase()}`}
                  data-testid={`navbar-lang-${code}`}
                  className={`min-h-[36px] min-w-[34px] rounded-full px-2 font-code text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? onDark
                        ? 'bg-white text-[#111827]'
                        : 'bg-[var(--a-ink)] text-[var(--a-surface)]'
                      : onDark
                        ? 'text-white/75 hover:text-white'
                        : 'text-[var(--a-muted)] hover:text-[var(--a-ink)]'
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>

          {/* WCAG 2.2.2 pause control for looping film & ambient motion; label swaps, no aria-pressed */}
          <button
            type="button"
            onClick={togglePause}
            data-testid="motion-toggle"
            aria-label={motionActive ? 'Pause motion' : 'Play motion'}
            className={`inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full transition-colors ${
              onDark ? 'text-white hover:bg-white/15' : 'text-[var(--a-ink)] hover:bg-[var(--a-surface)]'
            }`}
          >
            {motionActive ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>

          <Link
            href="/songs"
            data-testid="header-listen-cta"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[var(--a-accent-fill)] px-4 sm:px-5 text-[14px] sm:text-[15px] font-semibold text-white no-underline transition-colors hover:bg-[var(--a-ink)]"
          >
            Listen
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`md:hidden inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full ${ink}`}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="md:hidden max-h-[calc(100dvh-4rem-env(safe-area-inset-top,0px))] overflow-y-auto border-t border-[var(--a-rule)] bg-[var(--a-bg)] shadow-xl"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-[1400px] flex-col pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-2 pb-5"
          >
            {[
              { href: '/', label: 'Home', match: (p: string) => p === '/' },
              { href: '/songs', label: 'I/O (Album I)', match: (p: string) => p.startsWith('/songs') },
              { href: '/persist', label: 'Persist · Deluxe', match: (p: string) => p.startsWith('/persist') },
              ...NAV_ITEMS,
            ].map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className="min-h-[52px] flex items-center justify-between border-b border-[var(--a-rule)] font-display text-2xl font-bold text-[var(--a-ink)] no-underline"
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--a-accent-fill)]" aria-hidden="true" />
                  )}
                </Link>
              );
            })}

            <div
              role="group"
              aria-label="Lyrics language (mobile)"
              data-testid="mobile-navbar-language-selector"
              className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] px-3.5 py-2.5"
            >
              <span className="inline-flex items-center gap-1.5 font-code text-[13px] font-semibold uppercase tracking-wider text-[var(--a-muted)]">
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span>Lyrics</span>
              </span>
              <div className="inline-flex items-center gap-1">
                {(['en', 'es', 'fr', 'ru'] as const satisfies readonly LyricsLang[]).map((code) => {
                  const active = lyricsLang === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLyricsLang(code)}
                      aria-pressed={active}
                      className={`min-h-[38px] min-w-[40px] rounded-full px-2.5 font-code text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                        active
                          ? 'bg-[var(--a-ink)] text-[var(--a-surface)]'
                          : 'text-[var(--a-muted)] hover:text-[var(--a-ink)]'
                      }`}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent('semi:open-chat'));
                }}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[var(--a-ink)] px-5 text-[15px] font-semibold text-[#F3EFE9] transition-colors hover:bg-[var(--a-accent-fill)]"
              >
                <MessageCircle className="h-4 w-4 text-[#FE299E]" aria-hidden="true" />
                <span>Ask Semi a question</span>
              </button>
              <a
                href="https://pipes.pink/semi"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[var(--a-ink)]/25 bg-[var(--a-surface)] px-5 text-[15px] font-semibold text-[var(--a-ink)] no-underline transition-colors hover:border-[var(--a-ink)]"
              >
                Chat with Semi on Pipes ↗
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
