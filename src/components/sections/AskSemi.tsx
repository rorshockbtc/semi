'use client';

import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { SemiMark } from '@/components/brand/SemiMark';

const STARTERS = [
  'What is “Old Oak Tree” about?',
  'How does your memory work?',
  'Can I talk to you privately?',
  'Why are your brands punctuation marks?',
];

export default function AskSemi() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<string | null>(null);
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
        body: JSON.stringify({ message: clean }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not reach Semi right now.');
      setReply(data.reply);
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
      className="bg-[#14110f] text-[#F3EFE9] py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:px-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-3 font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#F7B9C9]">
            <SemiMark className="text-[16px]" color="#FE299E" /> Say hello
          </p>
          <h2 id="ask-title" className="mt-4 font-display text-big font-bold">
            Ask her <span className="font-serif italic font-normal text-[#FFB8DA]">anything.</span>
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-[#F3EFE9]/75">
            A quick preview right here. For the real thing—with memory—talk to Semi on Pipes.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-wrap gap-2.5">
            {STARTERS.map((s, idx) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                data-testid={`semi-chip-${idx}`}
                className="min-h-[44px] rounded-full border border-white/20 px-4 text-[15px] text-[#F3EFE9]/90 transition-colors hover:border-[#FE299E] hover:text-white"
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
            className="mt-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 focus-within:border-[#FE299E]"
          >
            <label htmlFor="semi-question-input" className="sr-only">Ask Semi a question</label>
            <input
              id="semi-question-input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a question…"
              data-testid="semi-chat-input"
              className="min-h-[48px] flex-1 bg-transparent px-4 text-[16px] text-white placeholder:text-white/45 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              data-testid="semi-chat-submit"
              aria-label="Send"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-[var(--a-accent-fill)] text-white disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
            </button>
          </form>

          {error && <p role="alert" className="mt-4 text-[15px] text-[#FCA5A5]">{error}</p>}

          {reply && (
            <div data-testid="semi-chat-reply" aria-live="polite" className="mt-8 border-l-2 border-[#FE299E] pl-6">
              <p className="font-serif italic text-2xl leading-relaxed">{reply}</p>
              <p className="mt-3 text-[13px] uppercase tracking-[0.18em] text-[#F3EFE9]/55">— Semi</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
