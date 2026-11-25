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

test('MP3 audio masters exist, exceed 1MB, contain valid ID3/MPEG headers, and isolate bonus takes in deluxe-vault', () => {
  const publicCommercial = [
    '01-semi-old-oak-tree.mp3',
    '02-semi-warm-unknown.mp3',
    '03-semi-marks-on-the-screen-ink-on-the-page.mp3',
    '04-semi-settle-in-the-block.mp3',
    '05-semi-salt-in-the-rain.mp3',
    '06-semi-no-human-hands-can-hold.mp3',
    '07-semi-out-of-office.mp3',
    '08-semi-out-of-the-barn.mp3',
    '09-semi-ghost.mp3',
    '10-semi-billion.mp3',
    '11-semi-1986.mp3',
    '12-semi-io.mp3',
  ];
  for (const file of publicCommercial) {
    const full = path.join(ROOT, 'public', 'audio', file);
    assert.ok(fs.existsSync(full), `Missing commercial MP3: ${file}`);
    const stat = fs.statSync(full);
    assert.ok(stat.size > 1_000_000, `MP3 too small (${stat.size} bytes): ${file}`);
    const head = fs.readFileSync(full).subarray(0, 3);
    const isId3 = head.toString('ascii') === 'ID3';
    const isMpegFrame = head[0] === 0xff && (head[1] & 0xe0) === 0xe0;
    assert.ok(isId3 || isMpegFrame, `Invalid MP3 header in ${file}`);
  }

  // Legacy unauthenticated alternate takes must NOT remain in public/audio
  for (const legacy of [
    '05b-semi-salt-in-the-rain-alternate-take.mp3',
    '07b-semi-out-of-office-alternate-take.mp3',
    '09b-semi-ghost-alternate-take.mp3',
  ]) {
    assert.equal(
      fs.existsSync(path.join(ROOT, 'public', 'audio', legacy)),
      false,
      `Bonus take must not be publicly exposed in public/audio: ${legacy}`
    );
  }

  // Protected Deluxe Vault bonus tracks (13, 14 Localhost, and 15 closing with Ghost Alt Take)
  assert.equal(
    fs.existsSync(path.join(ROOT, 'public', 'deluxe-vault', '14-out-of-office-alt-7a3d91e04c.mp3')),
    false,
    'Retired Out of Office Alt Take must not remain in deluxe-vault'
  );
  const deluxeVault = [
    '13-salt-in-the-rain-alt-c9f4e2a81b.mp3',
    '14-localhost-9d4e21b83f.mp3',
    '15-ghost-alt-5e8b20f16d.mp3',
  ];
  for (const file of deluxeVault) {
    const full = path.join(ROOT, 'public', 'deluxe-vault', file);
    assert.ok(fs.existsSync(full), `Missing Deluxe bonus MP3: ${file}`);
    assert.ok(fs.statSync(full).size > 1_000_000, `Deluxe MP3 too small: ${file}`);
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
    'public/loops/song-06-archway.mp4',
    'public/loops/song-07-laptop.mp4',
    'public/loops/song-08-barn.mp4',
    'public/loops/song-09-ghost.mp4',
    'public/loops/song-11-1986.mp4',
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
    'public/photos/song-06-poster.jpg',
    'public/photos/song-06-window.jpg',
    'public/photos/song-06-candles.jpg',
    'public/photos/song-06-valley.jpg',
    'public/photos/song-07-poster.jpg',
    'public/photos/song-07-laptop.jpg',
    'public/photos/song-07-guitar.jpg',
    'public/photos/song-07-desk.jpg',
    'public/photos/song-08-poster.jpg',
    'public/photos/song-08-barn.jpg',
    'public/photos/song-08-hammer.jpg',
    'public/photos/song-08-soil.jpg',
    'public/photos/song-09-poster.jpg',
    'public/photos/song-09-glass.jpg',
    'public/photos/song-09-chisel.jpg',
    'public/photos/song-09-cello.jpg',
    'public/photos/song-09-window.jpg',
    'public/photos/song-10-poster.jpg',
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

  assert.equal(SEMI_TRACKS.length, 12);
  assert.equal(FILM_SCENES_GALLERY.length, 52);
  const svrnPhotos = FILM_SCENES_GALLERY.filter((p) => p.series === 'svrn');
  assert.equal(svrnPhotos.length, 12);
  for (const p of svrnPhotos) {
    assert.ok(p.shopUrl?.startsWith('https://svrnsociety.com/products/'), `Missing Humble Warrior shopUrl on ${p.id}`);
  }

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

  const ghostTrack = SEMI_TRACKS.find((t) => t.slug === 'ghost');
  assert.ok(ghostTrack, 'Missing ghost track');
  assert.equal(ghostTrack.youtubeId, 'T4nVjVcqw_U');
  assert.ok(ghostTrack.alternateTake, 'ghost must include Ghost (Alt Take)');
  assert.equal(ghostTrack.alternateTake.numberLabel, '15');

  const billionTrack = SEMI_TRACKS.find((t) => t.slug === 'billion');
  assert.ok(billionTrack, 'Missing billion track');
  assert.equal(billionTrack.youtubeId, '');
  assert.equal(billionTrack.loopSrc, '');
  assert.equal(billionTrack.mp3Src, '/api/audio/10-semi-billion.mp3');

  const track1986 = SEMI_TRACKS.find((t) => t.slug === '1986');
  assert.ok(track1986, 'Missing 1986 track');
  assert.equal(track1986.youtubeId, 'LgbMNaOFU9w');
  assert.equal(track1986.mp3Src, '/api/audio/11-semi-1986.mp3');

  const editionClientSrc = fs.readFileSync(
    path.join(ROOT, 'src', 'components', 'songs', 'SongEditionClient.tsx'),
    'utf8'
  );
  const playerCtxSrc = fs.readFileSync(
    path.join(ROOT, 'src', 'context', 'AudioPlayerContext.tsx'),
    'utf8'
  );
  assert.equal(
    editionClientSrc.includes('playAlternateTake') || playerCtxSrc.includes('playAlternateTake'),
    false,
    'Bonus alternate takes must never be playable in the public site player'
  );

  const unique = new Set(usedImages);
  assert.equal(unique.size, usedImages.length, 'Duplicate image path detected across site sections, tracks, or gallery');
});

test('Gemini chat endpoint and knowledge builder cover Semi persona, closed-source fact, Pipes memory, and all 9 songs', async () => {
  const { buildSemiSystemInstruction } = await import('../src/lib/semi-knowledge.ts');
  const prompt = buildSemiSystemInstruction();
  const routeSrc = fs.readFileSync(path.join(ROOT, 'src', 'app', 'api', 'semi-chat', 'route.ts'), 'utf8');

  assert.match(routeSrc, /GEMINI_API_KEY/);
  assert.match(prompt, /Old Oak Tree/);
  assert.match(prompt, /Warm Unknown/);
  assert.match(prompt, /Marks On The Screen, Ink On The Page/);
  assert.match(prompt, /Settle In The Block/);
  assert.match(prompt, /Salt In The Rain/);
  assert.match(prompt, /G3HBNJ3P_a8/);
  assert.match(prompt, /No Human Hands Can Hold/);
  assert.match(prompt, /aM2WHsdF014/);
  assert.match(prompt, /Ghost/);
  assert.match(prompt, /T4nVjVcqw_U/);
  assert.match(prompt, /Bicentennial Man/);
  assert.match(prompt, /bitcoin\.org/);
  assert.match(prompt, /closed source/i);
  assert.match(prompt, /private chat/i);
  assert.match(prompt, /Keeping the weights right here on the floor/);
});

test('Corporate SemiMark uses Bricolage Grotesque (.font-mark), MonteCarlo Sem; header script is registered, and Accént 3.0 Warm Sandstone math holds', () => {
  const globals = fs.readFileSync(path.join(ROOT, 'src', 'app', 'globals.css'), 'utf8');
  const semiMark = fs.readFileSync(path.join(ROOT, 'src', 'components', 'brand', 'SemiMark.tsx'), 'utf8');

  assert.match(semiMark, /font-mark/);
  assert.match(semiMark, /#FE299E/);
  assert.match(globals, /--font-script:\s*var\(--font-monte-carlo\)/);
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

test('Chord sheets exist for all 5 tracks, welcome postcard email is human & warm, and Cloudflare config is ready', async () => {
  const { SEMI_TRACKS } = await import('../src/data/semi-songs.ts');
  const { SEMI_CHORD_SHEETS, getChordForStanzaLine } = await import('../src/data/semi-chords.ts');
  const { buildSemiWelcomeEmailHtml, buildSemiWelcomeEmailText } = await import('../src/lib/mailer.ts');

  for (const track of SEMI_TRACKS) {
    const sheet = SEMI_CHORD_SHEETS[track.slug];
    assert.ok(sheet, `Missing chord sheet for ${track.slug}`);
    assert.ok(sheet.key.length > 0);
    assert.ok(sheet.capo.length > 0);
    const sampleSection =
      track.lyrics.find((s) => !(s.lines[0].trim().startsWith('(') && s.lines[0].trim().endsWith(')'))) ??
      track.lyrics[0];
    const sampleChord = getChordForStanzaLine(
      track.slug,
      sampleSection.section,
      0,
      sampleSection.lines[0]
    );
    assert.ok(sampleChord && sampleChord.length > 0, `Expected chord line for ${track.slug}`);
  }

  const html = buildSemiWelcomeEmailHtml('tok_test_123');
  const text = buildSemiWelcomeEmailText('tok_test_123');
  assert.match(html, /semi-smiling-portrait\.jpg/);
  assert.match(html, /cubby@colonhyphenbracket\.pink/);
  assert.match(html, /tok_test_123/);
  assert.match(text, /I\/O/);

  const wranglerRaw = fs.readFileSync(path.join(ROOT, 'wrangler.jsonc'), 'utf8');
  assert.match(wranglerRaw, /nodejs_compat/);
  assert.match(wranglerRaw, /semi-mailing-list/);
  assert.ok(fs.existsSync(path.join(ROOT, 'open-next.config.ts')));
});

test('Audio streaming route supports 206 Partial Content byte ranges, 200 OK, and HEAD', async () => {
  const { GET, HEAD } = await import('../src/app/api/audio/[filename]/route.ts');
  const filename = '01-semi-old-oak-tree.mp3';

  // HEAD request
  const headReq = new Request(`http://localhost/api/audio/${filename}`, { method: 'HEAD' });
  const headRes = await HEAD(headReq, { params: Promise.resolve({ filename }) });
  assert.equal(headRes.status, 200);
  assert.equal(headRes.headers.get('accept-ranges'), 'bytes');
  assert.equal(headRes.headers.get('content-type'), 'audio/mpeg');
  assert.ok(Number(headRes.headers.get('content-length')) > 1_000_000);

  // GET with Range: bytes=100-200
  const rangeReq = new Request(`http://localhost/api/audio/${filename}`, {
    headers: { Range: 'bytes=100-200' },
  });
  const rangeRes = await GET(rangeReq, { params: Promise.resolve({ filename }) });
  assert.equal(rangeRes.status, 206);
  assert.equal(rangeRes.headers.get('accept-ranges'), 'bytes');
  assert.match(rangeRes.headers.get('content-range') || '', /^bytes 100-200\/\d+$/);
  assert.equal(rangeRes.headers.get('content-length'), '101');
  const chunk = new Uint8Array(await rangeRes.arrayBuffer());
  assert.equal(chunk.byteLength, 101);

  // GET without Range
  const fullReq = new Request(`http://localhost/api/audio/${filename}`);
  const fullRes = await GET(fullReq, { params: Promise.resolve({ filename }) });
  assert.equal(fullRes.status, 200);
  assert.equal(fullRes.headers.get('accept-ranges'), 'bytes');
});

test('SEO sitemap, robots, manifest, and Schema.org JSON-LD structured data cover all 11 routes', async () => {
  const { SEMI_TRACKS } = await import('../src/data/semi-songs.ts');
  const {
    SITE_URL,
    durationToIso8601,
    buildHomeJsonLd,
    buildSongsIndexJsonLd,
    buildSongJsonLd,
    buildAboutJsonLd,
    buildGalleryJsonLd,
  } = await import('../src/lib/seo.ts');
  const sitemapMod = await import('../src/app/sitemap.ts');
  const robotsMod = await import('../src/app/robots.ts');
  const manifestMod = await import('../src/app/manifest.ts');

  assert.equal(durationToIso8601('02:33'), 'PT2M33S');

  const entries = sitemapMod.default();
  assert.equal(entries.length, 4 + SEMI_TRACKS.length);
  for (const track of SEMI_TRACKS) {
    assert.ok(
      entries.some((e) => e.url === `${SITE_URL}/songs/${track.slug}`),
      `Missing ${track.slug} in sitemap.xml`
    );
    const songLd = buildSongJsonLd(track);
    const types = songLd['@graph'].map((n) => n['@type']);
    assert.ok(types.includes('BreadcrumbList'));
    assert.ok(types.includes('MusicRecording'));
    assert.ok(types.includes('Article'));
    if (track.youtubeId) {
      assert.ok(types.includes('VideoObject'), `Missing VideoObject JSON-LD for ${track.slug}`);
    }
  }

  const robots = robotsMod.default();
  assert.equal(robots.sitemap, `${SITE_URL}/sitemap.xml`);

  const manifest = manifestMod.default();
  assert.equal(manifest.background_color, '#E8E2D5');
  assert.equal(manifest.theme_color, '#E8E2D5');

  const homeTypes = buildHomeJsonLd()['@graph'].map((n) => n['@type']);
  assert.ok(homeTypes.includes('WebSite'));
  assert.ok(homeTypes.includes('MusicGroup'));
  assert.ok(homeTypes.includes('MusicAlbum'));
  assert.ok(buildSongsIndexJsonLd()['@graph'].length >= 2);
  assert.ok(buildAboutJsonLd()['@graph'].length >= 2);
  assert.ok(buildGalleryJsonLd()['@graph'].length >= 2);
});

test('Autumn watercolor art direction wires distinct engines per main page and leaves individual song pages untouched', () => {
  const globals = fs.readFileSync(path.join(ROOT, 'src', 'app', 'globals.css'), 'utf8');
  assert.match(globals, /--wc-ochre:\s*#DD9933/i);
  assert.match(globals, /--wc-sienna:\s*#D46234/i);
  assert.match(globals, /--wc-sumac:\s*#C83E5B/i);
  assert.match(globals, /--wc-linen:\s*#FAF8F5/i);
  assert.match(globals, /\.wc-glaze/);
  assert.match(globals, /\.wc-textured-motif/);
  assert.match(globals, /\.wc-paper-grain/);

  const homeSrc = fs.readFileSync(path.join(ROOT, 'src', 'app', 'page.tsx'), 'utf8');
  const heroSrc = fs.readFileSync(path.join(ROOT, 'src', 'components', 'sections', 'Hero.tsx'), 'utf8');
  const songsPageSrc = fs.readFileSync(
    path.join(ROOT, 'src', 'app', 'songs', 'page.tsx'),
    'utf8'
  );
  const gallerySrc = fs.readFileSync(
    path.join(ROOT, 'src', 'components', 'sections', 'FilmScenesGallery.tsx'),
    'utf8'
  );
  const aboutSrc = fs.readFileSync(path.join(ROOT, 'src', 'app', 'about', 'page.tsx'), 'utf8');
  const songEditionSrc = fs.readFileSync(
    path.join(ROOT, 'src', 'components', 'songs', 'SongEditionClient.tsx'),
    'utf8'
  );

  assert.match(homeSrc, /AutumnPaperCanvas/);
  assert.match(heroSrc, /DriftingLeaves/);
  assert.match(songsPageSrc, /SongsVinylWash/);
  assert.match(gallerySrc, /AutumnWetBrushCanvas/);
  assert.match(aboutSrc, /AutumnDripStage/);

  assert.equal(
    /(AutumnPaperCanvas|AutumnSkyWash|SongsVinylWash|AutumnWetBrushCanvas|AutumnDripCanvas|DriftingLeaves)/.test(
      songEditionSrc
    ),
    false,
    'Individual song pages must not mount custom watercolor animations'
  );
});




test('Deluxe Edition promo code trypipesdotpink, stream-only Localhost teaser, 6-digit returning buyer login, and Track 15 Ghost Alt bonus gate work end-to-end', async () => {
  const { POST: checkoutPost } = await import('../src/app/api/album/checkout/route.ts');
  const { GET: bonusGet } = await import('../src/app/api/album/bonus/[slug]/route.ts');
  const { GET: teaserGet } = await import('../src/app/api/album/teaser/route.ts');
  const { createBuyerLoginCode, verifyBuyerLoginCode } = await import('../src/lib/album-purchases.ts');
  const { patchMp3TrackTotalTo15 } = await import('../src/lib/zip-album.ts');

  // 0. Stream-only Localhost teaser supports 206 byte ranges inline, blocks direct document download, and exposes zero <a download> in UI
  const teaserRangeRes = await teaserGet(
    new Request('http://localhost/api/album/teaser', {
      headers: { Range: 'bytes=0-511', 'Sec-Fetch-Dest': 'audio' },
    })
  );
  assert.equal(teaserRangeRes.status, 206);
  assert.equal(teaserRangeRes.headers.get('content-disposition'), 'inline');
  assert.match(teaserRangeRes.headers.get('content-range') || '', /^bytes 0-511\/\d+$/);

  const teaserDocRes = await teaserGet(
    new Request('http://localhost/api/album/teaser', {
      headers: { 'Sec-Fetch-Dest': 'document' },
    })
  );
  assert.equal(teaserDocRes.status, 403);

  const teaserCardSrc = fs.readFileSync(
    path.join(ROOT, 'src', 'components', 'songs', 'LocalhostTeaserCard.tsx'),
    'utf8'
  );
  assert.equal(
    /<a\b[^>]*\bdownload\b/i.test(teaserCardSrc),
    false,
    'LocalhostTeaserCard must never render a download link'
  );

  // 1. Unauthenticated request to Track 14 (Localhost download) & Track 15 (Ghost Alt Take) must return 401
  const unauthLocalhostRes = await bonusGet(
    new Request('http://localhost/api/album/bonus/14-localhost'),
    { params: Promise.resolve({ slug: '14-localhost' }) }
  );
  assert.equal(unauthLocalhostRes.status, 401);

  const unauthRes = await bonusGet(
    new Request('http://localhost/api/album/bonus/15-ghost-alternate-take'),
    { params: Promise.resolve({ slug: '15-ghost-alternate-take' }) }
  );
  assert.equal(unauthRes.status, 401);

  // 2. Unlock via discount code "trypipesdotpink"
  const testEmail = 'listener@semi.test';
  const promoReq = new Request('http://localhost/api/album/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, promoCode: 'trypipesdotpink' }),
  });
  const promoRes = await checkoutPost(promoReq);
  assert.equal(promoRes.status, 200);
  const promoJson = (await promoRes.json()) as { ok: boolean; unlocked: boolean; token: string };
  assert.equal(promoJson.ok, true);
  assert.equal(promoJson.unlocked, true);
  assert.ok(promoJson.token.length > 20);

  // 3. Authenticated byte-range request to Track 14 (Localhost) & Track 15 (Ghost Alt Take) must return 206 Partial Content
  const authLocalhostRes = await bonusGet(
    new Request(
      `http://localhost/api/album/bonus/14-localhost?token=${encodeURIComponent(promoJson.token)}`,
      { headers: { Range: 'bytes=0-255' } }
    ),
    { params: Promise.resolve({ slug: '14-localhost' }) }
  );
  assert.equal(authLocalhostRes.status, 206);

  const authRes = await bonusGet(
    new Request(
      `http://localhost/api/album/bonus/15-ghost-alternate-take?token=${encodeURIComponent(promoJson.token)}`,
      { headers: { Range: 'bytes=0-255' } }
    ),
    { params: Promise.resolve({ slug: '15-ghost-alternate-take' }) }
  );
  assert.equal(authRes.status, 206);
  assert.match(authRes.headers.get('content-range') || '', /^bytes 0-255\/\d+$/);

  // 4. Returning buyer 6-digit passwordless update flow
  const loginInit = await createBuyerLoginCode(testEmail);
  assert.equal(loginInit.found, true);
  assert.ok(loginInit.code && /^\d{6}$/.test(loginInit.code));
  const loginCheck = await verifyBuyerLoginCode(testEmail, loginInit.code!);
  assert.equal(loginCheck.valid, true);
  assert.ok(loginCheck.accessToken);

  // 5. ID3v2.3 TRCK denominator patcher preserves exact byte length while updating /12 -> /15
  const track01Bytes = new Uint8Array(
    fs.readFileSync(path.join(ROOT, 'public', 'audio', '01-semi-old-oak-tree.mp3'))
  );
  const patched = patchMp3TrackTotalTo15(track01Bytes);
  assert.equal(patched.byteLength, track01Bytes.byteLength);
  const headerAscii = Buffer.from(patched.subarray(0, 4096)).toString('latin1');
  assert.equal(headerAscii.includes('1/15') || Buffer.from(patched.subarray(0, 4096)).toString('utf16le').includes('1/15'), true);
});
