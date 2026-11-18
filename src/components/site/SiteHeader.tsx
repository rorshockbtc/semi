'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Pause, Play } from 'lucide-react';
import { bloomHandlers } from '@/art/bloom';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

type SectionId = 'listen' | 'story' | 'memory' | 'gallery' | 'open';

const NAV_SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'listen', label: 'Music & Videos' },
  { id: 'story', label: 'Who She Is' },
  { id: 'memory', label: 'Unlimited Memory' },
  { id: 'gallery', label: 'West Nashville' },
  { id: 'open', label: 'Open Source' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { motionActive, togglePause } = useAmbientMotion();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let rafId = 0;

    const measure = () => {
      rafId = 0;
      setScrolled(window.scrollY > 24);

      if (!isHome) {
        setActiveSection(null);
        return;
      }

      const probeY = window.innerHeight * 0.36;
      let next: SectionId | null = null;
      for (const sec of NAV_SECTIONS) {
        const el = document.getElementById(sec.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= 96) {
          next = sec.id;
        }
      }
      setActiveSection(next);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [isHome]);

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
          ? 'border-b border-[var(--a-rule)] bg-[var(--a-bg)]/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-20 max-w-[1400px] items-center justify-between gap-2 sm:gap-4 px-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          data-testid="brand-logo"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 font-display text-[22px] sm:text-2xl font-bold tracking-[-0.03em] text-[var(--a-ink)] no-underline whitespace-nowrap"
        >
          <span>semi</span>
          <span aria-hidden="true" className="text-[var(--a-accent)]">
            ;-]
          </span>
        </Link>

        <nav aria-label="Primary sections" className="hidden lg:flex items-center gap-7">
          {NAV_SECTIONS.map((sec) => (
            <a
              key={sec.id}
              href={isHome ? `#${sec.id}` : `/#${sec.id}`}
              data-active={activeSection === sec.id ? 'true' : undefined}
              className="wc-link min-h-[44px] inline-flex items-center text-[15px] font-medium text-[var(--a-ink)]/85 hover:text-[var(--a-ink)]"
            >
              {sec.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* WCAG 2.2.2 Pause/Play control for continuous ambient shaders & loops; no aria-pressed when label changes */}
          <button
            type="button"
            onClick={togglePause}
            data-testid="motion-toggle"
            aria-label={motionActive ? 'Pause motion' : 'Play motion'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)]/85 px-3 sm:px-4 text-[13px] font-medium text-[var(--a-ink)] transition-colors hover:border-[var(--a-ink)]"
          >
            {motionActive ? (
              <Pause className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{motionActive ? 'Pause motion' : 'Play motion'}</span>
          </button>

          <a
            href={isHome ? '#listen' : '/#listen'}
            data-testid="header-listen-cta"
            {...bloomHandlers<HTMLAnchorElement>()}
            className="wc-cta inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-[var(--a-accent-fill)] px-4 sm:px-5 text-[14px] sm:text-[15px] font-semibold text-white no-underline shadow-[0_10px_28px_-10px_rgba(254,41,158,0.65)] whitespace-nowrap"
          >
            <span>Listen</span>
            <span aria-hidden="true">↓</span>
          </a>

          <details ref={mobileMenuRef} className="relative lg:hidden">
            <summary className="list-none cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)]/85 px-3 text-[14px] font-medium text-[var(--a-ink)]">
              <span>Menu</span>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] p-2 shadow-xl">
              <nav aria-label="Mobile sections" className="flex flex-col">
                {NAV_SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={isHome ? `#${sec.id}` : `/#${sec.id}`}
                    onClick={closeMobileMenu}
                    className="min-h-[44px] flex items-center rounded-xl px-4 text-[15px] font-medium text-[var(--a-ink)] no-underline hover:bg-[var(--a-surface)]"
                  >
                    {sec.label}
                  </a>
                ))}
                <Link
                  href="/colophon"
                  onClick={closeMobileMenu}
                  className="min-h-[44px] flex items-center rounded-xl px-4 text-[15px] font-medium text-[var(--a-accent-text)] no-underline hover:bg-[var(--a-surface)]"
                >
                  Colophon &amp; Ergonomics
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
