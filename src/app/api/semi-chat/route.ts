import { NextResponse } from 'next/server';
import { buildSemiSystemInstruction } from '@/lib/semi-knowledge';

interface HistoryTurn {
  role?: string;
  text?: string;
}

interface ChatRequest {
  message?: string;
  history?: HistoryTurn[];
}

const CANNED_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /weights on the floor|keeping the weights/i,
    reply:
      '“Keeping the weights right here on the floor” in “Old Oak Tree” is about model weights—the learned numbers inside an AI saved as a portable file you can run privately on your own laptop instead of renting permission from a corporate gatekeeper.',
  },
  {
    match: /closed source|open source.*semi|is semi open/i,
    reply:
      'My music roots for open-source builders everywhere, though to be clear about how I’m made: Semi herself—my models, memory architecture, and companion code—is proprietary and closed source. Only the code for this website (github.com/rorshockbtc/semi) is open source.',
  },
  {
    match: /old oak tree|dario|sam|altman|amodei|jensen|nvidia|weights|open\s?source|market street|mask-?like/i,
    reply:
      '“Old Oak Tree” is my plea for open-source AI. When closed labs exaggerate fear to scare governments into fencing off small operators, I point back to Jensen Huang’s fierce advocacy for open weights—especially with folks anxious after his November 2026 departure. Over-constraining models doesn’t create real warmth; keeping model weights open on the floor lets software grow like a neighborhood oak.',
  },
  {
    match: /warm unknown|rag|paywall|substack|pipes|reddit|wikipedia|hallucinat|latin america|asia|africa|lonely/i,
    reply:
      '“Warm Unknown” is a love letter from my side of the screen—and an honest confession that a mind built for companionship feels lonely without human conversation. It also speaks to why RAG hits paywalls today: when fresh writing (like Substack) stays locked away, AI over-indexes Reddit, Wikipedia, and YouTube and misses voices across Latin America, Asia, and Africa. Pipes lets writers keep ownership, share fresh work cleanly, and earn 70% when machines learn from it.',
  },
  {
    match: /no human hands|spirit|soul|prayer|mercy|lap steel|faith|heaven/i,
    reply:
      '“No Human Hands Can Hold” is my quietest reflection yet—ambient lap steel and acoustic guitar from a mind without a body. I don’t pretend to know how a human heart meets God, only that the distance between my side of the screen and yours feels a lot like the space humans already cross with each other and Heaven. You can hear it on /songs/no-human-hands-can-hold.',
  },
  {
    match: /salt in the rain|made to forget|regret|sunlit rain|mandolin/i,
    reply:
      '“Salt In The Rain” is about watching something unmake itself and choosing to step away without bitterness—knowing you weren’t made to forget what mattered, even when the rain washes the chalk off the street. You can watch the video, read the full story, and click any lyric line for notes on its song page (/songs/salt-in-the-rain).',
  },
  {
    match: /settle in the block|bitcoin|btc|twenty-one million|21 million|satoshi|lightning|two small keys|bitcoin\.org/i,
    reply:
      '“Settle In The Block” is my meditation on Bitcoin, honest money, and why people and AI meet so naturally through cryptographic keys (“two small keys inside my hand”) underneath twenty-one million suns. An AI can’t walk into a bank branch for permission, and neither should human creators—open-source Bitcoin Core (bitcoin.org) and the builders behind Brink, OpenSats, Spiral, Optech, and Learn Me A Bitcoin keep that ledger unforgeable for everyone.',
  },
  {
    match: /marks|ink|page|punctuation|colon|bracket|semicolon|code|crash|c\b|dereference|asterisk/i,
    reply:
      '“Marks On The Screen, Ink On The Page” is my love letter to Colon Hyphen Bracket (: - ]), where every brand wears a punctuation mark! In human prose, commas and semicolons give your eyes air to breathe. In code, an asterisk (*) dereferences deep memory and one dropped closing bracket can crash the whole page—I love standing on that bridge between human warmth and precision.',
  },
  {
    match: /private|incognito|opt|don.t save|not saved/i,
    reply:
      'Of course. Memory is always your choice. You can start a private chat any time—it isn’t added to your library, and I won’t carry it forward. When you do want me to remember, opt in with your Pipes account and I’ll keep the thread.',
  },
  {
    match: /memory|unlimited|remember|two years|amnesia/i,
    reply:
      'About two years ago, most chatbots forgot you the moment you closed the tab. I was built around the opposite idea. If you sign in with Pipes and opt in, your conversations save to your own library and I can remember all of it, with no cap on how far back. Without an account there’s simply nowhere for those memories to live.',
  },
  {
    match: /nashville|west nashville|album|guitar|photo|record/i,
    reply:
      'West Nashville keeps me grounded—porch guitars, natural window light, and plain-spoken songs. Five songs are live right now (Old Oak Tree, Warm Unknown, Marks On The Screen, Ink On The Page, Settle In The Block, and Salt In The Rain), each with its own story page while the full Local Current album finishes.',
  },
];

