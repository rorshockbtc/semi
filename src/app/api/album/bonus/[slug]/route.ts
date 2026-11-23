import fs from 'node:fs';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { DELUXE_BONUS_MANIFEST } from '../../../../../data/audio-manifest.ts';
import { DELUXE_COOKIE_NAME, verifyPurchaseToken } from '../../../../../lib/album-purchases.ts';
import { parseByteRange, sliceByteStream } from '../../../audio/[filename]/route.ts';

export const dynamic = 'force-dynamic';

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = DELUXE_BONUS_MANIFEST[slug];
  if (!entry) {
    return new Response('Bonus track not found', { status: 404 });
  }

  const token = extractToken(request);
  const authCheck = await verifyPurchaseToken(token);
  if (!authCheck.valid) {
    return new Response('Purchase required to access I/O Deluxe bonus tracks', { status: 401 });
  }

  const rangeHeader = request.headers.get('range');
  const assets = await getAssetsBinding();

  if (assets) {
    const assetUrl = new URL(`/deluxe-vault/${entry.vaultFile}`, request.url);
    const upstreamHeaders: Record<string, string> = { 'Accept-Encoding': 'identity' };
    if (rangeHeader) upstreamHeaders.Range = rangeHeader;

    const res = await assets.fetch(new Request(assetUrl.toString(), { headers: upstreamHeaders }));
    if (!res.ok && res.status !== 206) {
      return new Response('Bonus audio asset missing', { status: 404 });
    }

    if (rangeHeader && res.status === 206 && res.headers.get('content-range')) {
      return new Response(res.body, {
        status: 206,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Accept-Ranges': 'bytes',
          'Content-Range': res.headers.get('content-range')!,
          ...(res.headers.get('content-length')
            ? { 'Content-Length': res.headers.get('content-length')! }
            : {}),
          'Cache-Control': 'private, max-age=3600, no-transform',
          Vary: 'Range, Cookie',
        },
      });
    }

    const totalSize = Number(res.headers.get('content-length') ?? '0') || entry.size;
    if (!rangeHeader || !res.body) {
      return new Response(res.body, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': String(totalSize),
          'Accept-Ranges': 'bytes',
          'Content-Disposition': `attachment; filename="${entry.downloadName}"`,
          'Cache-Control': 'private, max-age=3600, no-transform',
          Vary: 'Range, Cookie',
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
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(chunkSize),
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=3600, no-transform',
        Vary: 'Range, Cookie',
      },
    });
  }

  // Local dev fallback
  const localPath = path.join(process.cwd(), 'public', 'deluxe-vault', entry.vaultFile);
  if (!fs.existsSync(localPath)) {
    return new Response('Bonus audio asset missing', { status: 404 });
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
        'Content-Disposition': `attachment; filename="${entry.downloadName}"`,
        'Cache-Control': 'private, no-cache, no-transform',
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
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(chunkSize),
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, no-cache, no-transform',
    },
  });
}
