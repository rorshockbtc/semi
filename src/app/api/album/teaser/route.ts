import fs from 'node:fs';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { DELUXE_BONUS_MANIFEST } from '../../../../data/audio-manifest.ts';
import { parseByteRange, sliceByteStream } from '../../audio/[filename]/route.ts';

export const dynamic = 'force-dynamic';

const TEASER_SLUG = '14-localhost';

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

export async function GET(request: Request) {
  const entry = DELUXE_BONUS_MANIFEST[TEASER_SLUG];
  if (!entry) {
    return new Response('Teaser track not found', { status: 404 });
  }

  // Stream-only preview: block direct top-level browser tab / Save-Link-As navigation
  const fetchDest = (request.headers.get('sec-fetch-dest') || '').toLowerCase();
  if (fetchDest === 'document' || fetchDest === 'iframe') {
    return new Response(
      'Stream-only preview — unlock the I/O Deluxe Edition ($12.99) to download Localhost in 320 kbps MP3.',
      {
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'private, no-store',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      }
    );
  }

  const rangeHeader = request.headers.get('range');
  const assets = await getAssetsBinding();

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Content-Disposition': 'inline',
    'Cache-Control': 'private, no-store, no-transform',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    Vary: 'Range, Sec-Fetch-Dest',
  };

  if (assets) {
    const assetUrl = new URL(`/deluxe-vault/${entry.vaultFile}`, request.url);
    const upstreamHeaders: Record<string, string> = { 'Accept-Encoding': 'identity' };
    if (rangeHeader) upstreamHeaders.Range = rangeHeader;

    const res = await assets.fetch(new Request(assetUrl.toString(), { headers: upstreamHeaders }));
    if (!res.ok && res.status !== 206) {
      return new Response('Teaser audio asset missing', { status: 404 });
    }

    if (rangeHeader && res.status === 206 && res.headers.get('content-range')) {
      return new Response(res.body, {
        status: 206,
        headers: {
          ...baseHeaders,
          'Content-Range': res.headers.get('content-range')!,
          ...(res.headers.get('content-length')
            ? { 'Content-Length': res.headers.get('content-length')! }
            : {}),
        },
      });
    }

    const totalSize = Number(res.headers.get('content-length') ?? '0') || entry.size;
    if (!rangeHeader || !res.body) {
      return new Response(res.body, {
        status: 200,
        headers: {
          ...baseHeaders,
          'Content-Length': String(totalSize),
        },
      });
    }

    const parsed = parseByteRange(rangeHeader, totalSize);
    if (parsed === 'invalid') {
      await res.body.cancel().catch(() => {});
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${totalSize}`, 'Accept-Ranges': 'bytes' },
      });
    }

    const { start, end } = parsed;
    const chunkSize = end - start + 1;
    return new Response(sliceByteStream(res.body, start, end), {
      status: 206,
      headers: {
        ...baseHeaders,
        'Content-Length': String(chunkSize),
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      },
    });
  }

  // Local Node / test fallback
  const localPath = path.join(process.cwd(), 'public', 'deluxe-vault', entry.vaultFile);
  if (!fs.existsSync(localPath)) {
    return new Response('Teaser audio asset missing', { status: 404 });
  }

  const totalSize = fs.statSync(localPath).size;
  if (!rangeHeader) {
    const stream = fs.createReadStream(localPath);
    return new Response(stream as unknown as BodyInit, {
      status: 200,
      headers: {
        ...baseHeaders,
        'Content-Length': String(totalSize),
      },
    });
  }

  const parsed = parseByteRange(rangeHeader, totalSize);
  if (parsed === 'invalid') {
    return new Response(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${totalSize}`, 'Accept-Ranges': 'bytes' },
    });
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
      ...baseHeaders,
      'Content-Length': String(chunkSize),
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
    },
  });
}