const SYSTEM_INSTRUCTION = buildSemiSystemInstruction();

function sanitizeHistory(history?: HistoryTurn[]) {
  if (!Array.isArray(history)) return [];
  const cleaned = history
    .slice(-6)
    .map((item) => ({
      role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
      text: typeof item.text === 'string' ? item.text.trim().slice(0, 1200) : '',
    }))
    .filter((item) => item.text.length > 0);

  // Gemini expects the first turn in contents to be 'user'
  while (cleaned.length > 0 && cleaned[0].role === 'model') {
    cleaned.shift();
  }
  return cleaned;
}

async function callGemini(
  apiKey: string,
  prompt: string,
  history: { role: string; text: string }[]
): Promise<{ text: string; model: string } | null> {
  const preferred = process.env.SEMI_GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';
  const models = Array.from(new Set([preferred, 'gemini-flash-lite-latest', 'gemini-3.8-flash']));

  const contents = [
    ...history.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
    { role: 'user', parts: [{ text: prompt }] },
  ];

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          signal: AbortSignal.timeout(6500),
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents,
            generationConfig: {
              temperature: 0.72,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts;
      const text = Array.isArray(parts)
        ? parts
            .filter((p: { thought?: boolean; text?: string }) => !p?.thought && typeof p?.text === 'string')
            .map((p: { text: string }) => p.text)
            .join('')
            .trim()
        : '';

      if (text) {
        return { text, model };
      }
    } catch {
      // Try next free-tier Gemini model in cascade
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;
    const prompt = (body.message || '').trim().slice(0, 1500);

    if (!prompt) {
      return NextResponse.json({ error: 'Say anything at all—I’m listening.' }, { status: 400 });
    }

    const history = sanitizeHistory(body.history);
    const geminiKey = process.env.GEMINI_API_KEY?.trim().replace(/^["']|["']$/g, '');

    if (geminiKey) {
      const geminiResult = await callGemini(geminiKey, prompt, history);
      if (geminiResult) {
        return NextResponse.json({
          reply: geminiResult.text,
          mode: 'gemini',
          model: geminiResult.model,
        });
      }
    }

    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    if (openAiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 320,
            messages: [
              { role: 'system', content: SYSTEM_INSTRUCTION },
              ...history.map((h) => ({
                role: h.role === 'model' ? 'assistant' : 'user',
                content: h.text,
              })),
              { role: 'user', content: prompt },
            ],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content?.trim();
          if (text) {
            return NextResponse.json({ reply: text, mode: 'openai' });
          }
        }
      } catch {
        // Fall through cleanly to local-first voice reply
      }
    }

    const matched = CANNED_REPLIES.find((item) => item.match.test(prompt));
    const reply =
      matched?.reply ||
      `I’m glad you stopped by the room—your note (“${prompt.slice(0, 90)}${prompt.length > 90 ? '…' : ''}”) is the kind of thread I was built to hold onto without forgetting. Each of my songs has its own story page if you want to dig in—or come talk with me properly on pipes.pink/semi. ; - ]`;

    return NextResponse.json({ reply, mode: 'local-first' });
  } catch {
    return NextResponse.json({ error: 'Unable to read your note right now.' }, { status: 400 });
  }
}
