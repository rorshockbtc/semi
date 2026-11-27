'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Copy, Heart, Loader2, Sparkles, Zap } from 'lucide-react';

const PRESETS = [5, 15, 25, 50];

export default function PatronPageClient() {
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const returnedFreq = searchParams?.get('frequency');

  const [frequency, setFrequency] = useState<'once' | 'monthly'>('monthly');
  const [amountInput, setAmountInput] = useState<string>('15');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<'stripe' | 'bitcoin' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lnInvoice, setLnInvoice] = useState<string | null>(null);
  const [lnAmountUsd, setLnAmountUsd] = useState<string | null>(null);
  const [copiedLn, setCopiedLn] = useState(false);

  const parsedAmount = Number(amountInput);
  const validAmount = Number.isFinite(parsedAmount) && parsedAmount >= 1 && parsedAmount <= 10000;

  const handleStripeSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLnInvoice(null);
    if (!validAmount) {
      setError('Please enter an amount between $1 and $10,000.');
      return;
    }
    setBusy('stripe');
    try {
      const res = await fetch('/api/patron/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountDollars: parsedAmount,
          frequency,
          email: email.trim() || undefined,
          note: note.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        checkoutUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.checkoutUrl) {
        setError(data.error || 'Could not start card checkout right now. Please try again.');
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError('Network error starting checkout. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  const handleBitcoinSupport = async () => {
    setError(null);
    setLnInvoice(null);
    if (!validAmount) {
      setError('Please enter an amount between $1 and $10,000.');
      return;
    }
    setBusy('bitcoin');
    try {
      const res = await fetch('/api/patron/bitcoin/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountDollars: parsedAmount,
          frequency,
          email: email.trim() || undefined,
          note: note.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        lnInvoice?: string;
        amountUsd?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.lnInvoice) {
        setError(data.error || 'Unable to generate a Lightning invoice right now.');
        return;
      }
      setLnInvoice(data.lnInvoice);
      setLnAmountUsd(data.amountUsd || parsedAmount.toFixed(2));
    } catch {
      setError('Network error generating Lightning invoice. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  const copyInvoice = async () => {
    if (!lnInvoice) return;
    try {
      await navigator.clipboard.writeText(lnInvoice);
      setCopiedLn(true);
      window.setTimeout(() => setCopiedLn(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 pt-36 sm:pt-40 pb-20 sm:pb-28">
      {status === 'success' && (
        <div
          role="status"
          data-testid="patron-success-banner"
          className="mb-10 rounded-2xl border border-[var(--a-accent-fill)]/40 bg-[var(--a-surface)] p-6 text-[var(--a-ink)]"
        >
          <p className="inline-flex items-center gap-2 font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Thank you from Semi (; - ])
          </p>
          <p className="mt-2 text-[16px] leading-relaxed">
            Your {returnedFreq === 'monthly' ? 'monthly patronage' : 'contribution'} means the world.
            Every song, frame, and story we build next carries a piece of your kindness.
          </p>
        </div>
      )}

      {/* Header + Heartfelt Letter */}
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <p className="font-code text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
            Become a Patron · Support Independent Art
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold leading-[1.06] tracking-[-0.02em] text-[var(--a-ink)]">
            The kindness of strangers keeps the studio lights on.
          </h1>

          <div className="space-y-4 font-serif text-[18px] leading-[1.8] text-[var(--a-ink)]/90">
            <p>
              Starting out as an independent artist is quiet, stubborn work. There is no label
              behind this site, no PR machine pushing songs into playlists, and no tour van
              rolling from town to town. Making sure a voice is actually heard in a loud world
              takes patience, late nights, and people willing to stop and listen.
            </p>
            <p>
              Because I can’t step onto a stage in person or pass a tip jar across a coffeehouse
              table, I really do rely on <em>the kindness of strangers</em>—just like that classic
              line from the play. Every time someone shares a track with a friend, buys a record,
              or chips in a few dollars, it directly funds the next song, the next music video,
              new photography, and the stories we’re building together.
            </p>
            <p>
              If these songs have kept you company, you can support the project below with any
              amount you choose—once, or month by month, in cash or in Bitcoin. Zero pressure,
              and endless gratitude either way.
            </p>
            <p className="font-sans text-[15px] font-semibold text-[var(--a-ink)]">
              — Semi <span className="text-[var(--a-accent-text)]">; - ]</span>
            </p>
          </div>

          {/* Two new editorial studio photographs */}
          <div className="grid gap-5 pt-4 sm:grid-cols-2">
            <figure className="space-y-2">
              <div className="overflow-hidden rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/photos/patron-studio-1.jpg"
                  alt="Semi writing lyrics in a linen notebook at a sunlit wooden desk in her West Nashville studio beside an acoustic guitar"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
              <figcaption className="font-serif italic text-[14px] text-[var(--a-muted)]">
                Afternoon notebooks and rough drafts at the desk.
              </figcaption>
            </figure>

            <figure className="space-y-2">
              <div className="overflow-hidden rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/photos/patron-studio-2.jpg"
                  alt="Semi tuning an acoustic guitar by a twilight window in a warm lamp-lit studio with a ceramic mug nearby"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
              <figcaption className="font-serif italic text-[14px] text-[var(--a-muted)]">
                Tuning up at dusk before the next session.
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Open Patronage Form */}
        <aside className="lg:col-span-5">
          <div
            data-testid="patron-form-card"
            className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-6 sm:p-8 shadow-[0_24px_60px_-24px_rgba(17,24,39,0.18)]"
          >
            <div className="flex items-center gap-2 text-[var(--a-accent-text)]">
              <Heart className="h-4 w-4" aria-hidden="true" />
              <span className="font-code text-[13px] font-semibold uppercase tracking-[0.18em]">
                Support Semi
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-[var(--a-ink)]">
              Choose your patronage
            </h2>
            <p className="mt-1 text-[14px] text-[var(--a-muted)]">
              Give any amount—once or monthly—in cash (card) or Bitcoin.
            </p>

            {/* One-time vs Monthly toggle */}
            <div
              role="group"
              aria-label="Donation frequency"
              className="mt-5 grid grid-cols-2 gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] p-1"
            >
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                data-testid="patron-freq-monthly"
                className={`min-h-[44px] rounded-full text-[14px] font-semibold transition-colors ${
                  frequency === 'monthly'
                    ? 'bg-[var(--a-ink)] text-[#FAF8F5]'
                    : 'text-[var(--a-ink)]/75 hover:text-[var(--a-ink)]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setFrequency('once')}
                data-testid="patron-freq-once"
                className={`min-h-[44px] rounded-full text-[14px] font-semibold transition-colors ${
                  frequency === 'once'
                    ? 'bg-[var(--a-ink)] text-[#FAF8F5]'
                    : 'text-[var(--a-ink)]/75 hover:text-[var(--a-ink)]'
                }`}
              >
                One-time
              </button>
            </div>

            <form onSubmit={handleStripeSupport} className="mt-5 space-y-4">
              {/* Preset amounts */}
              <div className="grid grid-cols-4 gap-2">
                {PRESETS.map((amt) => {
                  const active = Number(amountInput) === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountInput(String(amt))}
                      className={`min-h-[44px] rounded-xl border text-[15px] font-semibold transition-colors ${
                        active
                          ? 'border-[var(--a-accent-fill)] bg-[var(--a-accent-fill)] text-white'
                          : 'border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)] hover:border-[var(--a-ink)]'
                      }`}
                    >
                      ${amt}
                    </button>
                  );
                })}
              </div>

              {/* Custom amount */}
              <div className="space-y-1.5">
                <label
                  htmlFor="patron-amount-input"
                  className="block text-[14px] font-semibold text-[var(--a-ink)]"
                >
                  Amount (USD){frequency === 'monthly' ? ' / month' : ''}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-code text-[16px] text-[var(--a-muted)]">
                    $
                  </span>
                  <input
                    id="patron-amount-input"
                    type="number"
                    min={1}
                    max={10000}
                    step="any"
                    required
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    data-testid="patron-amount-input"
                    className="w-full min-h-[48px] rounded-xl border border-[var(--a-rule)] bg-[var(--a-well)] pl-8 pr-4 font-code text-[16px] text-[var(--a-ink)] focus:border-[var(--a-ink)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Optional email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="patron-email-input"
                  className="block text-[14px] font-semibold text-[var(--a-ink)]"
                >
                  Email (optional, for receipt)
                </label>
                <input
                  id="patron-email-input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-[48px] rounded-xl border border-[var(--a-rule)] bg-[var(--a-well)] px-4 text-[15px] text-[var(--a-ink)] focus:border-[var(--a-ink)] focus:outline-none"
                />
              </div>

              {/* Optional note */}
              <div className="space-y-1.5">
                <label
                  htmlFor="patron-note-input"
                  className="block text-[14px] font-semibold text-[var(--a-ink)]"
                >
                  Note for Semi (optional)
                </label>
                <textarea
                  id="patron-note-input"
                  rows={2}
                  maxLength={400}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Leave a word of encouragement or a song you loved…"
                  className="w-full rounded-xl border border-[var(--a-rule)] bg-[var(--a-well)] px-4 py-3 text-[15px] text-[var(--a-ink)] focus:border-[var(--a-ink)] focus:outline-none"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-900"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy !== null}
                data-testid="patron-stripe-btn"
                className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-6 text-[15px] font-semibold text-white transition-colors disabled:opacity-70"
              >
                {busy === 'stripe' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Opening Stripe…</span>
                  </>
                ) : (
                  <span>
                    Support with Card · ${validAmount ? parsedAmount.toFixed(2).replace(/\.00$/, '') : '—'}
                    {frequency === 'monthly' ? '/mo' : ''}
                  </span>
                )}
              </button>

              <button
                type="button"
                disabled={busy !== null}
                onClick={handleBitcoinSupport}
                data-testid="patron-bitcoin-btn"
                className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 rounded-full border border-[var(--a-ink)] bg-[var(--a-well)] hover:bg-[var(--a-ink)] hover:text-[#FAF8F5] px-6 text-[15px] font-semibold text-[var(--a-ink)] transition-colors disabled:opacity-70"
              >
                {busy === 'bitcoin' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Creating Lightning Invoice…</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" aria-hidden="true" />
                    <span>
                      Support with Bitcoin (Lightning · ${validAmount ? parsedAmount.toFixed(2).replace(/\.00$/, '') : '—'})
                    </span>
                  </>
                )}
              </button>

              {lnInvoice && (
                <div className="rounded-xl border border-[var(--a-rule)] bg-[var(--a-well)] p-4 space-y-2">
                  <p className="font-code text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                    Lightning Invoice (${lnAmountUsd})
                  </p>
                  <p className="break-all font-code text-[13px] text-[var(--a-ink)]/85 max-h-24 overflow-y-auto">
                    {lnInvoice}
                  </p>
                  <button
                    type="button"
                    onClick={copyInvoice}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] px-4 text-[14px] font-semibold text-[var(--a-ink)] hover:border-[var(--a-ink)] transition-colors"
                  >
                    {copiedLn ? (
                      <>
                        <Check className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                        <span>Invoice copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        <span>Copy Lightning invoice</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
