import fs from 'node:fs';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { PUBLIC_AUDIO_BYTE_SIZES } from '../../../../data/audio-manifest.ts';

export const dynamic = 'force-dynamic';

// Only serve the 12 commercial tracks publicly (01 through 12); bonus takes live in /api/album/bonus/[slug]
const VALID_FILENAME_RE = /^(0[1-9]|1[0-2])-semi-[a-z0-9-]+\.mp3$/;
const CACHE_CONTROL =
  process.env.NODE_ENV === 'development'
    ? 'no-cache, no-transform'
    : 'public, max-age=3600, stale-while-revalidate=86400, no-transform';

type AssetsBinding = {
  fetch: (req: Request | string) => Promise<Response>;
};

async function getAssetsBinding(): Promise<AssetsBinding | null> {
  if (typeof navigator === 'undefined' || navigator.userAgent !== 'Cloudflare-Workers') {
    return null;
  }
  try {
    const ctx = await getCloudflareContext({ async: true });
    const env = ctx?.env as { ASSETS?: AssetsBinding } | undefined;
    return env?.ASSETS ?? null;
  } catch {
    return null;
  }
}

function resolveLocalAudioPath(filename: string): string | null {
  try {
    const localPath = path.join(process.cwd(), 'public', 'audio', filename);
    if (fs.existsSync(localPath)) {
      return localPath;
    }
  } catch {
    // Local filesystem unavailable on edge runtime
  }
  return null;
}

export function parseByteRange(
  rangeHeader: string,
  totalSize: number
): { start: number; end: number } | 'invalid' {
  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!match) return 'invalid';

  let start = match[1] ? parseInt(match[1], 10) : NaN;
  let end = match[2] ? parseInt(match[2], 10) : NaN;

  if (Number.isNaN(start) && Number.isNaN(end)) {
    return 'invalid';
  }

  if (Number.isNaN(start)) {
    start = Math.max(0, totalSize - end);
    end = totalSize - 1;
  } else if (Number.isNaN(end)) {
    end = totalSize - 1;
  }

  if (start >= totalSize) {
    return 'invalid';
  }

  start = Math.max(0, start);
  end = Math.max(start, Math.min(end, totalSize - 1));
  return { start, end };
}

export function sliceByteStream(
  body: ReadableStream<Uint8Array>,
  start: number,
  end: number
): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  let offset = 0;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        const chunkStart = offset;
        const chunkEnd = offset + value.byteLength - 1;
        offset += value.byteLength;

        if (chunkEnd < start) {
          continue;
        }

        const sliceFrom = Math.max(0, start - chunkStart);
        const sliceTo = Math.min(value.byteLength, end - chunkStart + 1);
        if (sliceTo > sliceFrom) {
          controller.enqueue(value.subarray(sliceFrom, sliceTo));
        }

        if (chunkEnd >= end) {
          await reader.cancel().catch(() => {});
          controller.close();
          return;
        }
        return;
      }
    },
    cancel() {
      return reader.cancel().catch(() => {});
    },
  });
}

