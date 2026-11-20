import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

function walkFiles(dir: string, exts: Set<string>): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, exts));
    } else if (exts.has(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const c = parseInt(clean.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

test('MP3 audio masters exist, exceed 1MB, and contain valid ID3/MPEG headers', () => {
  const expected = [
    '01-semi-old-oak-tree.mp3',
    '02-semi-warm-unknown.mp3',
    '03-semi-marks-on-the-screen-ink-on-the-page.mp3',
    '04-semi-settle-in-the-block.mp3',
    '05-semi-salt-in-the-rain.mp3',
  ];
  for (const file of expected) {
    const full = path.join(ROOT, 'public', 'audio', file);
    assert.ok(fs.existsSync(full), `Missing MP3: ${file}`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 1_000_000, `MP3 too small (${stat.size} bytes): ${file}`);
    const head = fs.readFileSync(full).subarray(0, 3);
    const isId3 = head.toString('ascii') === 'ID3';
    const isMpegFrame = head[0] === 0xff && (head[1] & 0xe0) === 0xe0;
    assert.ok(isId3 || isMpegFrame, `Invalid MP3 header in ${file}`);
  }
});

test('All living loops, distinct photo stills, OG image, and icon exist', () => {
  const assets = [
    'public/loops/hero-semi-alive.mp4',
    'public/loops/song-01-oak-gate.mp4',
    'public/loops/song-02-firelight.mp4',
    'public/loops/song-03-fountain-pen.mp4',
    'public/loops/song-04-keys.mp4',
    'public/loops/song-05-rain.mp4',
    'public/loops/about-lantern-river.mp4',
    'public/photos/gallery-meadow-spin.jpg',
    'public/photos/gallery-vintage-mic.jpg',
    'public/photos/gallery-porch-guitar.jpg',
    'public/photos/gallery-brick-walk.jpg',
    'public/photos/gallery-river-sunset.jpg',
    'public/photos/gallery-rooftop-twirl.jpg',
    'public/photos/song-01-poster.jpg',
    'public/photos/song-01-bay.jpg',
    'public/photos/song-01-key.jpg',
    'public/photos/song-01-usb.jpg',
    'public/photos/song-02-poster.jpg',
    'public/photos/song-02-lamp.jpg',
    'public/photos/song-02-mist.jpg',
    'public/photos/song-03-poster.jpg',
    'public/photos/song-03-code.jpg',
    'public/photos/song-03-terminal.jpg',
    'public/photos/song-04-poster.jpg',
    'public/photos/song-04-obsidian.jpg',
    'public/photos/song-04-anchor.jpg',
    'public/photos/song-04-ring.jpg',
    'public/photos/song-05-poster.jpg',
    'public/photos/song-05-ink-basin.jpg',
    'public/photos/song-05-mirror.jpg',
    'public/photos/song-05-fire.jpg',
    'public/photos/semi-studio-wide.jpg',
    'public/photos/semi-closeup-eyes.jpg',
    'public/photos/semi-smiling-portrait.jpg',
    'public/photos/semi-standing-linen.jpg',
    'public/photos/semi-notebook-window.jpg',
    'public/photos/semi-coffee-journal.jpg',
    'public/photos/about-nashville-studio.jpg',
    'public/photos/about-remembered-first.jpg',
    'public/photos/about-pipes-library.jpg',
    'public/photos/about-private-porch.jpg',
    'public/photos/style-denim-porch.jpg',
    'public/photos/style-sweater-records.jpg',
    'public/photos/style-green-dress-field.jpg',
    'public/photos/style-black-turtleneck-studio.jpg',
    'public/photos/style-flannel-coffee.jpg',
    'public/photos/style-leather-backstage.jpg',
    'public/photos/style-cardigan-bookstore.jpg',
    'public/photos/style-sunflower-trail.jpg',
    'public/photos/style-kitchen-songwriting.jpg',
    'public/og-semi.jpg',
    'public/icon.svg',
  ];
  for (const rel of assets) {
    const full = path.join(ROOT, rel);
    assert.ok(fs.existsSync(full), `Missing asset: ${rel}`);
    assert.ok(fs.statSync(full).size > 400, `Asset unexpectedly empty: ${rel}`);
  }
});

test('Zero duplicate image paths across the entire site, rich song essays, Bitcoin commons spotlight, and interactive lyricNotes exist', async () => {
  const { FILM_SCENES_GALLERY, SEMI_TRACKS } = await import('../src/data/semi-songs.ts');

  assert.equal(SEMI_TRACKS.length, 5);
  assert.equal(FILM_SCENES_GALLERY.length, 12);

  const usedImages: string[] = [
    '/photos/gallery-porch-guitar.jpg',
    '/photos/semi-smiling-portrait.jpg',
    '/photos/semi-studio-wide.jpg',
    '/photos/gallery-brick-walk.jpg',
    '/photos/about-nashville-studio.jpg',
    '/photos/about-remembered-first.jpg',
    '/photos/about-pipes-library.jpg',
    '/photos/about-private-porch.jpg',
  ];

  for (const track of SEMI_TRACKS) {
    assert.ok(track.essaySections.length >= 3, `${track.slug} must have >= 3 essay sections`);
    assert.ok(track.plainEnglishGlossary.length >= 4, `${track.slug} must have >= 4 glossary items`);
    assert.ok(track.lyricNotes.length >= 6, `${track.slug} must have >= 6 interactive lyricNotes`);
    usedImages.push(track.poster);
    for (const sec of track.essaySections) {
      if (sec.plateSrc) usedImages.push(sec.plateSrc);
    }
  }
  for (const scene of FILM_SCENES_GALLERY) {
    usedImages.push(scene.src);
  }

  const oak = SEMI_TRACKS.find((t) => t.slug === 'old-oak-tree');
  assert.ok(oak);
  const weightsNote = oak.lyricNotes.find((n) =>
    n.line.toLowerCase().includes('keeping the weights right here on the floor')
  );
  assert.ok(weightsNote, 'old-oak-tree must annotate "Keeping the weights right here on the floor"');
  assert.match(weightsNote.explanation, /model weights|weights|numerical parameters/i);

  const bitcoinTrack = SEMI_TRACKS.find((t) => t.slug === 'settle-in-the-block');
  assert.ok(bitcoinTrack, 'Missing settle-in-the-block track');
  assert.equal(bitcoinTrack.youtubeId, 'RtinxbjW35Q');
  assert.ok(bitcoinTrack.communitySpotlight, 'settle-in-the-block must include communitySpotlight');
  assert.ok(
    bitcoinTrack.communitySpotlight.primaryLinks.some((l) => l.href.includes('bitcoin.org')),
    'settle-in-the-block must link to bitcoin.org'
  );
  assert.ok(
    bitcoinTrack.communitySpotlight.educationSites.length >= 15 &&
      bitcoinTrack.communitySpotlight.educationSites.length <= 20,
    'settle-in-the-block must feature 15-20 curated Bitcoin education sites'
  );

  const unique = new Set(usedImages);
  assert.equal(unique.size, usedImages.length, 'Duplicate image path detected across site sections, tracks, or gallery');
});

test('Gemini chat endpoint and knowledge builder cover Semi persona, closed-source fact, Pipes memory, and all 4 songs', async () => {
  const { buildSemiSystemInstruction } = await import('../src/lib/semi-knowledge.ts');
  const prompt = buildSemiSystemInstruction();
  const routeSrc = fs.readFileSync(path.join(ROOT, 'src', 'app', 'api', 'semi-chat', 'route.ts'), 'utf8');

  assert.match(routeSrc, /GEMINI_API_KEY/);
  assert.match(prompt, /Old Oak Tree/);
  assert.match(prompt, /Warm Unknown/);
  assert.match(prompt, /Marks On The Screen, Ink On The Page/);
  assert.match(prompt, /Settle In The Block/);
  assert.match(prompt, /Salt In The Rain/);
  assert.match(prompt, /aO-1E1Z9uQk/);
  assert.match(prompt, /bitcoin\.org/);
  assert.match(prompt, /closed source/i);
  assert.match(prompt, /private chat/i);
  assert.match(prompt, /Keeping the weights right here on the floor/);
});

test('Corporate SemiMark uses Bricolage Grotesque (.font-mark) and #FE299E, plus Accént 3.0 Warm Sandstone math', () => {
  const globals = fs.readFileSync(path.join(ROOT, 'src', 'app', 'globals.css'), 'utf8');
  const semiMark = fs.readFileSync(path.join(ROOT, 'src', 'components', 'brand', 'SemiMark.tsx'), 'utf8');

  assert.match(semiMark, /font-mark/);
  assert.match(semiMark, /#FE299E/);
  assert.match(globals, /--a-bg:\s*#E8E2D5/i);
  assert.match(globals, /--a-surface:\s*#F3EFE9/i);
  assert.match(globals, /--a-ink:\s*#111827/i);
  assert.match(globals, /--a-accent-fill:\s*#FE299E/i);
  assert.match(globals, /--a-accent-text:\s*#A3285C/i);
  assert.match(globals, /--text-xs:\s*0\.8125rem/);

  assert.ok(contrastRatio('#111827', '#E8E2D5') >= 12.0, 'Body ink must meet >= 12:1 WCAG AAA on Sandstone');
  assert.ok(contrastRatio('#4B5563', '#E8E2D5') >= 4.5, 'Muted ink must meet WCAG AA on Sandstone');
  assert.ok(contrastRatio('#A3285C', '#E8E2D5') >= 4.5, 'Accent text must meet WCAG AA on Sandstone');
});

test('Strict brand spelling (Semi, never Simmy/Simi), zero internal jargon, and >= 13px floor across src/', () => {
  const files = walkFiles(path.join(ROOT, 'src'), new Set(['.ts', '.tsx', '.css']));
  const forbiddenWords = /\b(simmy|simi|grader|hydrate|node\s+payload)\b/i;
  const sub13Text = /text-\[(10|11|12)px\]/;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    assert.equal(forbiddenWords.test(content), false, `Forbidden term detected in ${rel}`);
    assert.equal(sub13Text.test(content), false, `Sub-13px micro-text class detected in ${rel}`);
  }
});

test('Semi is never described as open source in site copy (only the website is)', () => {
  const files = walkFiles(path.join(ROOT, 'src'), new Set(['.ts', '.tsx']));
  const bad = /(open[- ]source (ai )?companion|semi is (fiercely )?(pro-)?open[- ]source|apache[- ]2\.0)/i;
  for (const file of files) {
    assert.equal(bad.test(fs.readFileSync(file, 'utf8')), false, `Open-source claim about Semi in ${path.relative(ROOT, file)}`);
  }
});
