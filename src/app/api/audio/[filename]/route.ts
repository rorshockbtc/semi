import fs from 'node:fs';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

const AUDIO_CACHE = new Map<string, Uint8Array>();

const VALID_FILENAME_RE = /^[a-zA-Z0-9_.-]+\.mp3$/;

async function getAudioBuffer(filename: string, originUrl: string): Promise<Uint8Array | null> {
  if (AUDIO_CACHE.has(filename)) {
    return AUDIO_CACHE.get(filename)!;
  }

  // 1. Try Cloudflare Workers ASSETS binding
  try {
    const ctx = await getCloudflareContext({ async: true });
    const env = ctx?.env as { ASSETS?: { fetch: (req: Request | string) => Promise<Response> } } | undefined;
    if (env?.ASSETS) {
      const assetUrl = new URL(`/audio/${filename}`, originUrl);
      const res = await env.ASSETS.fetch(new Request(assetUrl.toString()));
      if (res.ok) {
        const buf = new Uint8Array(await res.arrayBuffer());
        AUDIO_CACHE.set(filename, buf);
        return buf;
      }
    }
  } catch {
    // Not running on Cloudflare Workers
  }

  // 2. Local filesystem fallback (next dev / next start)
  try {
    const localPath = path.join(process.cwd(), 'public', 'audio', filename);
    if (fs.existsSync(localPath)) {
      const buf = new Uint8Array(fs.readFileSync(localPath));
      AUDIO_CACHE.set(filename, buf);
      return buf;
    }
  } catch {
    // Filesystem error
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!VALID_FILENAME_RE.test(filename)) {
    return new Response('Invalid audio filename', { status: 400 });
  }

  const fileBytes = await getAudioBuffer(filename, request.url);
  if (!fileBytes) {
    return new Response('Audio file not found', { status: 404 });
  }

  const totalSize = fileBytes.byteLength;
  const rangeHeader = request.headers.get('range');

  if (!rangeHeader) {
    return new Response(fileBytes as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(totalSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!match) {
    return new Response(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${totalSize}`,
        'Accept-Ranges': 'bytes',
      },
    });
  }

  let start = match[1] ? parseInt(match[1], 10) : NaN;
  let end = match[2] ? parseInt(match[2], 10) : NaN;

  if (isNaN(start) && isNaN(end)) {
    return new Response(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${totalSize}`,
        'Accept-Ranges': 'bytes',
      },
    });
  }

  if (isNaN(start)) {
    // Suffix range: bytes=-500 means last 500 bytes
    start = Math.max(0, totalSize - end);
    end = totalSize - 1;
  } else if (isNaN(end)) {
    // Prefix range: bytes=1000- means from 1000 to end
    end = totalSize - 1;
  }

  start = Math.max(0, Math.min(start, totalSize - 1));
  end = Math.max(start, Math.min(end, totalSize - 1));

  const chunkSize = end - start + 1;
  const chunk = fileBytes.subarray(start, end + 1);

  return new Response(chunk as unknown as BodyInit, {
    status: 206,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(chunkSize),
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

export async function HEAD(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!VALID_FILENAME_RE.test(filename)) {
    return new Response(null, { status: 400 });
  }

  const fileBytes = await getAudioBuffer(filename, request.url);
  if (!fileBytes) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(fileBytes.byteLength),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