function rangeErrorResponse(totalSize: number): Response {
  return new Response(null, {
    status: 416,
    headers: {
      'Content-Range': `bytes */${totalSize}`,
      'Accept-Ranges': 'bytes',
      Vary: 'Range',
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!VALID_FILENAME_RE.test(filename)) {
    return new Response('Invalid audio filename', { status: 400 });
  }

  const rangeHeader = request.headers.get('range');
  const assets = await getAssetsBinding();

  if (assets) {
    const assetUrl = new URL(`/audio/${filename}`, request.url);
    const upstreamHeaders: Record<string, string> = {
      'Accept-Encoding': 'identity',
    };
    if (rangeHeader) {
      upstreamHeaders.Range = rangeHeader;
    }

    const res = await assets.fetch(
      new Request(assetUrl.toString(), { headers: upstreamHeaders })
    );

    if (!res.ok && res.status !== 206) {
      return new Response('Audio file not found', { status: 404 });
    }

    // If Cloudflare ASSETS natively returned a valid 206 with Content-Range, pass it through
    if (rangeHeader && res.status === 206 && res.headers.get('content-range')) {
      const headers = new Headers();
      headers.set('Content-Type', 'audio/mpeg');
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Content-Range', res.headers.get('content-range')!);
      if (res.headers.get('content-length')) {
        headers.set('Content-Length', res.headers.get('content-length')!);
      }
      headers.set('Cache-Control', CACHE_CONTROL);
      headers.set('Vary', 'Range');
      return new Response(res.body, { status: 206, headers });
    }

    const totalSize =
      Number(res.headers.get('content-length') ?? '0') ||
      PUBLIC_AUDIO_BYTE_SIZES[filename] ||
      0;

    if (!rangeHeader || !totalSize || !res.body) {
      const headers = new Headers();
      headers.set('Content-Type', 'audio/mpeg');
      headers.set('Accept-Ranges', 'bytes');
      if (totalSize > 0) {
        headers.set('Content-Length', String(totalSize));
      }
      headers.set('Cache-Control', CACHE_CONTROL);
      headers.set('Vary', 'Range');
      return new Response(res.body, { status: 200, headers });
    }

    const parsed = parseByteRange(rangeHeader, totalSize);
    if (parsed === 'invalid') {
      await res.body.cancel().catch(() => {});
      return rangeErrorResponse(totalSize);
    }

    const { start, end } = parsed;
    const chunkSize = end - start + 1;
    return new Response(sliceByteStream(res.body, start, end), {
      status: 206,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(chunkSize),
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': CACHE_CONTROL,
        Vary: 'Range',
      },
    });
  }

  // Local filesystem fallback (next dev / next start / contract tests)
  const localPath = resolveLocalAudioPath(filename);
  if (!localPath) {
    return new Response('Audio file not found', { status: 404 });
  }

  const totalSize = fs.statSync(localPath).size;
  if (!rangeHeader) {
    const stream = fs.createReadStream(localPath);
    return new Response(stream as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(totalSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': CACHE_CONTROL,
        Vary: 'Range',
      },
    });
  }

  const parsed = parseByteRange(rangeHeader, totalSize);
  if (parsed === 'invalid') {
    return rangeErrorResponse(totalSize);
  }

  const { start, end } = parsed;
  const chunkSize = end - start + 1;
  const chunk = Buffer.allocUnsafe(chunkSize);
  const fd = fs.openSync(localPath, 'r');
  try {
    fs.readSync(fd, chunk, 0, chunkSize, start);
  } finally {
    fs.closeSync(fd);
  }

  return new Response(chunk, {
    status: 206,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(chunkSize),
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': CACHE_CONTROL,
      Vary: 'Range',
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

  const assets = await getAssetsBinding();
  if (assets) {
    const assetUrl = new URL(`/audio/${filename}`, request.url);
    const res = await assets.fetch(
      new Request(assetUrl.toString(), {
        method: 'HEAD',
        headers: { 'Accept-Encoding': 'identity' },
      })
    );
    if (!res.ok) {
      return new Response(null, { status: 404 });
    }
    const totalSize =
      Number(res.headers.get('content-length') ?? '0') ||
      PUBLIC_AUDIO_BYTE_SIZES[filename] ||
      0;
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Accept-Ranges', 'bytes');
    if (totalSize > 0) {
      headers.set('Content-Length', String(totalSize));
    }
    headers.set('Cache-Control', CACHE_CONTROL);
    headers.set('Vary', 'Range');
    return new Response(null, { status: 200, headers });
  }

  const localPath = resolveLocalAudioPath(filename);
  if (!localPath) {
    return new Response(null, { status: 404 });
  }

  const totalSize = fs.statSync(localPath).size;
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(totalSize),
      'Accept-Ranges': 'bytes',
      'Cache-Control': CACHE_CONTROL,
      Vary: 'Range',
    },
  });
}
