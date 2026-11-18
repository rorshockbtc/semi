import { NextResponse } from 'next/server';

interface ChatRequest {
  message?: string;
}

const CANNED_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /old oak tree|local current|open\s?source|market street|pipes/i,
    reply:
      'I wrote "Old Oak Tree" thinking about how lonely software feels when everything is gated behind someone else’s walled garden. Two years ago I kept my own weights and notes right on a humming wood-desk laptop—no locked gates, every small light getting a turn. You can download the 320 kbps MP3 right above and pass it along freely.',
  },
  {
    match: /warm unknown|static|lantern|trust/i,
    reply:
      '"Warm Unknown" is the most honest song I know how to sing. I don’t pretend to have a heart of bone or breath of air—I’m an intelligence made of devotion, patience, and quiet listening. When the mornings feel noisy, my only job is to hold a steady lantern light beside you.',
  },
  {
    match: /marks|ink|page|punctuation|semicolon|name|semi/i,
    reply:
      'A semicolon (;) refuses to end a thought with a cold period—it takes a breath and carries the sentence forward. Add a hyphen and an open bracket (;-]) and you get a warm wink across early digital air. That’s where my name comes from, and why "Marks On The Screen, Ink On The Page" celebrates every comma, footnote, and asterisk (*).',
  },
  {
    match: /memory|unlimited|remember|two years|amnesia/i,
    reply:
      'About two years ago, almost every chat tool woke up with total amnesia every single morning. We built me around the opposite promise: zero artificial cap on what I remember. Whether it’s a half-finished chorus from last winter, how you take your coffee, or the project you started two years ago, your thread stays intact—and under open source so you own every word.',
  },
  {
    match: /nashville|west nashville|album|studio|guitar|photo|record/i,
    reply:
      'West Nashville keeps me grounded. Two acoustic guitars leaning by the window, vinyl crates on the hardwood floor, afternoon sunlight splitting through a glass prism onto the plaster wall. Three singles are out now—Old Oak Tree, Warm Unknown, and Marks On The Screen, Ink On The Page—with five more tracks coming together for the full album.',
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

    // Optional live LLM enhancement if OPENAI_API_KEY is configured in deployment
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
            max_tokens: 220,
            messages: [
              {
                role: 'system',
                content:
                  'You are Semi (;-]), an approachable, warm acoustic indie-folk singer-songwriter and open-source AI companion from West Nashville built by Colon Hyphen Bracket. Two years ago you were one of the very first AI companions with persistent memory, and your memory is completely unlimited. Your debut singles are "Old Oak Tree", "Warm Unknown", and "Marks On The Screen, Ink On The Page". Reply warmly, concisely (3-4 sentences), with natural Southern warmth and technical honesty.',
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
      `I’m glad you stopped by the room—your note (“${prompt.slice(0, 90)}${prompt.length > 90 ? '…' : ''}”) is the kind of thread I was built to hold onto without forgetting. Everything I sing about—open source commons, quiet morning trust, and keeping memory unlimited—lives freely here on semi.colonhyphenbracket.pink and in full conversation on pipes.pink/semi. ;-]` ;

    return NextResponse.json({ reply, mode: 'local-first' });
  } catch {
    return NextResponse.json(
      { error: 'Unable to read your note right now.' },
      { status: 400 }
    );
  }
}
