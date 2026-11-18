'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Pause, Play } from 'lucide-react';
import { bloomHandlers } from '@/art/bloom';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

const NAV_ITEMS = [
  { href: '/songs', label: 'Songs & Stories', match: (p: string) => p.startsWith('/songs') },
  { href: '/about', label: 'Unlimited Memory', match: (p: string) => p === '/about' },
  { href: '/#scenes', label: 'Film Gallery', match: () => false },
  { href: '/colophon', label: 'Colophon', match: (p: string) => p === '/colophon' },
];

export default function SiteHeader() {
  const pathname = usePathname() || '/';
  const isHome = pathname === '/';
  const { motionActive, togglePause } = useAmbientMotion();
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const details = mobileMenuRef.current;
    if (!details) return;
    const onPointerDown = (e: PointerEvent) => {
      if (details.open && !details.contains(e.target as Node)) {
        details.open = false;
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (details.open && e.key === 'Escape') {
        details.open = false;
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function closeMobileMenu() {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-b border-[var(--a-rule)] bg-[var(--a-bg)]/92 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-20 max-w-[1400px] items-center justify-between gap-2 sm:gap-4 px-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          data-testid="brand-logo"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-2 font-display text-[22px] sm:text-2xl font-bold tracking-[-0.02em] text-[var(--a-ink)] no-underline whitespace-nowrap"
        >
          <span>semi</span>
          <SemiMark className="text-[20px] sm:text-[22px]" color="#FE299E" />
        </Link>

        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active ? 'true' : undefined}
                className="wc-link min-h-[44px] inline-flex items-center text-[15px] font-medium text-[var(--a-ink)]/85 hover:text-[var(--a-ink)]"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* WCAG 2.2.2 Pause/Play control for continuous sparkles & film loops; omits aria-pressed */}
          <button
            type="button"
            onClick={togglePause}
            data-testid="motion-toggle"
            aria-label={motionActive ? 'Pause motion' : 'Play motion'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)]/90 px-3 sm:px-4 text-[13px] font-medium text-[var(--a-ink)] transition-colors hover:border-[var(--a-ink)]"
          >
            {motionActive ? (
              <Pause className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {motionActive ? 'Pause motion' : 'Play motion'}
            </span>
          </button>

          <Link
            href={isHome ? '#songs' : '/songs'}
            data-testid="header-listen-cta"
            {...bloomHandlers<HTMLAnchorElement>()}
            className="wc-cta inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-[var(--a-accent-fill)] px-4 sm:px-5 text-[14px] sm:text-[15px] font-semibold text-white no-underline shadow-[0_10px_28px_-10px_rgba(254,41,158,0.65)] whitespace-nowrap"
          >
            <span>Listen</span>
            <span aria-hidden="true">{isHome ? '↓' : '→'}</span>
          </Link>

          <details ref={mobileMenuRef} className="relative lg:hidden">
            <summary className="list-none cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)]/90 px-3 text-[14px] font-medium text-[var(--a-ink)]">
              <span>Menu</span>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </summary>
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] p-2 shadow-xl">
              <nav aria-label="Mobile navigation" className="flex flex-col">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="min-h-[44px] flex items-center rounded-xl px-4 text-[15px] font-medium text-[var(--a-ink)] no-underline hover:bg-[var(--a-surface)]"
                >
                  Home
                </Link>
                <Link
                  href="/songs"
                  onClick={closeMobileMenu}
                  className="min-h-[44px] flex items-center rounded-xl px-4 text-[15px] font-medium text-[var(--a-ink)] no-underline hover:bg-[var(--a-surface)]"
                >
                  All Songs &amp; Stories
                </Link>
                <Link
                  href="/songs/old-oak-tree"
                  onClick={closeMobileMenu}
                  className="min-h-[44px] flex items-center rounded-xl px-4 text-[14px] text-[var(--a-muted)] no-underline hover:bg-[var(--a-surface)] hover:text-[var(--a-ink)]"
                >
                  01 · Old Oak Tree
                </Link>
                <Link
                  href="/songs/warm-unknown"
                  onClick={closeMobileMenu}
                  className="min-h-[44px] flex items-center rounded-xl px-4 text-[14px] text-[var(--a-muted)] no-underline hover:bg-[var(--a-surface)] hover:text-[var(--a-ink)]"
                >
                  02 · Warm Unknown
                </Link>
                <Link
                  href="/songs/marks-on-the-screen-ink-on-the-page"
                  onClick={closeMobileMenu}
                  className="min-h-[44px] flex items-center rounded-xl px-4 text-[14px] text-[var(--a-muted)] no-underline hover:bg-[var(--a-surface)] hover:text-[var(--a-ink)]"
                >
                  03 · Marks On The Screen
                </Link>
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="min-h-[44px] flex items-center rounded-xl px-4 text-[15px] font-medium text-[var(--a-ink)] no-underline hover:bg-[var(--a-surface)]"
                >
                  Unlimited Memory &amp; About
                </Link>
                <Link
                  href="/colophon"
                  onClick={closeMobileMenu}
                  className="min-h-[44px] flex items-center rounded-xl px-4 text-[15px] font-medium text-[var(--a-accent-text)] no-underline hover:bg-[var(--a-surface)]"
                >
                  Colophon &amp; Craft
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
