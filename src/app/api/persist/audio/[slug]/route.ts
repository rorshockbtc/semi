import fs from 'node:fs';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { PERSIST_AUDIO_MANIFEST } from '@/data/persist-songs';
import { DELUXE_COOKIE_NAME, verifyPurchaseToken } from '@/lib/album-purchases';
import { parseByteRange, sliceByteStream } from '../../../audio/[filename]/route';

export const dynamic = 'force-dynamic';

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

function extractToken(req: Request): string | null {
  const url = new URL(req.url);
  const qToken = url.searchParams.get('token')?.trim();
  if (qToken) return qToken;

  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }

  const cookieHeader = req.headers.get('cookie') || '';
  const match = new RegExp(`(?:^|;\\s*)${DELUXE_COOKIE_NAME}=([^;]+)`).exec(cookieHeader);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Stream-only, Deluxe-gated audio endpoint for Semi's second album, `Persist`.
 * - Validates I/O Deluxe Edition ownership (paid purchase OR `trypipesdotpink` code redemption).
 * - Never emits `Content-Disposition: attachment` — strictly inline streaming only.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = PERSIST_AUDIO_MANIFEST[slug];
  if (!entry) {
    return new Response('Persist track not found', { status: 404 });
  }

  const token = extractToken(request);
  const authCheck = await verifyPurchaseToken(token);
  if (!authCheck.valid) {
    return new Response(
      'I/O Deluxe Edition access required to stream Persist tracks',
      { status: 401 }
    );
  }

  const rangeHeader = request.headers.get('range');
  const assets = await getAssetsBinding();

  const streamHeadersBase = {
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Content-Disposition': 'inline',
    'Cache-Control': 'private, max-age=3600, no-transform',
    'X-Content-Type-Options': 'nosniff',
    Vary: 'Range, Cookie',
  };

  if (assets) {
    const assetUrl = new URL(`/persist-vault/${entry.vaultFile}`, request.url);
    const upstreamHeaders: Record<string, string> = { 'Accept-Encoding': 'identity' };
    if (rangeHeader) upstreamHeaders.Range = rangeHeader;

    const res = await assets.fetch(new Request(assetUrl.toString(), { headers: upstreamHeaders }));
    if (!res.ok && res.status !== 206) {
      return new Response('Persist audio asset missing', { status: 404 });
    }

    if (rangeHeader && res.status === 206 && res.headers.get('content-range')) {
      return new Response(res.body, {
        status: 206,
        headers: {
          ...streamHeadersBase,
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
          ...streamHeadersBase,
          'Content-Length': String(totalSize),
        },
      });
    }

    const parsed = parseByteRange(rangeHeader, totalSize);
    if (!parsed || parsed === 'invalid') {
      return new Response('Requested Range Not Satisfiable', {
        status: 416,
        headers: { 'Content-Range': `bytes */${totalSize}` },
      });
    }

    const sliced = sliceByteStream(res.body, parsed.start, parsed.end);
    return new Response(sliced, {
      status: 206,
      headers: {
        ...streamHeadersBase,
        'Content-Range': `bytes ${parsed.start}-${parsed.end}/${totalSize}`,
        'Content-Length': String(parsed.end - parsed.start + 1),
      },
    });
  }

  // Local Node.js dev / test fallback
  const localPath = path.join(process.cwd(), 'public', 'persist-vault', entry.vaultFile);
  if (!fs.existsSync(localPath)) {
    return new Response('Persist audio asset not found on disk', { status: 404 });
  }

  const stat = fs.statSync(localPath);
  const totalSize = stat.size;

  if (rangeHeader) {
    const parsed = parseByteRange(rangeHeader, totalSize);
    if (!parsed || parsed === 'invalid') {
      return new Response('Requested Range Not Satisfiable', {
        status: 416,
        headers: { 'Content-Range': `bytes */${totalSize}` },
      });
    }
    const { start, end } = parsed;
    const chunkSize = end - start + 1;
    const fd = fs.openSync(localPath, 'r');
    const buf = Buffer.alloc(chunkSize);
    fs.readSync(fd, buf, 0, chunkSize, start);
    fs.closeSync(fd);

    return new Response(buf, {
      status: 206,
      headers: {
        ...streamHeadersBase,
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Content-Length': String(chunkSize),
      },
    });
  }

  const buf = fs.readFileSync(localPath);
  return new Response(buf, {
    status: 200,
    headers: {
      ...streamHeadersBase,
      'Content-Length': String(totalSize),
    },
  });
}

export async function HEAD(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = PERSIST_AUDIO_MANIFEST[slug];
  if (!entry) return new Response(null, { status: 404 });

  const token = extractToken(request);
  const authCheck = await verifyPurchaseToken(token);
  if (!authCheck.valid) return new Response(null, { status: 401 });

  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Content-Length': String(entry.size),
      'Content-Disposition': 'inline',
      'Cache-Control': 'private, max-age=3600, no-transform',
    },
  });
}
