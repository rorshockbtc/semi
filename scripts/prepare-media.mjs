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

for (const dir of [AUDIO_DIR, PHOTO_DIR, LOOP_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

if (!ffmpegPath) {
  throw new Error('ffmpeg-static binary not found');
}

function runFfmpeg(args) {
  execFileSync(ffmpegPath, ['-y', ...args], { stdio: 'inherit' });
}

const downloadEntries = fs.readdirSync(DOWNLOADS);

function resolveSource(patterns) {
  for (const pat of patterns) {
    const exact = path.join(DOWNLOADS, pat);
    if (fs.existsSync(exact)) return exact;
    const prefix = pat.replace(/\*.*$/, '');
    const suffix = pat.includes('*') ? pat.split('*').pop() : '';
    const found = downloadEntries.find(
      (name) => name.startsWith(prefix) && (!suffix || name.endsWith(suffix))
    );
    if (found) return path.join(DOWNLOADS, found);
  }
  throw new Error(`Missing source file in ${DOWNLOADS}: ${patterns.join(', ')}`);
}

// 1. Ensure 320kbps MP3 masters with clean ID3v2 tags exist
const TRACKS = [
  {
    inputs: ['Local Current (Sung Outro).m4a'],
    out: '01-semi-old-oak-tree.mp3',
    title: 'Old Oak Tree',
    track: '1/9',
    comment: 'From Local Current (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    inputs: ['Warm Unknown.m4a'],
    out: '02-semi-warm-unknown.mp3',
    title: 'Warm Unknown',
    track: '2/9',
    comment: 'From Local Current (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
  {
    inputs: ['Fixed Final Chorus and Outro.wav', 'Fixed Final Chorus and Outro.m4a'],
    out: '03-semi-marks-on-the-screen-ink-on-the-page.mp3',
    title: 'Marks On The Screen, Ink On The Page',
    track: '3/9',
    comment: 'From Local Current (The West Nashville Sessions) · https://semi.colonhyphenbracket.pink',
  },
];

for (const t of TRACKS) {
  const outPath = path.join(AUDIO_DIR, t.out);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1_000_000) {
    console.log(`MP3 already staged: ${t.out}`);
    continue;
  }
  const input = resolveSource(t.inputs);
  console.log(`Transcoding ${path.basename(input)} -> ${t.out}`);
  runFfmpeg([
    '-i',
    input,
    '-vn',
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
    'album=Local Current (The West Nashville Sessions)',
    '-metadata',
    'album_artist=Semi (; - ])',
    '-metadata',
    'date=2026',
    '-metadata',
    `track=${t.track}`,
    '-metadata',
    'genre=Indie Folk',
    '-metadata',
    `comment=${t.comment}`,
    outPath,
  ]);
}

// 2. Build 5 Rich Living Loops
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
  path.join(LOOP_DIR, 'hero-semi-alive.mp4'),
]);

const SINGLE_LOOPS = [
  { pattern: ['Woman_opening_wooden_garden_gate_15fb1601_1080p.mp4'], out: 'song-01-oak-gate.mp4' },
  { pattern: ['Woman_smiling_in_firelight_06574390_1080p.mp4'], out: 'song-02-firelight.mp4' },
  { pattern: ['Woman_writing_with_fountain_pen_fbe7f328_1080p.mp4'], out: 'song-03-fountain-pen.mp4' },
  { pattern: ['Woman_walking_with_lantern_river*1080p.mp4'], out: 'about-lantern-river.mp4' },
];

for (const l of SINGLE_LOOPS) {
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
    path.join(LOOP_DIR, l.out),
  ]);
}

// 3. Extract 16 Distinct Non-Repeating High-Res Stills
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
];

for (const st of VIDEO_STILLS) {
  const input = resolveSource(st.pattern);
  console.log(`Extracting frame ${st.ts} from ${path.basename(input)} -> ${st.out}`);
  runFfmpeg([
    '-ss', st.ts,
    '-i', input,
    '-vf', "scale='min(1600,iw)':-2",
    '-q:v', '3',
    '-frames:v', '1',
    path.join(PHOTO_DIR, st.out),
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
