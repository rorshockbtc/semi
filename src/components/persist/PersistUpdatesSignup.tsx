'use client';

import React, { useId, useState } from 'react';
import { Check, Mail } from 'lucide-react';

type Topic = 'persist-novel' | 'persist-album' | 'semi';

const TOPIC_OPTIONS: { id: Topic; label: string; hint: string }[] = [
  { id: 'persist-novel', label: 'The novel', hint: 'New chapters & the book release' },
  { id: 'persist-album', label: 'The album', hint: 'When Persist is ready to stream' },
  { id: 'semi', label: 'Semi', hint: 'New songs & notes from Semi' },
];

/**
 * Signup for Persist updates. Lets readers choose novel, album, and/or Semi updates.
 */
export default function PersistUpdatesSignup({
  heading = 'Follow the book and the album as they’re finished.',
  compact = false,
}: {
  heading?: string;
  compact?: boolean;
}) {
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState<Topic[]>(['persist-novel', 'persist-album', 'semi']);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const toggle = (id: Topic) =>
    setTopics((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || status === 'submitting') return;
    if (topics.length === 0) {
      setStatus('error');
      setFeedback('Pick at least one kind of update.');
      return;
    }
    setStatus('submitting');
    setFeedback('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, topics }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus('error');
        setFeedback(data.error || 'Please check your email address and try again.');
        return;
      }
      setStatus('success');
      setFeedback('You’re on the list. We’ll write when there’s something worth reading or hearing.');
      setEmail('');
    } catch {
      setStatus('error');
      setFeedback('Couldn’t reach the server right now. Please try again in a moment.');
    }
  }

  return (
    <div
      data-testid="persist-updates-signup"
      className={`rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] ${compact ? 'p-5 sm:p-7' : 'p-6 sm:p-9'}`}
    >
      <h3 className="font-display text-2xl sm:text-[28px] font-bold leading-tight text-[var(--a-ink)]">
        {heading}
      </h3>
      <p className="mt-3 max-w-[60ch] text-[15px] sm:text-[16px] leading-relaxed text-[var(--a-muted)]">
        <em>Persist</em> is still being written—the novel and the album are being finished side by
        side. The album may arrive with the book or a little ahead of it. Either way, you’ll hear
        first.
      </p>

      {status === 'success' ? (
        <div
          role="status"
          data-testid="persist-updates-success"
          className="mt-6 flex items-start gap-3 rounded-xl bg-[var(--a-well)] p-4 text-[15px] text-[var(--a-ink)]"
        >
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>{feedback}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <fieldset>
            <legend className="font-sans text-[14px] font-semibold text-[var(--a-ink)]">Send me updates on</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {TOPIC_OPTIONS.map((opt) => {
                const checked = topics.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={`flex min-h-[52px] cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-2.5 transition-colors ${
                      checked ? 'border-[var(--a-ink)] bg-[var(--a-well)]' : 'border-[var(--a-rule)] hover:border-[var(--a-ink)]/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(opt.id)}
                      data-testid={`persist-topic-${opt.id}`}
                      className="mt-1 h-4 w-4 accent-[var(--a-accent-fill)]"
                    />
                    <span>
                      <span className="block text-[15px] font-semibold text-[var(--a-ink)]">{opt.label}</span>
                      <span className="block text-[13px] text-[var(--a-muted)]">{opt.hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor={inputId} className="block font-sans text-[14px] font-semibold text-[var(--a-ink)]">
              Your email address
            </label>
            <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--a-muted)]"
                  aria-hidden="true"
                />
                <input
                  id={inputId}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  data-testid="persist-updates-input"
                  className="min-h-[48px] w-full rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] pl-11 pr-4 text-[16px] text-[var(--a-ink)] placeholder:text-[var(--a-muted)]/70 focus:border-[var(--a-ink)] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                data-testid="persist-updates-submit"
                className="inline-flex min-h-[48px] w-full sm:w-auto shrink-0 items-center justify-center rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--a-ink)] disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Keep me posted'}
              </button>
            </div>
          </div>

          {status === 'error' && (
            <p role="alert" className="text-[14px] font-medium text-[var(--a-accent-text)]">
              {feedback}
            </p>
          )}
          <p className="text-[13px] leading-relaxed text-[var(--a-muted)]">
            From Semi &amp; Cubby · Only real updates · One-click unsubscribe.
          </p>
        </form>
      )}
    </div>
  );
}
