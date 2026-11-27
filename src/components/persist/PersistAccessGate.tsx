'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import type { PersistAccess } from '@/components/persist/usePersistAccess';

/** Email → 6-digit code OR direct promo/listener code gate. Validates I/O Deluxe ownership. */
export default function PersistAccessGate({
  access,
  compact = false,
}: {
  access: PersistAccess;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<'code' | 'email'>('code');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const clean = email.trim().toLowerCase();
    if (!clean.includes('@')) {
      setError('Enter the email you used for the I/O Deluxe Edition.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/album/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        directUnlock?: boolean;
        token?: string;
        email?: string;
        emailUnavailable?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        if (data.emailUnavailable) {
          setMode('code');
        }
        setError(data.error || 'We couldn’t find an I/O Deluxe unlock for that email yet.');
      } else if (data.directUnlock && data.token) {
        access.grant(data.token, data.email ?? clean);
      } else {
        setCodeSent(true);
        setMessage(data.message || 'Check your inbox for a 6-digit code.');
      }
    } catch {
      setError('Couldn’t reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const clean = email.trim().toLowerCase();
    if (code.trim().length < 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/album/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, code: code.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; token?: string; email?: string; error?: string };
      if (!res.ok || !data.ok || !data.token) {
        setError(data.error || 'That code didn’t match or has expired.');
      } else {
        access.grant(data.token, data.email ?? clean);
      }
    } catch {
      setError('Couldn’t verify right now. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const redeemPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const clean = email.trim().toLowerCase();
    const cleanPromo = promoCode.trim();
    if (!clean.includes('@')) {
      setError('Enter your email address so we can save your listening pass.');
      return;
    }
    if (!cleanPromo) {
      setError('Enter your access or promo code.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/album/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, promoCode: cleanPromo }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        unlocked?: boolean;
        token?: string;
        email?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.token) {
        setError(data.error || 'That code wasn’t recognized. Please double-check and try again.');
      } else {
        access.grant(data.token, data.email ?? clean);
      }
    } catch {
      setError('Couldn’t verify right now. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    'min-h-[48px] w-full flex-1 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-5 text-[16px] text-[var(--a-ink)] placeholder:text-[var(--a-muted)] focus:border-[var(--a-ink)] focus:outline-none';
  const btnCls =
    'min-h-[48px] inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--a-ink)] disabled:opacity-60';

  return (
    <div
      data-testid="persist-deluxe-gate"
      className={`rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-9'}`}
    >
      <div className={compact ? 'space-y-4' : 'grid gap-8 lg:grid-cols-12 lg:items-center'}>
        <div className={compact ? 'space-y-2' : 'lg:col-span-6 space-y-3'}>
          <p className="inline-flex items-center gap-2 font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
            <Lock className="h-4 w-4" aria-hidden="true" /> Deluxe Early Access
          </p>
          <h2 className={`font-display font-bold text-[var(--a-ink)] ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
            Preview Persist with the I/O Deluxe Edition.
          </h2>
          <p className="text-[15px] leading-relaxed text-[var(--a-muted)] max-w-[56ch]">
            You have to buy the <strong className="text-[var(--a-ink)]">I/O Deluxe Edition</strong>{' '}
            to get the preview. The full album will launch and stream sometime in the coming months
            and is being written and published early for fans of the first album.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="/songs#deluxe-edition"
              className="wc-link inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[var(--a-ink)]"
            >
              Get the I/O Deluxe Edition →
            </Link>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'email' ? 'code' : 'email');
                setError(null);
                setMessage(null);
              }}
              className="min-h-[44px] text-[14px] font-semibold text-[var(--a-accent-text)] underline underline-offset-4 hover:text-[var(--a-ink)]"
            >
              {mode === 'email' ? 'Have a promo or listener code?' : 'Use I/O Deluxe email instead'}
            </button>
          </div>
        </div>

        <div className={compact ? '' : 'lg:col-span-6'}>
          {mode === 'code' ? (
            <form onSubmit={redeemPromo} className="space-y-3">
              <label htmlFor="persist-promo-email" className="block text-[14px] font-semibold text-[var(--a-ink)]">
                Unlock directly with your email &amp; access code
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="persist-promo-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
                <input
                  id="persist-promo-code"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Access code"
                  className={inputCls}
                />
                <button type="submit" disabled={busy} className={btnCls}>
                  <KeyRound className="h-4 w-4" aria-hidden="true" />
                  {busy ? 'Unlocking…' : 'Unlock'}
                </button>
              </div>
            </form>
          ) : !codeSent ? (
            <form onSubmit={requestCode} className="space-y-3">
              <label htmlFor="persist-email" className="block text-[14px] font-semibold text-[var(--a-ink)]">
                Your I/O Deluxe email
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="persist-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
                <button type="submit" disabled={busy} className={btnCls}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {busy ? 'Checking…' : 'Send code'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-3">
              <label htmlFor="persist-code" className="block text-[14px] font-semibold text-[var(--a-ink)]">
                6-digit code sent to {email}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="persist-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className={`${inputCls} font-code tracking-[0.3em]`}
                />
                <button type="submit" disabled={busy} className={btnCls}>
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  {busy ? 'Verifying…' : 'Start listening'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCodeSent(false);
                  setCode('');
                }}
                className="min-h-[44px] text-[14px] font-medium text-[var(--a-muted)] underline underline-offset-4 hover:text-[var(--a-ink)]"
              >
                Use a different email
              </button>
            </form>
          )}
          {message && (
            <p role="status" className="mt-3 text-[14px] text-[var(--a-ink)]">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-3 text-[14px] font-medium text-[var(--a-accent-text)]">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
