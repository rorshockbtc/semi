'use client';

import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, Download, ExternalLink, Lock, QrCode } from 'lucide-react';

export default function ListenQrClient() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passUrl, setPassUrl] = useState<string | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/listen-pass/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        passUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.passUrl) {
        setError(data.error || 'Access denied.');
        setBusy(false);
        return;
      }

      const [svg, png] = await Promise.all([
        QRCode.toString(data.passUrl, {
          type: 'svg',
          errorCorrectionLevel: 'H',
          margin: 2,
          color: { dark: '#111827', light: '#FAF8F5' },
        }),
        QRCode.toDataURL(data.passUrl, {
          width: 1024,
          errorCorrectionLevel: 'H',
          margin: 2,
          color: { dark: '#111827', light: '#FFFFFF' },
        }),
      ]);

      setPassUrl(data.passUrl);
      setSvgMarkup(svg);
      setPngDataUrl(png);
    } catch {
      setError('Could not generate QR code. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    if (!passUrl) return;
    try {
      await navigator.clipboard.writeText(passUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleDownloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'semi-listening-pass-qr.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    if (!pngDataUrl) return;
    const a = document.createElement('a');
    a.href = pngDataUrl;
    a.download = 'semi-listening-pass-qr-1024.png';
    a.click();
  };

  return (
    <section className="mx-auto max-w-[760px] px-5 sm:px-8 pt-28 pb-24 space-y-8">
      <div className="space-y-3">
        <p className="font-code text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--a-accent-text)]">
          Physical Distribution · Owner QR Generator
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[var(--a-ink)]">
          Stream-Only Listening Pass QR
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--a-ink)]/80">
          Generate the print-ready QR code for physical cards, inserts, and flyers. Listeners who
          scan it can stream Semi’s albums online with a simple language toggle (EN · ES · FR · RU).
          Their device ID is remembered automatically, downloads are disabled, and playback requires
          an internet connection.
        </p>
      </div>

      {!passUrl ? (
        <form
          onSubmit={handleUnlock}
          data-testid="listen-qr-gate-form"
          className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center gap-2.5 text-[var(--a-ink)]">
            <Lock className="h-5 w-5 text-[var(--a-accent-text)]" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold">Verify Owner Email</h2>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="owner-email"
              className="block font-code text-[13px] uppercase tracking-[0.12em] text-[var(--a-muted)]"
            >
              Owner email address
            </label>
            <input
              id="owner-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cubby@colonhyphenbracket.pink"
              data-testid="listen-qr-email-input"
              className="min-h-[48px] w-full rounded-xl border border-[var(--a-rule)] bg-[var(--a-well)] px-4 text-[16px] text-[var(--a-ink)] focus:border-[var(--a-ink)] focus:outline-none"
            />
          </div>

          {error && (
            <p
              role="alert"
              data-testid="listen-qr-error"
              className="text-[14px] font-semibold text-[var(--a-accent-text)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            data-testid="listen-qr-submit"
            className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-ink)] hover:bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-[var(--a-surface)] hover:text-white transition-colors disabled:opacity-60"
          >
            <QrCode className="h-4 w-4" aria-hidden="true" />
            <span>{busy ? 'Generating…' : 'Unlock Print-Ready QR Code'}</span>
          </button>
        </form>
      ) : (
        <div
          data-testid="listen-qr-ready"
          className="rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {svgMarkup && (
              <div
                data-testid="listen-qr-svg"
                className="w-[240px] h-[240px] shrink-0 rounded-2xl border border-[var(--a-rule)] bg-[#FAF8F5] p-3 overflow-hidden [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            )}

            <div className="space-y-4 min-w-0 flex-1">
              <div className="space-y-1">
                <p className="font-code text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                  Ready for Physical Print
                </p>
                <h2 className="font-display text-2xl font-bold text-[var(--a-ink)]">
                  Semi (; - ]) · Stream-Only Pass
                </h2>
              </div>

              <ul className="space-y-1.5 text-[14px] text-[var(--a-ink)]/85 list-disc pl-5">
                <li>Binds to listener’s device ID automatically on scan</li>
                <li>Stream-only online playback — zero MP3 downloads</li>
                <li>Requires active internet connection (no offline caching)</li>
                <li>Includes built-in EN · ES · FR · RU lyrics toggle</li>
              </ul>

              <div className="rounded-xl border border-[var(--a-rule)] bg-[var(--a-well)] px-3.5 py-2.5 font-code text-[13px] text-[var(--a-ink)] break-all">
                {passUrl}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2 border-t border-[var(--a-rule)]">
            <button
              type="button"
              onClick={handleDownloadSvg}
              data-testid="listen-qr-download-svg"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-ink)] hover:bg-[var(--a-accent-fill)] px-5 text-[14px] font-semibold text-[var(--a-surface)] hover:text-white transition-colors"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download Vector SVG</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              data-testid="listen-qr-download-png"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] hover:border-[var(--a-ink)] px-5 text-[14px] font-semibold text-[var(--a-ink)] transition-colors"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download PNG (1024px)</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full border border-[var(--a-rule)] hover:border-[var(--a-ink)] px-4 text-[14px] font-semibold text-[var(--a-ink)] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <a
              href={passUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--a-rule)] hover:border-[var(--a-ink)] px-4 text-[14px] font-semibold text-[var(--a-ink)] transition-colors"
            >
              <span>Test Pass</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
