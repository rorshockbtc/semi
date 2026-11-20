'use client';

import React, { useState } from 'react';
import { Check, Disc3, Mail } from 'lucide-react';
import { SemiMark } from '@/components/brand/SemiMark';
import { SEMI_TRACKS } from '@/data/semi-songs';

export default function SongNotifyCard() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const releasedCount = SEMI_TRACKS.length;
  const targetTrackMin = 10;
  const targetTrackMax = 15;
  const progressPct = Math.min(100, Math.round((releasedCount / targetTrackMin) * 100));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || status === 'submitting') return;

    setStatus('submitting');
    setFeedback('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus('error');
        setFeedback(data.error || 'Please check your email address and try again.');
        return;
      }
      setStatus('success');
      setFeedback(
        data.message || 'You’re on the list. Check your inbox for a quick note from Semi.'
      );
      setEmail('');
    } catch {
      setStatus('error');
      setFeedback('Couldn’t reach the server right now. Please try again in a moment.');
    }
  }

  return (
    <div
      id="notify"
      data-testid="song-notify-card"
      className="mt-16 scroll-mt-24 rounded-[24px] border border-[var(--a-rule)] bg-[var(--a-surface)] p-6 sm:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-3.5 py-1.5 font-code text-[13px] font-medium text-[var(--a-ink)]">
              <Disc3 className="h-3.5 w-3.5 text-[var(--a-accent-text)]" aria-hidden="true" />
              <span data-testid="album-milestone-badge">
                {releasedCount} of {targetTrackMin}–{targetTrackMax} songs out · Full album download at {targetTrackMin}+ tracks
              </span>
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-[var(--a-ink)]">
            Get a personal note from Semi when a new song goes up.
          </h3>

          <p className="max-w-[58ch] text-[16px] leading-relaxed text-[var(--a-muted)]">
            Every single is free to stream and download right now. Leave your email and Semi will
            send a quiet postcard when the next track is recorded—and when all {targetTrackMin}–{targetTrackMax}{' '}
            songs unlock together as the complete <em>Local Current</em> album download.
          </p>

          {/* Subtle album completion bar */}
          <div className="max-w-md pt-1" aria-hidden="true">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--a-bg)]">
              <div
                className="h-full rounded-full bg-[var(--a-accent-fill)] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          {status === 'success' ? (
            <div
              role="status"
              data-testid="song-notify-success"
              className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] p-5 sm:p-6 space-y-2"
            >
              <div className="flex items-center gap-2.5 font-sans text-[15px] font-semibold text-[var(--a-ink)]">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>Note on its way</span>
                <SemiMark className="ml-auto text-[15px]" color="#FE299E" />
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--a-muted)]">{feedback}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <label htmlFor="semi-notify-email" className="block font-sans text-[14px] font-semibold text-[var(--a-ink)]">
                Your email address
              </label>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="relative flex-1">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--a-muted)]"
                    aria-hidden="true"
                  />
                  <input
                    id="semi-notify-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    data-testid="song-notify-input"
                    className="min-h-[48px] w-full rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] pl-11 pr-4 text-[15px] text-[var(--a-ink)] placeholder:text-[var(--a-muted)]/70 focus:border-[var(--a-ink)] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  data-testid="song-notify-submit"
                  className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--a-ink)] disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Sending…' : 'Notify me'}
                </button>
              </div>
              {status === 'error' && (
                <p role="alert" className="text-[14px] font-medium text-[var(--a-accent-text)]">
                  {feedback}
                </p>
              )}
              <p className="text-[13px] leading-relaxed text-[var(--a-muted)]">
                Sent from <span className="font-code">cubby@colonhyphenbracket.pink</span> · Only new songs &amp; the full album release, one-click unsubscribe.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
