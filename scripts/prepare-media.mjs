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

function resolveExisting(candidates) {
  for (const name of candidates) {
    const full = path.join(DOWNLOADS, name);
    if (fs.existsSync(full)) return full;
  }
  throw new Error(`Missing source file in ${DOWNLOADS}: ${candidates.join(', ')}`);
}

// 1. Transcode 320kbps MP3 masters with clean ID3v2 tags
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
  const input = resolveExisting(t.inputs);
  const outPath = path.join(AUDIO_DIR, t.out);
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
    'artist=Semi (;-])',
    '-metadata',
    'album=Local Current (The West Nashville Sessions)',
    '-metadata',
    'album_artist=Semi (;-])',
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

// 2. Optimize photography plates (max width 1800px, quality ~86)
const PHOTOS = [
  {
    input: 'Woman_smiling_in_music_studio_6352047c_2K.jpg',
    out: 'semi-studio-wide.jpg',
  },
  {
    input: 'Gemini_Generated_Image_uvj2oeuvj2oeuvj2.jpeg',
    out: 'semi-closeup-eyes.jpg',
  },
  {
    input: 'Gemini_Generated_Image_oe35j1oe35j1oe35.jpeg',
    out: 'semi-standing-linen.jpg',
  },
  {
    input: 'Woman_reading_notebook_by_window_aac9987d.jpg',
    out: 'semi-notebook-window.jpg',
  },
  {
    input: 'Woman_looking_at_open_notebook_534ae3d3.jpg',
    out: 'semi-coffee-journal.jpg',
  },
];

for (const p of PHOTOS) {
  const input = resolveExisting([p.input]);
  const outPath = path.join(PHOTO_DIR, p.out);
  console.log(`Optimizing ${p.input} -> ${p.out}`);
  runFfmpeg([
    '-i',
    input,
    '-vf',
    "scale='min(1800,iw)':-2",
    '-q:v',
    '3',
    '-frames:v',
    '1',
    outPath,
  ]);
}

// Generate 1200x630 Open Graph plate from studio wide
const studioWide = path.join(PHOTO_DIR, 'semi-studio-wide.jpg');
const ogOut = path.join(PUBLIC_DIR, 'og-semi.jpg');
console.log('Generating public/og-semi.jpg (1200x630)...');
runFfmpeg([
  '-i',
  studioWide,
  '-vf',
  'scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630',
  '-q:v',
  '3',
  '-frames:v',
  '1',
  ogOut,
]);

// 3. Transcode lightweight silent ambient H.264 MP4 loops
const LOOPS = [
  {
    input: 'Woman_playing_acoustic_guitar_45486dc0.mp4',
    out: 'semi-guitar-loop.mp4',
  },
  {
    input: 'Woman_holding_lantern_in_garden_cdffbe8b.mp4',
    out: 'semi-lantern-loop.mp4',
  },
  {
    input: 'Woman_holding_letters_13bd5dc9.mp4',
    out: 'semi-letters-loop.mp4',
  },
];

for (const l of LOOPS) {
  const input = resolveExisting([l.input]);
  const outPath = path.join(LOOP_DIR, l.out);
  console.log(`Transcoding ambient loop ${l.input} -> ${l.out}`);
  runFfmpeg([
    '-i',
    input,
    '-an',
    '-vf',
    "scale='min(1280,iw)':-2",
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '26',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    outPath,
  ]);
}

console.log('Media preparation complete.');
