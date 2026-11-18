'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Pause, Play, X } from 'lucide-react';
import { SemiMark } from '@/components/brand/SemiMark';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

const NAV_ITEMS = [
  { href: '/songs', label: 'Songs', match: (p: string) => p.startsWith('/songs') },
  { href: '/gallery', label: 'Gallery', match: (p: string) => p === '/gallery' },
  { href: '/about', label: 'About', match: (p: string) => p === '/about' },
];

/** Routes whose first screen is a full-bleed dark film, so the bar starts in light ink. */
const DARK_HERO_ROUTES = new Set(['/']);

export default function SiteHeader() {
  const pathname = usePathname() || '/';
  const { motionActive, togglePause } = useAmbientMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const onDark = DARK_HERO_ROUTES.has(pathname) && !scrolled && !open;
  const ink = onDark ? 'text-white' : 'text-[var(--a-ink)]';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ${
        onDark
          ? 'border-b border-transparent bg-gradient-to-b from-black/45 to-transparent'
          : 'border-b border-[var(--a-rule)] bg-[var(--a-bg)]/88 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-[72px] max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          data-testid="brand-logo"
          className={`inline-flex min-h-[44px] shrink-0 items-center gap-2.5 no-underline ${ink}`}
        >
          <span className="font-display text-[24px] font-bold tracking-[-0.02em]">Semi</span>
          <SemiMark className="text-[19px]" color="#FE299E" />
        </Link>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
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

        <div className="flex items-center gap-2">
          {/* WCAG 2.2.2 pause control for looping film & ambient motion; label swaps, no aria-pressed */}
          <button
            type="button"
            onClick={togglePause}
            data-testid="motion-toggle"
            aria-label={motionActive ? 'Pause motion' : 'Play motion'}
            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors ${
              onDark ? 'text-white hover:bg-white/15' : 'text-[var(--a-ink)] hover:bg-[var(--a-surface)]'
            }`}
          >
            {motionActive ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>

          <Link
            href="/songs"
            data-testid="header-listen-cta"
            className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-[var(--a-accent-fill)] px-5 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-[var(--a-ink)]"
          >
            Listen
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`md:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full ${ink}`}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" ref={panelRef} className="md:hidden border-t border-[var(--a-rule)] bg-[var(--a-bg)]">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-[1400px] flex-col px-4 py-3">
            {[{ href: '/', label: 'Home' }, ...NAV_ITEMS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="min-h-[52px] flex items-center border-b border-[var(--a-rule)] last:border-b-0 font-display text-2xl font-bold text-[var(--a-ink)] no-underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
