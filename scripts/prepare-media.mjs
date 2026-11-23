import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import ffmpegPath from 'ffmpeg-static';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOWNLOADS = path.join(os.homedir(), 'Downloads');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');
const PHOTO_DIR = path.join(ROOT, 'public', 'photos');
const LOOP_DIR = path.join(ROOT, 'public', 'loops');
const PUBLIC_DIR = path.join(ROOT, 'public');

const DELUXE_VAULT_DIR = path.join(ROOT, 'public', 'deluxe-vault');
for (const dir of [AUDIO_DIR, DELUXE_VAULT_DIR, PHOTO_DIR, LOOP_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

if (!ffmpegPath) {
  throw new Error('ffmpeg-static binary not found');
}

function runFfmpeg(args) {
  execFileSync(ffmpegPath, ['-y', ...args], { stdio: 'inherit' });
}

function resolveSource(patterns) {
  const searchDirs = [DOWNLOADS, os.homedir(), ROOT];
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir);
    for (const pat of patterns) {
      const exact = path.join(dir, pat);
      if (fs.existsSync(exact)) return exact;
      const prefix = pat.replace(/\*.*$/, '');
      const suffix = pat.includes('*') ? pat.split('*').pop() : '';
      const found = entries.find(
        (name) =>
          name.toLowerCase().startsWith(prefix.toLowerCase()) &&
          (!suffix || name.toLowerCase().endsWith(suffix.toLowerCase()))
      );
      if (found) return path.join(dir, found);
    }
  }
  throw new Error(`Missing source file in ${DOWNLOADS} or ${os.homedir()}: ${patterns.join(', ')}`);
}

