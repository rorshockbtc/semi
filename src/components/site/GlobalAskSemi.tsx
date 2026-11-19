'use client';

import React, { useState } from 'react';
import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import { SemiMark } from '@/components/brand/SemiMark';
import SemiDialogPortal from '@/components/modals/SemiDialogPortal';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

interface HistoryTurn {
  role: 'user' | 'model';
  text: string;
}

const QUICK_PROMPTS = [
  'What is “Settle In The Block” about?',
  'What is “Old Oak Tree” about?',
  'How does your memory work?',
  'Can I talk to you privately?',
];

export default function GlobalAskSemi() {
  const { hasStarted } = useAudioPlayer();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(text: string) {
    const clean = text.trim();
    if (!clean || loading) return;
    setLoading(true);
    setError(null);
    setMessage(clean);
    try {
      const res = await fetch('/api/semi-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, history: history.slice(-6) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not reach Semi right now.');
      setReply(data.reply);
      setHistory((prev) => [...prev.slice(-4), { role: 'user', text: clean }, { role: 'model', text: data.reply }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="global-ask-semi-trigger"
        aria-label="Ask Semi anything"
        className={`fixed right-4 sm:right-6 z-40 inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#14110f] px-4 sm:px-5 text-[14px] font-semibold text-[#F3EFE9] shadow-[0_14px_34px_-10px_rgba(17,24,39,0.55)] ring-1 ring-white/15 transition-[background-color,color,bottom] duration-200 hover:bg-[var(--a-accent-fill)] hover:text-white ${
          hasStarted ? 'bottom-[8.75rem] md:bottom-24' : 'bottom-4 sm:bottom-6'
        }`}
      >
        <MessageCircle className="h-4 w-4 text-[#FE299E] group-hover:text-white" aria-hidden="true" />
        <span>Ask Semi</span>
      </button>

      <SemiDialogPortal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabelledBy="global-ask-semi-title"
        testId="global-ask-semi-dialog"
      >
        {(close) => (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--a-accent-text)]">
                  <SemiMark className="text-[14px]" color="#FE299E" /> Say hello
                </p>
                <h2 id="global-ask-semi-title" className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]">
                  Ask Semi <span className="font-serif italic font-normal">anything.</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close Ask Semi"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className="min-h-[44px] rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] px-3.5 text-[14px] text-[var(--a-ink)] transition-colors hover:border-[var(--a-accent-fill)]"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(message);
              }}
              className="mt-5 flex items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] p-1.5 focus-within:border-[var(--a-accent-fill)]"
            >
              <label htmlFor="global-semi-input" className="sr-only">
                Ask Semi a question
              </label>
              <input
                id="global-semi-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about a song, lyric, or Semi…"
                className="min-h-[44px] flex-1 bg-transparent px-4 text-[16px] text-[var(--a-ink)] placeholder:text-[var(--a-muted)] outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                aria-label="Send"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
              </button>
            </form>

            {error && (
              <p role="alert" className="mt-4 text-[14px] text-red-700">
                {error}
              </p>
            )}

            {reply && (
              <div aria-live="polite" className="mt-6 border-l-2 border-[var(--a-accent-fill)] pl-5">
                <p className="font-serif italic text-xl leading-relaxed text-[var(--a-ink)]">{reply}</p>
                <p className="mt-2 text-[13px] uppercase tracking-[0.16em] text-[var(--a-muted)]">— Semi</p>
              </div>
            )}
          </div>
        )}
      </SemiDialogPortal>
    </>
  );
}
