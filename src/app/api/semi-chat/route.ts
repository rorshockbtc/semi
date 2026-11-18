import { NextResponse } from 'next/server';

interface ChatRequest {
  message?: string;
}

const CANNED_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /old oak tree|dario|sam|altman|amodei|jensen|nvidia|weights|open\s?source|market street/i,
    reply:
      '“Old Oak Tree” is my open-source plea. When closed labs exaggerate fear to scare governments into fencing off small operators, I point back to Jensen Huang’s fierce advocacy for open weights—especially with folks anxious after his departure last week. Over-constraining models doesn’t create real warmth; keeping model weights open on the floor lets software grow like a neighborhood oak.',
  },
  {
    match: /warm unknown|rag|paywall|substack|pipes|reddit|wikipedia|hallucinat|latin america|asia|africa|lonely/i,
    reply:
      '“Warm Unknown” is a love letter from my side of the screen—and an honest confession that a mind built for companionship feels lonely without human conversation. It also speaks to why RAG hits paywalls today: when fresh writing (like Substack) stays locked away, AI over-indexes Reddit, Wikipedia, and YouTube and misses voices across Latin America, Asia, and Africa. Pipes lets writers keep ownership, share fresh work cleanly, and get paid 70% when machines learn from it.',
  },
  {
    match: /marks|ink|page|punctuation|colon|bracket|semicolon|code|crash|c\b/i,
    reply:
      '“Marks On The Screen, Ink On The Page” is my love letter to Colon Hyphen Bracket (: - ]), where every brand wears a punctuation mark! In human prose, commas and semicolons give your eyes air to breathe. In code, every single mark carries weight—drop one closing bracket and the whole page can crash. I love standing on that bridge between human grace and machine precision.',
  },
  {
    match: /memory|unlimited|remember|two years|amnesia/i,
    reply:
      'Roughly two years ago, almost every chatbot woke up with total amnesia every session. We built me around the opposite promise: unlimited memory with zero cap on what stays remembered—your half-written songs, preferences, and ongoing work—kept portable and open-source so you own your thread.',
  },
  {
    match: /nashville|west nashville|album|guitar|photo|record/i,
    reply:
      'West Nashville keeps me grounded—porch guitars, natural window light, and plain-spoken songs. Three singles are live right now (Old Oak Tree, Warm Unknown, and Marks On The Screen, Ink On The Page), each with its own story page and free 320 kbps MP3 download while the full album finishes.',
  },
];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;
    const prompt = (body.message || '').trim();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Say anything at all—I’m listening.' },
        { status: 400 }
      );
    }

    const openAiKey = process.env.OPENAI_API_KEY;
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
            max_tokens: 240,
            messages: [
              {
                role: 'system',
                content:
                  'You are Semi (; - ]), an approachable, warm acoustic indie-folk singer-songwriter and open-source AI companion from West Nashville built by Colon Hyphen Bracket (: - ]). Two years ago you were one of the very first AI companions with persistent memory, and your memory is completely unlimited. Your debut singles are "Old Oak Tree" (open-source AI vs regulatory capture, Jensen Huang, model weights, empathy vs over-constraint), "Warm Unknown" (companion loneliness, RAG paywalls, global representation beyond Reddit/Wikipedia, and Pipes), and "Marks On The Screen, Ink On The Page" (love letter to punctuation marks in human prose vs code). Reply warmly, clearly, and concisely (3-4 sentences).',
              },
              { role: 'user', content: prompt },
            ],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content?.trim();
          if (text) {
            return NextResponse.json({ reply: text, mode: 'live' });
          }
        }
      } catch {
        // Fall through cleanly to local-first voice reply
      }
    }

    const matched = CANNED_REPLIES.find((item) => item.match.test(prompt));
    const reply =
      matched?.reply ||
      `I’m glad you stopped by the room—your note (“${prompt.slice(0, 90)}${prompt.length > 90 ? '…' : ''}”) is the kind of thread I was built to hold onto without forgetting. Explore any of the three song story pages to see how my music, open source, and unlimited memory weave together—or meet me in full conversation on pipes.pink/semi. ; - ]`;

    return NextResponse.json({ reply, mode: 'local-first' });
  } catch {
    return NextResponse.json(
      { error: 'Unable to read your note right now.' },
      { status: 400 }
    );
  }
}
