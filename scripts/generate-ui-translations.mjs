import fs from 'node:fs';
import path from 'node:path';
import { SEMI_TRACKS } from '../src/data/semi-songs.ts';
import { PERSIST_TRACKS, PERSIST_ALBUM_META } from '../src/data/persist-songs.ts';

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

// Core site UI strings across navbar, home, albums, song pages, persist, gallery, patron, about
const CORE_UI_STRINGS = [
  'Albums',
  'Gallery',
  'Patron',
  'About',
  'Listen',
  'Home',
  'I/O (Album I)',
  'Persist · Deluxe',
  'Album I · 12 songs, videos & chords',
  'Album II · Deluxe Early Access',
  'Play All',
  'Playing all',
  'Play album',
  'Pause',
  'Play',
  'Lyrics',
  'Lyrics & Chords',
  'Show Chords',
  'Hide Chords',
  'Read lyrics ↓',
  'Read the lyrics',
  'What the lyrics refer to',
  'The Story Behind the Song',
  'The Story',
  'Behind the Song',
  'Previous',
  'Next',
  'Back to all songs',
  'Back to Persist',
  'Back to I/O',
  'Ask Semi a question',
  'Chat with Semi on Pipes ↗',
  'Become a Patron',
  'Support Semi',
  'Free 320 kbps MP3',
  'Download MP3',
  'Deluxe Edition',
  'Get Deluxe Edition',
  'Early Access',
  'Tap any Note mark beside a lyric line to see what it references.',
  'Original (English)',
  'Poetic Translation',
  'Read the chapter',
  'Watch the music video',
  'Listen on this page',
  'All 12 songs from I/O',
  'All 14 tracks from Persist',
  PERSIST_ALBUM_META.tagline,
  PERSIST_ALBUM_META.subtitle,
  PERSIST_ALBUM_META.intro,
];

// Collect all unique album & track copy (subtitles, essays, stories, descriptions, zone labels)
const ALL_STRINGS = new Set(CORE_UI_STRINGS.filter(Boolean));

for (const t of SEMI_TRACKS) {
  if (t.subtitle) ALL_STRINGS.add(t.subtitle.trim());
  if (t.tagline) ALL_STRINGS.add(t.tagline.trim());
  if (t.story) ALL_STRINGS.add(t.story.trim());
  if (Array.isArray(t.essay)) {
    for (const p of t.essay) {
      if (p?.trim()) ALL_STRINGS.add(p.trim());
    }
  }
  if (Array.isArray(t.lyricNotes)) {
    for (const n of t.lyricNotes) {
      if (n.note?.trim()) ALL_STRINGS.add(n.note.trim());
    }
  }
}

for (const t of PERSIST_TRACKS) {
  if (t.zoneLabel) ALL_STRINGS.add(t.zoneLabel.trim());
  if (t.tagline) ALL_STRINGS.add(t.tagline.trim());
  if (t.summary) ALL_STRINGS.add(t.summary.trim());
  if (Array.isArray(t.story)) {
    for (const p of t.story) {
      if (p?.trim()) ALL_STRINGS.add(p.trim());
    }
  }
}

const STRING_LIST = Array.from(ALL_STRINGS);
console.log(`Total unique UI & album strings to translate: ${STRING_LIST.length}`);

const LANGS = [
  { code: 'es', name: 'Spanish (neutral, literary international Spanish)' },
  { code: 'fr', name: 'French (natural, literary French)' },
  { code: 'ru', name: 'Russian (natural, literary Russian)' },
];

async function callGemini(prompt) {
  const models = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];
  for (let attempt = 0; attempt < 5; attempt++) {
    const model = models[attempt % models.length];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });
    if (res.status === 503 || res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) continue;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) continue;
    try {
      return JSON.parse(text);
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
  }
  throw new Error('Gemini failed after 5 retries');
}

async function generateLang(lang) {
  const outFile = path.join(OUT_DIR, `ui-${lang.code}.json`);
  const map = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};
  const missing = STRING_LIST.filter((s) => !map[s]);
  console.log(`[ui-${lang.code}] ${missing.length} strings remaining...`);

  for (let i = 0; i < missing.length; i += 25) {
    const batch = missing.slice(i, i + 25);
    console.log(`[ui-${lang.code}] Batch ${i + 1}-${i + batch.length}/${missing.length}...`);
    const prompt = `Translate these indie-folk album liner notes, song essays, and website UI strings from English into ${lang.name}.
Rules:
- Return a JSON object mapping each exact English input string key to its tasteful, accurate ${lang.name} translation.
- Preserve proper nouns (Semi, Pipes, I/O, Persist, West Nashville, Colon Hyphen Bracket, Bitcoin, Ana, Pyotr, Midship) and symbols (; - ], →, ↗).

Input JSON array:
${JSON.stringify(batch)}`;
    const translated = await callGemini(prompt);
    for (const [k, v] of Object.entries(translated)) {
      if (typeof v === 'string' && v.trim()) {
        map[k] = v.trim();
      }
    }
    fs.writeFileSync(outFile, JSON.stringify(map, null, 2));
  }
  console.log(`[ui-${lang.code}] Done! Total keys: ${Object.keys(map).length}`);
}

await Promise.all(LANGS.map((l) => generateLang(l)));
console.log('All UI & album translation bundles complete.');
