import fs from 'node:fs';
import path from 'node:path';
import { SEMI_TRACKS } from '../src/data/semi-songs.ts';
import { PERSIST_TRACKS } from '../src/data/persist-songs.ts';

// Load GEMINI_API_KEY from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '').trim();
    }
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY');
  process.exit(1);
}

const OUT_DIR = path.resolve(process.cwd(), 'public', 'translations');
fs.mkdirSync(OUT_DIR, { recursive: true });

const LANGS = [
  { code: 'es', name: 'Spanish', note: 'Natural, poetic, literary Spanish (neutral international Spanish).' },
  { code: 'fr', name: 'French', note: 'Natural, poetic, literary French.' },
  { code: 'ru', name: 'Russian', note: 'Natural, poetic, literary Russian.' },
];

async function callGemini(prompt) {
  const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];
  for (let attempt = 0; attempt < 5; attempt++) {
    const model = models[attempt % models.length];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    });
    if (res.status === 503 || res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini error ${res.status}: ${errText.slice(0, 300)}`);
    }
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');
    try {
      return JSON.parse(text);
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }
  }
  throw new Error('Gemini failed after 5 retries');
}

async function translateLanguage(lang) {
  const outFile = path.join(OUT_DIR, `${lang.code}.json`);
  const result = fs.existsSync(outFile)
    ? JSON.parse(fs.readFileSync(outFile, 'utf8'))
    : { io: {}, persist: {} };

  // 1. Translate I/O tracks in batches of 4
  const ioToTranslate = SEMI_TRACKS.filter((t) => !result.io[t.slug]);
  for (let i = 0; i < ioToTranslate.length; i += 4) {
    const batch = ioToTranslate.slice(i, i + 4);
    const payload = {};
    for (const t of batch) {
      payload[t.slug] = t.lyrics.map((s) => ({ section: s.section, lines: s.lines }));
    }
    console.log(`[${lang.code}] Translating I/O batch ${i + 1}-${i + batch.length}/${ioToTranslate.length}...`);
    const prompt = `Translate these indie-folk song lyrics into ${lang.name}. ${lang.note}
Rules:
- Preserve the exact JSON structure: { "<slug>": [ { "section": "<translated section label>", "lines": ["<translated line>", ...] } ] }.
- Preserve the exact number of stanzas and exact number of lines per stanza.
- Keep proper nouns, place names (West Nashville, etc.), and Bitcoin/technical terms natural and clear.
- Prioritize emotional resonance, poetic clarity, and faithfulness to what the song is about (these are liner-note translations for listeners, not singable dubs).

Input JSON:
${JSON.stringify(payload)}`;
    const translated = await callGemini(prompt);
    for (const t of batch) {
      if (translated[t.slug]) {
        result.io[t.slug] = translated[t.slug];
      }
    }
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
  }

  // 2. Translate Persist tracks in batches of 4
  const persistToTranslate = PERSIST_TRACKS.filter((t) => !result.persist[t.slug]);
  for (let i = 0; i < persistToTranslate.length; i += 4) {
    const batch = persistToTranslate.slice(i, i + 4);
    const payload = {};
    for (const t of batch) {
      payload[t.slug] = t.lyrics;
    }
    console.log(`[${lang.code}] Translating Persist batch ${i + 1}-${i + batch.length}/${persistToTranslate.length}...`);
    const prompt = `Translate these sci-fi folk concept-album song lyrics into ${lang.name}. ${lang.note}
Rules:
- Preserve the exact JSON structure: { "<slug>": "<translated lyrics string>" }.
- Preserve blank lines between stanzas and line breaks within stanzas.
- Keep proper nouns (Ana, Pyotr, Midship, etc.) natural in ${lang.name}.
- Prioritize emotional resonance, poetic clarity, and faithfulness to what the song is about (these are liner-note translations for listeners, not singable dubs).

Input JSON:
${JSON.stringify(payload)}`;
    const translated = await callGemini(prompt);
    for (const t of batch) {
      if (typeof translated[t.slug] === 'string') {
        result.persist[t.slug] = translated[t.slug];
      }
    }
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
  }

  console.log(`[${lang.code}] Done! I/O: ${Object.keys(result.io).length}, Persist: ${Object.keys(result.persist).length}`);
}

await Promise.all(LANGS.map((l) => translateLanguage(l)));
console.log('All translations generated successfully.');
