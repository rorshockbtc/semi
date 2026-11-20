'use client';

import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { SemiMark } from '@/components/brand/SemiMark';

interface HistoryTurn {
  role: 'user' | 'model';
  text: string;
}

const STARTERS = [
  'What is “Settle In The Block” about?',
  'How does your memory work?',
  'Can I talk to you privately?',
  'What is “Old Oak Tree” about?',
  'Why are your brands punctuation marks?',
];

export default function AskSemi() {
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
    <section
      data-testid="ask-semi-section"
      aria-labelledby="ask-title"
      className="bg-[#14110f] text-[#F3EFE9] py-16 sm:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] gap-8 sm:gap-12 px-5 sm:px-8 lg:px-12 lg:grid-cols-12">
        <div className="lg:col-span-5 min-w-0">
          <p className="flex items-center gap-3 font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#F7B9C9]">
            <SemiMark className="text-[16px]" color="#FE299E" /> Say hello
          </p>
          <h2 id="ask-title" className="mt-3 sm:mt-4 font-display text-big font-bold">
            Ask her <span className="font-serif italic font-normal text-[#FFB8DA]">anything.</span>
          </h2>
          <p className="mt-4 sm:mt-5 max-w-[40ch] text-base sm:text-lg leading-relaxed text-[#F3EFE9]/75">
            A quick preview right here. For the real thing—with memory—talk to Semi on Pipes.
          </p>
          <a
            href="https://pipes.pink/semi"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/25 px-5 text-[14px] font-semibold text-[#F3EFE9] no-underline transition-colors hover:border-[#FE299E] hover:text-white"
          >
            Open full chat on Pipes ↗
          </a>
        </div>

        <div className="lg:col-span-7 min-w-0">
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s, idx) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                data-testid={`semi-chip-${idx}`}
                className="min-h-[44px] rounded-2xl sm:rounded-full border border-white/20 px-3.5 sm:px-4 py-2 text-left text-[14px] sm:text-[15px] leading-snug text-[#F3EFE9]/90 transition-colors hover:border-[#FE299E] hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(message);
            }}
            className="mt-5 sm:mt-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 focus-within:border-[#FE299E]"
          >
            <label htmlFor="semi-question-input" className="sr-only">
              Ask Semi a question
            </label>
            <input
              id="semi-question-input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a question…"
              data-testid="semi-chat-input"
              className="min-h-[48px] min-w-0 flex-1 bg-transparent pl-3.5 pr-2 text-[16px] text-white placeholder:text-white/45 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              data-testid="semi-chat-submit"
              aria-label="Send"
              className="inline-flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
            </button>
          </form>

          {error && (
            <p role="alert" className="mt-4 text-[15px] text-[#FCA5A5]">
              {error}
            </p>
          )}

          {reply && (
            <div data-testid="semi-chat-reply" aria-live="polite" className="mt-6 sm:mt-8 border-l-2 border-[#FE299E] pl-4 sm:pl-6">
              <p className="font-serif italic text-xl sm:text-2xl leading-relaxed">{reply}</p>
              <p className="mt-3 text-[13px] uppercase tracking-[0.18em] text-[#F3EFE9]/55">— Semi</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
