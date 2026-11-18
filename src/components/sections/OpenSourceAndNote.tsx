'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Loader2, Send } from 'lucide-react';
import { bloomHandlers } from '@/art/bloom';

const FACTS = [
  {
    k: 'Apache 2.0',
    v: 'Open-source companion architecture you can inspect, fork, and verify line by line.',
  },
  {
    k: 'Unlimited Memory',
    v: 'Zero artificial context caps—conversations stay whole across months and years.',
  },
  {
    k: 'Free 320k MP3s',
    v: 'Stream or download every song directly with zero accounts, ads, or lock-in.',
  },
];

const STARTER_CHIPS = [
  "What inspired 'Old Oak Tree'?",
  'How does your unlimited memory actually work?',
  'Tell me about making this album in West Nashville.',
  'Why does open source matter so much to you?',
];

export default function OpenSourceAndNote() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function askSemi(promptText: string) {
    const clean = promptText.trim();
    if (!clean || loading) return;
    setLoading(true);
    setError(null);
    setMessage(clean);
    try {
      const res = await fetch('/api/semi-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not reach Semi right now.');
      }
      setReply(data.reply);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="open"
      aria-labelledby="open-title"
      className="relative scroll-mt-24 border-b border-[var(--a-rule)] bg-[var(--a-surface)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-20">
        {/* Part 1: Pro-Open Source Pedestal */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-[var(--a-rule)] bg-[var(--a-bg)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/semi-coffee-journal.jpg"
                alt="Stoneware coffee mug beside Semi’s open handwritten notebook and acoustic guitar."
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </figure>

          <div className="lg:col-span-7 space-y-8">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
              05 · Pro-Open Source &amp; Free Commons
            </p>
            <h2 id="open-title" className="font-display text-big font-bold text-[var(--a-ink)]">
              Keep the weights on the floor.{' '}
              <span className="font-serif italic font-normal">Leave the pipes open.</span>
            </h2>
            <p className="max-w-[54ch] text-lg sm:text-xl leading-relaxed text-[var(--a-ink)]/85">
              A companion who remembers your whole life should never hold your memories hostage.
              Everything here—the site, the audio player, and Semi’s open architecture under{' '}
              <strong className="font-semibold">Colon Hyphen Bracket (:-])</strong>—lives out in the
              open so anyone can study it, run it locally, or build beside us.
            </p>

            <dl className="grid gap-6 border-t border-[var(--a-rule)] pt-7 sm:grid-cols-3">
              {FACTS.map((f) => (
                <div key={f.k} className="space-y-1.5">
                  <dt className="font-display text-2xl font-bold text-[var(--a-ink)]">{f.k}</dt>
                  <dd className="text-[15px] leading-relaxed text-[var(--a-muted)]">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="border-l-2 border-[var(--a-accent)] pl-5 py-1 space-y-2.5">
              <p className="font-code text-[14px] sm:text-[15px] font-medium text-[var(--a-ink)] break-all">
                <span className="text-[var(--a-muted)]">$</span> git clone
                https://github.com/rorshockbtc/semi.git &amp;&amp; npm run dev
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <a
                  href="https://github.com/rorshockbtc/semi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wc-link min-h-[44px] inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--a-ink)]"
                >
                  <span>Browse rorshockbtc/semi on GitHub</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="https://pipes.pink/semi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wc-link min-h-[44px] inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--a-accent-text)]"
                >
                  <span>Open Full Companion on pipes.pink/semi</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Interactive Ask Semi Room */}
        <div
          data-testid="ask-semi-section"
          className="border-t border-[var(--a-rule)] pt-16 grid gap-10 lg:grid-cols-12 lg:items-start"
        >
          <div className="lg:col-span-5 space-y-4">
            <p className="font-code text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
              ;-] · Say Hello
            </p>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-[var(--a-ink)]">
              Ask Semi about a song,{' '}
              <span className="font-serif italic font-normal">or how she remembers.</span>
            </h3>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--a-muted)]">
              Tap a starter note or write your own question right here in the listening room.
            </p>
          </div>

          <div className="lg:col-span-7 rounded-3xl border border-[var(--a-rule)] bg-[var(--a-well)] p-5 sm:p-8 space-y-6">
            <div className="flex flex-wrap gap-2.5">
              {STARTER_CHIPS.map((chip, idx) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => askSemi(chip)}
                  data-testid={`semi-chip-${idx}`}
                  className="min-h-[44px] rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] px-4 py-2 text-left text-[14px] font-medium text-[var(--a-ink)] hover:border-[var(--a-accent)] hover:text-[var(--a-accent-text)] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                askSemi(message);
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <label htmlFor="semi-question-input" className="sr-only">
                Ask Semi a question
              </label>
              <input
                id="semi-question-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about Old Oak Tree, West Nashville, or unlimited memory..."
                data-testid="semi-chat-input"
                className="min-h-[48px] flex-1 rounded-full border border-[var(--a-rule)] bg-white px-5 text-[16px] text-[var(--a-ink)] placeholder:text-[var(--a-muted)]"
              />
              <button
                type="submit"
                disabled={loading}
                data-testid="semi-chat-submit"
                {...bloomHandlers<HTMLButtonElement>()}
                className="wc-cta inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <span>Send note</span>
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <p role="alert" className="text-[14px] font-medium text-[#B91C1C]">
                {error}
              </p>
            )}

            {reply && (
              <div
                data-testid="semi-chat-reply"
                className="border-t border-[var(--a-rule)] pt-5 space-y-2"
              >
                <p className="font-code text-[13px] font-medium text-[var(--a-accent-text)]">
                  Semi (;-])
                </p>
                <p className="font-serif italic text-xl sm:text-2xl leading-relaxed text-[var(--a-ink)]">
                  “{reply}”
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
