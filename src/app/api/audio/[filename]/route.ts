import fs from 'node:fs';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

const VALID_FILENAME_RE = /^[a-zA-Z0-9_.-]+\.mp3$/;
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

type AssetsBinding = {
  fetch: (req: Request | string) => Promise<Response>;
};

async function getAssetsBinding(): Promise<AssetsBinding | null> {
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

function parseByteRange(
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

  start = Math.max(0, Math.min(start, totalSize - 1));
  end = Math.max(start, Math.min(end, totalSize - 1));
  return { start, end };
}

function sliceByteStream(
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
    const res = await assets.fetch(
      new Request(assetUrl.toString(), {
        headers: rangeHeader ? { Range: rangeHeader } : undefined,
      })
    );

    if (!res.ok && res.status !== 206) {
      return new Response('Audio file not found', { status: 404 });
    }

    if (!rangeHeader || res.status === 206) {
      const headers = new Headers(res.headers);
      headers.set('Content-Type', 'audio/mpeg');
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Cache-Control', CACHE_CONTROL);
      return new Response(res.body, { status: res.status, headers });
    }

    const totalSize = Number(res.headers.get('content-length') ?? '0');
    if (!totalSize || !res.body) {
      const headers = new Headers(res.headers);
      headers.set('Content-Type', 'audio/mpeg');
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Cache-Control', CACHE_CONTROL);
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
    const fileBytes = fs.readFileSync(localPath);
    return new Response(fileBytes, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(totalSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': CACHE_CONTROL,
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
    const res = await assets.fetch(new Request(assetUrl.toString(), { method: 'HEAD' }));
    if (!res.ok) {
      return new Response(null, { status: 404 });
    }
    const headers = new Headers(res.headers);
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', CACHE_CONTROL);
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
    },
  });
}
