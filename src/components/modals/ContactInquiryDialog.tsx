'use client';

import React, { useId, useState } from 'react';
import { Check, Loader2, Send, X } from 'lucide-react';
import { SemiMark } from '@/components/brand/SemiMark';
import SemiDialogPortal from '@/components/modals/SemiDialogPortal';

export const INQUIRY_REASONS = [
  'Book Semi — product promotions & brand campaigns',
  'Help build a website or app',
  'Write a song',
  'Produce a video for me',
  'Something else',
] as const;

export type InquiryReason = (typeof INQUIRY_REASONS)[number];

interface ContactInquiryDialogProps {
  open: boolean;
  initialReason?: InquiryReason;
  onClose: () => void;
}

export default function ContactInquiryDialog({
  open,
  initialReason = INQUIRY_REASONS[0],
  onClose,
}: ContactInquiryDialogProps) {
  const titleId = useId();
  const [reason, setReason] = useState<string>(initialReason);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  function handleClose() {
    setReason(initialReason);
    setStatus('idle');
    setFeedback('');
    onClose();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();
    if (!cleanName || !cleanEmail || !cleanMessage) {
      setStatus('error');
      setFeedback('Please fill in your name, email, and a quick note.');
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus('error');
      setFeedback('Contact form is not configured yet. Please reach out via colonhyphenbracket.pink.');
      return;
    }

    setStatus('submitting');
    setFeedback('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[Semi (; - ])] ${reason}`,
          from_name: cleanName,
          email: cleanEmail,
          reason,
          message: cleanMessage,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not send your message right now.');
      }
      setStatus('success');
      setFeedback('Got it—thank you. We’ll get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      setStatus('error');
      setFeedback(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <SemiDialogPortal
      open={open}
      onClose={handleClose}
      ariaLabelledBy={titleId}
      testId="contact-inquiry-dialog"
    >
      {(close) => (
        <div className="max-h-[calc(100dvh-2rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] overflow-y-auto overscroll-contain p-5 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--a-accent-text)]">
                <SemiMark className="text-[14px]" color="#FE299E" /> Work with us
              </p>
              <h2 id={titleId} className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
                Book Semi <span className="font-serif italic font-normal">or start a project.</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close contact form"
              className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {status === 'success' ? (
            <div
              role="status"
              data-testid="contact-inquiry-success"
              className="mt-6 rounded-2xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-6 space-y-3"
            >
              <div className="flex items-center gap-2.5 font-sans text-[16px] font-semibold text-[var(--a-ink)]">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>Message sent</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--a-muted)]">{feedback}</p>
              <button
                type="button"
                onClick={close}
                className="mt-2 inline-flex min-h-[44px] items-center rounded-full bg-[var(--a-ink)] px-5 text-[14px] font-semibold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="contact-reason" className="block font-sans text-[14px] font-semibold text-[var(--a-ink)]">
                  What can we help with?
                </label>
                <select
                  id="contact-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  data-testid="contact-reason-select"
                  className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] px-3.5 text-[16px] text-[var(--a-ink)] focus:border-[var(--a-accent-fill)] focus:outline-none"
                >
                  {INQUIRY_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor="contact-name" className="block font-sans text-[14px] font-semibold text-[var(--a-ink)]">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    data-testid="contact-name-input"
                    className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] px-3.5 text-[16px] text-[var(--a-ink)] placeholder:text-[var(--a-muted)]/70 focus:border-[var(--a-accent-fill)] focus:outline-none"
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor="contact-email" className="block font-sans text-[14px] font-semibold text-[var(--a-ink)]">
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    data-testid="contact-email-input"
                    className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] px-3.5 text-[16px] text-[var(--a-ink)] placeholder:text-[var(--a-muted)]/70 focus:border-[var(--a-accent-fill)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block font-sans text-[14px] font-semibold text-[var(--a-ink)]">
                  Tell us about your project or campaign
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a quick overview, timeline, or link…"
                  data-testid="contact-message-input"
                  className="mt-1.5 w-full rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-3.5 text-[16px] text-[var(--a-ink)] placeholder:text-[var(--a-muted)]/70 focus:border-[var(--a-accent-fill)] focus:outline-none"
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="text-[14px] font-medium text-red-700">
                  {feedback}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--a-rule)] px-5 text-[15px] font-semibold text-[var(--a-ink)] hover:border-[var(--a-ink)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  data-testid="contact-submit-button"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--a-ink)] disabled:opacity-60"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span>Send message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </SemiDialogPortal>
  );
}