function loadVerifiedLyricsMap() {
  const lyricsFile = path.join(ROOT, 'LYRICS.md');
  const map = new Map();
  if (!fs.existsSync(lyricsFile)) return map;
  const raw = fs.readFileSync(lyricsFile, 'utf8');
  const sections = raw.split(/\n## /).slice(1);
  for (const sec of sections) {
    const nl = sec.indexOf('\n');
    if (nl < 0) continue;
    const header = sec.slice(0, nl).trim();
    const code = header.split('·')[0].trim(); // e.g. '01', '05b', '12'
    const body = sec
      .slice(nl + 1)
      .replace(/\n---\s*$/m, '')
      .replace(/^\[.*?\]\s*\n?/gm, '')
      .trim();
    map.set(code, body);
  }
  return map;
}

const FORCE_AUDIO_REMASTER = process.argv.includes('--remaster-audio');

function probeDurationSeconds(filePath) {
  try {
    execFileSync(ffmpegPath, ['-i', filePath], { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    const stderr = err?.stderr?.toString('utf8') || '';
    const match = stderr.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    if (match) {
      return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
    }
  }
  throw new Error(`Unable to determine duration for ${filePath}`);
}

const TRACKS = [
  {
    lyricsKey: '01',
    inputs: ['Local Current (Sung Outro).m4a'],
    out: '01-semi-old-oak-tree.mp3',
    title: 'Old Oak Tree',
    track: '1/12',
    fadeDuration: 1.4,
    padDuration: 0.6,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '02',
    inputs: ['Warm Unknown.m4a'],
    out: '02-semi-warm-unknown.mp3',
    title: 'Warm Unknown',
    track: '2/12',
    fadeEndOffset: 1.7,
    fadeDuration: 1.0,
    padDuration: 0.25,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '03',
    inputs: ['Fixed Final Chorus and Outro.wav', 'Fixed Final Chorus and Outro.m4a'],
    out: '03-semi-marks-on-the-screen-ink-on-the-page.mp3',
    title: 'Marks On The Screen, Ink On The Page',
    track: '3/12',
    // Vocal finishes at 175.65s (of 176.16s). Only taper the final 0.44s post-vocal room floor!
    fadeDuration: 0.44,
    fadeCurve: 'qsin',
    padDuration: 0.85,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '04',
    inputs: ['Settle in the Block (Poetic - Take 1).m4a'],
    out: '04-semi-settle-in-the-block.mp3',
    title: 'Settle In The Block',
    track: '4/12',
    fadeEndOffset: 0.8,
    fadeDuration: 0.9,
    padDuration: 0.35,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '05',
    inputs: ['Salt In The Rain (Audio Fixed).m4a', 'Salt In The Rain.m4a', 'Salt in the rain.m4a'],
    out: '05-semi-salt-in-the-rain.mp3',
    title: 'Salt In The Rain',
    track: '5/12',
    fadeDuration: 1.5,
    padDuration: 0.6,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '06',
    inputs: ['No Human Hands Can Hold.m4a'],
    out: '06-semi-no-human-hands-can-hold.mp3',
    title: 'No Human Hands Can Hold',
    track: '6/12',
    fadeDuration: 1.5,
    padDuration: 0.6,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '07',
    inputs: ['Out of Office (Audio Fixed).wav', 'Out of Office (Audio Fixed).m4a', 'Out of Office.m4a'],
    out: '07-semi-out-of-office.mp3',
    title: 'Out of Office',
    track: '7/12',
    fadeDuration: 1.2,
    padDuration: 0.6,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '08',
    inputs: ['Out Of The Barn.m4a'],
    out: '08-semi-out-of-the-barn.mp3',
    title: 'Out of the Barn',
    track: '8/12',
    fadeEndOffset: 1.5,
    fadeDuration: 0.9,
    padDuration: 0.25,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '09',
    inputs: ['Ghost.m4a'],
    out: '09-semi-ghost.mp3',
    title: 'Ghost',
    track: '9/12',
    fadeDuration: 1.2,
    padDuration: 0.5,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '10',
    inputs: ['Billion.m4a'],
    out: '10-semi-billion.mp3',
    title: 'Billion',
    track: '10/12',
    fadeDuration: 1.5,
    padDuration: 0.6,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '11',
    inputs: ["'86.m4a"],
    out: '11-semi-1986.mp3',
    title: '1986',
    track: '11/12',
    fadeEndOffset: 2.0,
    fadeDuration: 1.0,
    padDuration: 0.2,
    comment: 'From I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '12',
    inputs: ['I:.0m4a.m4a'],
    out: '12-semi-io.mp3',
    title: 'I/O',
    track: '12/12',
    fadeDuration: 1.8,
    padDuration: 0.85,
    comment: 'Closing Track · I/O (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  // Deluxe Edition Bonus Alternate Takes — sequenced at the end of the album (Tracks 13–15)
  {
    lyricsKey: '05b',
    deluxeSlug: '13-salt-in-the-rain-alternate-take',
    vaultDir: true,
    inputs: ['Salt in the Rain (Alternate Take).m4a'],
    out: '13-salt-in-the-rain-alt-c9f4e2a81b.mp3',
    title: 'Salt In The Rain (Alternate Take)',
    track: '13/15',
    fadeEndOffset: 1.3,
    fadeDuration: 1.0,
    padDuration: 0.4,
    comment: 'Bonus Track 13 · I/O Deluxe Edition · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '14',
    deluxeSlug: '14-localhost',
    vaultDir: true,
    inputs: ['Localhost.m4a', 'Localhost.wav', 'Localhost.mp3'],
    out: '14-localhost-9d4e21b83f.mp3',
    title: 'Localhost',
    track: '14/15',
    // Silence starts at 177.27s of 180.22s; gently taper final room decay and trim excessive silence
    fadeEndOffset: 1.6,
    fadeDuration: 1.1,
    padDuration: 0.4,
    comment: 'Bonus Track 14 · I/O Deluxe Edition · https://semi.colonhyphenbracket.pink',
  },
  {
    lyricsKey: '09b',
    deluxeSlug: '15-ghost-alternate-take',
    vaultDir: true,
    inputs: ['Ghost (alt take).m4a'],
    out: '15-ghost-alt-5e8b20f16d.mp3',
    title: 'Ghost (Alternate Take)',
    track: '15/15',
    fadeEndOffset: 1.5,
    fadeDuration: 1.0,
    padDuration: 0.5,
    comment: 'Bonus Track 15 · I/O Deluxe Edition · https://semi.colonhyphenbracket.pink',
  },
];

// Remove legacy publicly-exposed alternate takes from public/audio/ and retired vault files
for (const legacy of [
  path.join(AUDIO_DIR, '05b-semi-salt-in-the-rain-alternate-take.mp3'),
  path.join(AUDIO_DIR, '07b-semi-out-of-office-alternate-take.mp3'),
  path.join(AUDIO_DIR, '09b-semi-ghost-alternate-take.mp3'),
  path.join(DELUXE_VAULT_DIR, '14-out-of-office-alt-7a3d91e04c.mp3'),
]) {
  if (fs.existsSync(legacy)) {
    fs.unlinkSync(legacy);
  }
}

const verifiedLyrics = loadVerifiedLyricsMap();
const publicAudioSizes = {};
const deluxeAudioEntries = {};

for (const t of TRACKS) {
  const targetDir = t.vaultDir ? DELUXE_VAULT_DIR : AUDIO_DIR;
  const outPath = path.join(targetDir, t.out);
  if (!FORCE_AUDIO_REMASTER && fs.existsSync(outPath) && fs.statSync(outPath).size > 1_000_000) {
    console.log(`MP3 already staged: ${t.out}`);
  } else {
    const input = resolveSource(t.inputs);
    const dur = probeDurationSeconds(input);
    const fadeEnd = Math.max(1.0, dur - (t.fadeEndOffset ?? 0));
    const fadeDur = Math.min(t.fadeDuration ?? 1.2, fadeEnd - 0.5);
    const fadeStart = Math.max(0, fadeEnd - fadeDur);
    const fadeCurve = t.fadeCurve ?? 'qsin';
    const padDur = t.padDuration ?? 0.6;
    const audioFilter = `afade=t=out:st=${fadeStart.toFixed(3)}:d=${fadeDur.toFixed(3)}:curve=${fadeCurve},apad=pad_dur=${padDur.toFixed(2)}`;

    console.log(
      `Mastering ${path.basename(input)} -> ${t.out} (dur=${dur.toFixed(2)}s, fade=${fadeStart.toFixed(2)}s..${fadeEnd.toFixed(2)}s [${fadeCurve}], pad=${padDur}s)`
    );
    const coverPath = path.join(PHOTO_DIR, 'io-album-cover.jpg');
    const hasCover = fs.existsSync(coverPath);
    const trackLyrics = verifiedLyrics.get(t.lyricsKey) || '';

    runFfmpeg([
      '-i',
      input,
      ...(hasCover ? ['-i', coverPath] : []),
      '-map_metadata',
      '-1',
      '-map',
      '0:a',
      ...(hasCover
        ? [
            '-map',
            '1:v',
            '-c:v',
            'copy',
            '-disposition:v',
            'attached_pic',
            '-metadata:s:v',
            'title=Album cover',
            '-metadata:s:v',
            'comment=Cover (front)',
          ]
        : ['-vn']),
      '-af',
      audioFilter,
      '-codec:a',
      'libmp3lame',
      '-b:a',
      '320k',
      '-ar',
      '44100',
      '-id3v2_version',
      '3',
      '-metadata',
      `title=${t.title}`,
      '-metadata',
      'artist=Semi (; - ])',
      '-metadata',
      'album=I/O',
      '-metadata',
      'album_artist=Semi (; - ])',
      '-metadata',
      'disc=1/1',
      '-metadata',
      'compilation=0',
      '-metadata',
      'date=2026',
      '-metadata',
      `track=${t.track}`,
      '-metadata',
      'genre=Indie Folk',
      '-metadata',
      `comment=${t.comment}`,
      ...(trackLyrics ? ['-metadata', `lyrics-eng=${trackLyrics}`] : []),
      outPath,
    ]);
  }

  const size = fs.statSync(outPath).size;
  if (t.vaultDir) {
    deluxeAudioEntries[t.deluxeSlug] = {
      vaultFile: t.out,
      size,
      title: t.title,
      trackNumber: t.track.split('/')[0],
      downloadName: `${t.track.split('/')[0]} - ${t.title}.mp3`,
    };
  } else {
    publicAudioSizes[t.out] = size;
  }
}

const manifestPath = path.join(ROOT, 'src', 'data', 'audio-manifest.ts');
fs.writeFileSync(
  manifestPath,
  `// Auto-generated by scripts/prepare-media.mjs — exact byte lengths for HTTP 206 Partial Content streaming\n` +
    `export const AUDIO_MASTER_REV = 'io7';\n\n` +
    `export const PUBLIC_AUDIO_BYTE_SIZES: Record<string, number> = ${JSON.stringify(publicAudioSizes, null, 2)};\n\n` +
    `export interface DeluxeBonusManifestEntry {\n` +
    `  vaultFile: string;\n` +
    `  size: number;\n` +
    `  title: string;\n` +
    `  trackNumber: string;\n` +
    `  downloadName: string;\n` +
    `}\n\n` +
    `export const DELUXE_BONUS_MANIFEST: Record<string, DeluxeBonusManifestEntry> = ${JSON.stringify(deluxeAudioEntries, null, 2)};\n`,
  'utf8'
);

// 2. Build Rich Living Loops
const heroLoopOut = path.join(LOOP_DIR, 'hero-semi-alive.mp4');
if (!fs.existsSync(heroLoopOut)) {
  console.log('Building 3-shot Hero montage loop: hero-semi-alive.mp4');
  const heroClip1 = resolveSource(['Woman_smiling_at_camera_5a4d39ec_1080p.mp4']);
  const heroClip2 = resolveSource(['Woman_singing_at_vintage_microphone_0799e9f5.mp4']);
  const heroClip3 = resolveSource(['Woman_spinning_in_wildflower_meadow_8d9f1046_1080p.mp4']);

  runFfmpeg([
    '-ss', '00:00:01', '-t', '4', '-i', heroClip1,
    '-ss', '00:00:01', '-t', '4', '-i', heroClip2,
    '-ss', '00:00:01', '-t', '4', '-i', heroClip3,
    '-filter_complex',
    '[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v0];' +
      '[1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v1];' +
      '[2:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v2];' +
      '[v0][v1][v2]concat=n=3:v=1:a=0[v]',
    '-map', '[v]',
    '-an',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    heroLoopOut,
  ]);
}

const MONTAGE_LOOPS = [
  {
    out: 'song-01-oak-gate.mp4',
    clips: [
      ['Woman_opening_wooden_garden_gate_15fb1601_1080p.mp4'],
      ['Woman_standing_near_tree_8c2a51f1_1080p.mp4'],
      ['Woman_standing_overlooking_bay_9a6a0e1f_1080p.mp4'],
    ],
  },
  {
    out: 'song-02-firelight.mp4',
    clips: [
      ['Woman_smiling_in_firelight_06574390_1080p.mp4'],
      ['Woman_standing_on_snowy_porch_088b5a9a_1080p.mp4'],
      ['Woman_holding_glass_oil_lamp_ead34e32_1080p.mp4'],
    ],
  },
  {
    out: 'song-03-fountain-pen.mp4',
    clips: [
      ['Woman_writing_with_fountain_pen_fbe7f328_1080p.mp4'],
      ['Woman_opening_journal_in_bookstore_b9fcdf46_1080p.mp4'],
      ['Woman_inspecting_laptop_code_d224e0df_1080p.mp4'],
    ],
  },
  {
    out: 'song-04-keys.mp4',
    clips: [
      ['Woman_reveals_antique_brass_keys_d230c62d.mp4'],
      ['Woman_singing_in_observatory_dome_609cdfba.mp4'],
      ['Woman_standing_beside_harbor_lan*e1a3dd6f.mp4'],
    ],
  },
  {
    out: 'song-05-rain.mp4',
    clips: [
      ['Woman_singing_in_sunlit_rain_47a45420.mp4'],
      ['Woman_washing_ink_in_basin_ab97a032.mp4'],
      ['Woman_cleaning_mirror_at_vanity_992a60f4.mp4'],
    ],
  },
  {
    out: 'song-06-archway.mp4',
    clips: [
      ['Woman_standing_in_sunlit_archway_268125b1.mp4'],
      ['Woman_standing_by_church_window_56b3e700.mp4'],
      ['Woman_looking_over_valley_bc29c651.mp4'],
    ],
  },
  {
    out: 'song-07-laptop.mp4',
    clips: [
      ['Woman_closing_laptop_in_apartment_9e67548d_1080p.mp4'],
      ['Woman_walking_down_city_street_9ad2f828_1080p.mp4'],
      ['Woman_smiling_in_golden_meadow_521848ef.mp4'],
    ],
  },
  {
    out: 'song-08-barn.mp4',
    clips: [
      ['Woman_opening_barn_doors_a2375398_1080p.mp4'],
      ['Woman_smiling_in_white_dress_6bcd69ab_1080p.mp4'],
      ['Woman_playing_mandolin_on_porch_fcf64e3e_1080p.mp4'],
    ],
  },
  {
    out: 'song-09-ghost.mp4',
    clips: [
      ['Woman_standing_in_phone_booth_48a8af5a_1080p.mp4'],
      ['Woman_watching_through_rain-spec*5dfa7d2d_1080p.mp4'],
      ['Woman_playing_cello_smiling_3ef25648_1080p.mp4'],
    ],
  },
  {
    out: 'song-11-1986.mp4',
    clips: [
      ['Three_kids_drop_BMX_bikes_cca9b91d_1080p.mp4'],
      ['Woman_walking_in_neighborhood_lane_3b623a5e_1080p.mp4'],
      ['Woman_smiling_at_camera_ee45d458_1080p.mp4'],
    ],
  },
];

for (const m of MONTAGE_LOOPS) {
  const outPath = path.join(LOOP_DIR, m.out);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 50_000) {
    continue;
  }
  const c1 = resolveSource(m.clips[0]);
  const c2 = resolveSource(m.clips[1]);
  const c3 = resolveSource(m.clips[2]);
  console.log(`Building 3-shot montage loop -> ${m.out}`);
  runFfmpeg([
    '-ss', '00:00:01', '-t', '3.5', '-i', c1,
    '-ss', '00:00:01', '-t', '3.5', '-i', c2,
    '-ss', '00:00:01', '-t', '3.5', '-i', c3,
    '-filter_complex',
    '[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v0];' +
      '[1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v1];' +
      '[2:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v2];' +
      '[v0][v1][v2]concat=n=3:v=1:a=0[v]',
    '-map', '[v]',
    '-an',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outPath,
  ]);
}

const SINGLE_LOOPS = [
  { pattern: ['Woman_walking_with_lantern_river*1080p.mp4'], out: 'about-lantern-river.mp4' },
];

for (const l of SINGLE_LOOPS) {
  const outPath = path.join(LOOP_DIR, l.out);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 50_000) {
    continue;
  }
  const input = resolveSource(l.pattern);
  console.log(`Transcoding loop ${path.basename(input)} -> ${l.out}`);
  runFfmpeg([
    '-i', input,
    '-an',
    '-vf', "scale='min(1280,iw)':-2",
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outPath,
  ]);
}

// 3. Extract Distinct Non-Repeating High-Res Stills
const VIDEO_STILLS = [
  // Home Gallery (6 distinct frames)
  { pattern: ['Woman_spinning_in_wildflower_meadow_8d9f1046_1080p.mp4'], ts: '00:00:04', out: 'gallery-meadow-spin.jpg' },
  { pattern: ['Woman_singing_at_vintage_microphone_0799e9f5.mp4'], ts: '00:00:04', out: 'gallery-vintage-mic.jpg' },
  { pattern: ['Woman_holding_acoustic_guitar_on*1080p.mp4'], ts: '00:00:04', out: 'gallery-porch-guitar.jpg' },
  { pattern: ['Woman_walking_on_brick_sidewalk_46131fea_1080p.mp4'], ts: '00:00:04', out: 'gallery-brick-walk.jpg' },
  { pattern: ['Woman_smiling_at_river_beach_d456a7c5_1080p.mp4'], ts: '00:00:04', out: 'gallery-river-sunset.jpg' },
  { pattern: ['Woman_twirls_on_rooftop_terrace_6701dd05_1080p.mp4'], ts: '00:00:03', out: 'gallery-rooftop-twirl.jpg' },
  // Song 01 (Old Oak Tree)
  { pattern: ['Woman_standing_near_tree_8c2a51f1_1080p.mp4'], ts: '00:00:04', out: 'song-01-poster.jpg' },
  { pattern: ['Woman_standing_overlooking_bay_9a6a0e1f_1080p.mp4'], ts: '00:00:04', out: 'song-01-bay.jpg' },
  { pattern: ['Woman_holding_brass_key_29161fdc_1080p.mp4'], ts: '00:00:04', out: 'song-01-key.jpg' },
  { pattern: ['Woman_sliding_USB_drive_79f7f516_1080p.mp4'], ts: '00:00:04', out: 'song-01-usb.jpg' },
  // Song 02 (Warm Unknown)
  { pattern: ['Woman_standing_on_snowy_porch_088b5a9a_1080p.mp4'], ts: '00:00:04', out: 'song-02-poster.jpg' },
  { pattern: ['Woman_holding_glass_oil_lamp_ead34e32_1080p.mp4'], ts: '00:00:04', out: 'song-02-lamp.jpg' },
  { pattern: ['Woman_standing_in_morning_mist_fb5be7e4_1080p.mp4'], ts: '00:00:04', out: 'song-02-mist.jpg' },
  // Song 03 (Marks On The Screen, Ink On The Page)
  { pattern: ['Woman_opening_journal_in_bookstore_b9fcdf46_1080p.mp4'], ts: '00:00:04', out: 'song-03-poster.jpg' },
  { pattern: ['Woman_inspecting_laptop_code_d224e0df_1080p.mp4'], ts: '00:00:04', out: 'song-03-code.jpg' },
  { pattern: ['Code_terminal_displays_error*1080p.mp4'], ts: '00:00:03', out: 'song-03-terminal.jpg' },
  // Song 04 (Settle In The Block)
  { pattern: ['Woman_singing_in_observatory_dome_609cdfba.mp4'], ts: '00:00:03', out: 'song-04-poster.jpg' },
  { pattern: ['Woman_holding_obsidian_stone_in_c8c3b1f5.mp4'], ts: '00:00:03', out: 'song-04-obsidian.jpg' },
  { pattern: ['Woman_standing_beside_harbor_lan*e1a3dd6f.mp4'], ts: '00:00:03', out: 'song-04-anchor.jpg' },
  { pattern: ['Woman_holding_gold_ring_beside_90914460.mp4'], ts: '00:00:03', out: 'song-04-ring.jpg' },
  // Song 05 (Salt In The Rain)
  { pattern: ['Woman_singing_in_sunlit_rain_47a45420.mp4'], ts: '00:00:03', out: 'song-05-poster.jpg' },
  { pattern: ['Woman_washing_ink_in_basin_ab97a032.mp4'], ts: '00:00:03', out: 'song-05-ink-basin.jpg' },
  { pattern: ['Woman_cleaning_mirror_at_vanity_992a60f4.mp4'], ts: '00:00:03', out: 'song-05-mirror.jpg' },
  { pattern: ['Woman_tossing_leaves_into_fire_0c935d5c.mp4'], ts: '00:00:03', out: 'song-05-fire.jpg' },
  // Song 06 (No Human Hands Can Hold)
  { pattern: ['Woman_standing_in_sunlit_archway_268125b1.mp4'], ts: '00:00:03', out: 'song-06-poster.jpg' },
  { pattern: ['Woman_standing_by_church_window_56b3e700.mp4'], ts: '00:00:03', out: 'song-06-window.jpg' },
  { pattern: ['Candles_flickering_on_iron_stand_53356d55.mp4'], ts: '00:00:03', out: 'song-06-candles.jpg' },
  { pattern: ['Woman_looking_over_valley_bc29c651.mp4'], ts: '00:00:03', out: 'song-06-valley.jpg' },
  // Song 07 (Out of Office)
  { pattern: ['Woman_closing_laptop_in_apartment_9e67548d_1080p.mp4'], ts: '00:00:03', out: 'song-07-laptop.jpg' },
  { pattern: ['Woman_walking_down_city_street_9ad2f828_1080p.mp4'], ts: '00:00:02', out: 'song-07-sidewalk.jpg' },
  { pattern: ['Woman_smiling_in_golden_meadow_521848ef.mp4'], ts: '00:00:03', out: 'song-07-sunlight.jpg' },
  // Song 08 (Out of the Barn)
  { pattern: ['Woman_smiling_in_white_dress_6bcd69ab_1080p.mp4'], ts: '00:00:03', out: 'song-08-poster.jpg' },
  { pattern: ['Sunrise_over_farmland_and_barn_7ad6822c_1080p.mp4'], ts: '00:00:03', out: 'song-08-barn.jpg' },
  { pattern: ['Craftsman_picking_up_hammer_98af179e_1080p.mp4'], ts: '00:00:03', out: 'song-08-hammer.jpg' },
  { pattern: ['Farmer_scooping_rich_soil_413122ca_1080p.mp4'], ts: '00:00:03', out: 'song-08-soil.jpg' },
  // Song 09 (Ghost)
  { pattern: ['Woman_standing_in_phone_booth_48a8af5a_1080p.mp4'], ts: '00:00:03', out: 'song-09-poster.jpg' },
  { pattern: ['Woman_watching_through_rain-spec*5dfa7d2d_1080p.mp4'], ts: '00:00:03', out: 'song-09-glass.jpg' },
  { pattern: ['Hands_carving_maple_wood_shavings_6f1711a7_1080p.mp4'], ts: '00:00:04', out: 'song-09-chisel.jpg' },
  { pattern: ['Woman_playing_cello_smiling_3ef25648_1080p.mp4'], ts: '00:00:09', out: 'song-09-cello.jpg' },
  { pattern: ['Woman_smiling_looking_at_camera_3f6d3f08_1080p.mp4'], ts: '00:00:03.5', out: 'song-09-window.jpg' },
  // Song 11 (1986)
  { pattern: ['Woman_smiling_at_camera_ee45d458_1080p.mp4'], ts: '00:00:02.5', out: 'song-11-poster.jpg' },
  { pattern: ['Three_kids_drop_BMX_bikes_cca9b91d_1080p.mp4'], ts: '00:00:03', out: 'song-11-bikes.jpg' },
  { pattern: ['Classic_bicycle_leaning_on_porch_c7985ee6_1080p.mp4'], ts: '00:00:03', out: 'song-11-porch.jpg' },
  { pattern: ['Finger_pressing_cassette_play_bu*1080p.mp4'], ts: '00:00:02', out: 'song-11-cassette.jpg' },
];

for (const st of VIDEO_STILLS) {
  const outPath = path.join(PHOTO_DIR, st.out);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 20_000) {
    continue;
  }
  const input = resolveSource(st.pattern);
  console.log(`Extracting frame ${st.ts} from ${path.basename(input)} -> ${st.out}`);
  runFfmpeg([
    '-ss', st.ts,
    '-i', input,
    '-vf', "scale='min(1600,iw)':-2",
    '-q:v', '3',
    '-frames:v', '1',
    outPath,
  ]);
}

// Keep studio portraits for /about & Hero poster fallback
const STUDIO_PHOTOS = [
  { input: ['Woman_smiling_in_music_studio_6352047c_2K.jpg'], out: 'semi-studio-wide.jpg' },
  { input: ['Gemini_Generated_Image_uvj2oeuvj2oeuvj2.jpeg'], out: 'semi-closeup-eyes.jpg' },
  { input: ['Gemini_Generated_Image_oe35j1oe35j1oe35.jpeg'], out: 'semi-standing-linen.jpg' },
  { input: ['Woman_reading_notebook_by_window_aac9987d.jpg'], out: 'semi-notebook-window.jpg' },
  { input: ['Woman_looking_at_open_notebook_534ae3d3.jpg'], out: 'semi-coffee-journal.jpg' },
];

for (const p of STUDIO_PHOTOS) {
  const outPath = path.join(PHOTO_DIR, p.out);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 50_000) {
    continue;
  }
  const input = resolveSource(p.input);
  runFfmpeg([
    '-i', input,
    '-vf', "scale='min(1800,iw)':-2",
    '-q:v', '3',
    '-frames:v', '1',
    outPath,
  ]);
}

// Ensure og-semi.jpg exists
const ogOut = path.join(PUBLIC_DIR, 'og-semi.jpg');
if (!fs.existsSync(ogOut)) {
  runFfmpeg([
    '-i', path.join(PHOTO_DIR, 'semi-studio-wide.jpg'),
    '-vf', 'scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630',
    '-q:v', '3',
    '-frames:v', '1',
    ogOut,
  ]);
}

console.log('v2 Media preparation complete.');
