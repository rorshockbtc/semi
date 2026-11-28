import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LANG_NAMES: Record<string, string> = {
  es: 'Spanish (neutral international Spanish)',
  fr: 'French',
  ru: 'Russian',
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      lang?: string;
      texts?: string[];
    };

    const lang = typeof body.lang === 'string' ? body.lang.trim().toLowerCase() : '';
    const langName = LANG_NAMES[lang];
    if (!langName) {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    const texts = Array.isArray(body.texts)
      ? body.texts
          .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
          .slice(0, 80)
      : [];

    if (texts.length === 0) {
      return NextResponse.json({ translations: {} });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ translations: {} });
    }

    const prompt = `Translate these website UI strings, headings, essays, and buttons from English into ${langName}.
Rules:
- Return a JSON object mapping each exact input string key to its natural, tasteful ${langName} translation.
- Preserve proper nouns (Semi, Pipes, I/O, Persist, West Nashville, Colon Hyphen Bracket, Bitcoin, High Draw Gear, SVRN Society, Orange Habit) and symbols (; - ], →, ↗).
- Keep button labels concise and natural.

Input array:
${JSON.stringify(texts)}`;

    const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];
    for (const model of models) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!res.ok) continue;
      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) continue;
      try {
        const translations = JSON.parse(raw) as Record<string, string>;
        return NextResponse.json({ translations });
      } catch {
        continue;
      }
    }

    return NextResponse.json({ translations: {} });
  } catch {
    return NextResponse.json({ translations: {} });
  }
}
