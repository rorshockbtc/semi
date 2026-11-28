import fs from 'node:fs';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { PERSIST_AUDIO_MANIFEST } from '@/data/persist-songs';
import { SEMI_TRACKS } from '@/data/semi-songs';
import { LISTEN_PASS_COOKIE_NAME, verifyDeviceStreamToken } from '@/lib/listen-pass';
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

function extractStreamToken(req: Request): string | null {
  const url = new URL(req.url);
  const qToken = url.searchParams.get('token')?.trim();
  if (qToken) return qToken;

  const cookieHeader = req.headers.get('cookie') || '';
  const match = new RegExp(`(?:^|;\\s*)${LISTEN_PASS_COOKIE_NAME}=([^;]+)`).exec(cookieHeader);
  return match ? decodeURIComponent(match[1]) : null;
}

function resolveAudioAsset(slug: string): { assetPath: string; diskPath: string } | null {
  const persistEntry = PERSIST_AUDIO_MANIFEST[slug];
  if (persistEntry) {
    return {
      assetPath: `/persist-vault/${persistEntry.vaultFile}`,
      diskPath: path.join(process.cwd(), 'public', 'persist-vault', persistEntry.vaultFile),
    };
  }

  const ioTrack = SEMI_TRACKS.find((t) => t.slug === slug && t.mp3Src);
  if (ioTrack?.mp3Src) {
    const filename = ioTrack.mp3Src.replace(/^\/api\/audio\//, '').split('?')[0];
    if (filename) {
      return {
        assetPath: `/audio/${filename}`,
        diskPath: path.join(process.cwd(), 'public', 'audio', filename),
      };
    }
  }

  return null;
}

/**
 * Strictly online, stream-only audio endpoint for Physical Distribution Listening Passes.
 * - Requires a valid device-bound stream token.
 * - Uses `Cache-Control: no-store, no-cache, must-revalidate` so playback depends on an active internet connection.
 * - Uses `Content-Disposition: inline` — never triggers file downloads.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const resolved = resolveAudioAsset(slug);
  if (!resolved) {
    return new Response('Track not found', { status: 404 });
  }

  const token = extractStreamToken(request);
  const check = await verifyDeviceStreamToken(token);
  if (!check.valid) {
    return new Response('Active listening pass required to stream', { status: 401 });
  }

  const rangeHeader = request.headers.get('range');
  const assets = await getAssetsBinding();

  const streamHeadersBase = {
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Content-Disposition': 'inline',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    Pragma: 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    Vary: 'Range, Cookie',
  };

  if (assets) {
    const assetUrl = new URL(resolved.assetPath, request.url);
    const upstreamHeaders: Record<string, string> = { 'Accept-Encoding': 'identity' };
    if (rangeHeader) upstreamHeaders.Range = rangeHeader;

    const res = await assets.fetch(new Request(assetUrl.toString(), { headers: upstreamHeaders }));
    if (!res.ok && res.status !== 206) {
      return new Response('Audio asset missing', { status: 404 });
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

    if (rangeHeader && res.body) {
      const totalLength = Number(res.headers.get('content-length') || '0');
      if (totalLength > 0) {
        const range = parseByteRange(rangeHeader, totalLength);
        if (!range || range === 'invalid') {
          return new Response('Requested Range Not Satisfiable', {
            status: 416,
            headers: { 'Content-Range': `bytes */${totalLength}` },
          });
        }
        const { start, end } = range;
        const sliced = sliceByteStream(res.body, start, end);
        return new Response(sliced, {
          status: 206,
          headers: {
            ...streamHeadersBase,
            'Content-Range': `bytes ${start}-${end}/${totalLength}`,
            'Content-Length': String(end - start + 1),
          },
        });
      }
    }

    return new Response(res.body, {
      status: 200,
      headers: {
        ...streamHeadersBase,
        ...(res.headers.get('content-length')
          ? { 'Content-Length': res.headers.get('content-length')! }
          : {}),
      },
    });
  }

  // Local Node.js dev / Playwright fallback
  if (!fs.existsSync(/*turbopackIgnore: true*/ resolved.diskPath)) {
    return new Response('Audio file not found', { status: 404 });
  }
  const stat = fs.statSync(/*turbopackIgnore: true*/ resolved.diskPath);
  const totalSize = stat.size;

  if (rangeHeader) {
    const range = parseByteRange(rangeHeader, totalSize);
    if (!range || range === 'invalid') {
      return new Response('Requested Range Not Satisfiable', {
        status: 416,
        headers: { 'Content-Range': `bytes */${totalSize}` },
      });
    }
    const { start, end } = range;
    const nodeStream = fs.createReadStream(/*turbopackIgnore: true*/ resolved.diskPath, {
      start,
      end,
    });
    const webStream = new ReadableStream<Uint8Array>({
      start(controller) {
        nodeStream.on('data', (chunk) =>
          controller.enqueue(chunk instanceof Uint8Array ? chunk : new Uint8Array(Buffer.from(chunk)))
        );
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });
    return new Response(webStream, {
      status: 206,
      headers: {
        ...streamHeadersBase,
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Content-Length': String(end - start + 1),
      },
    });
  }

  const buf = fs.readFileSync(/*turbopackIgnore: true*/ resolved.diskPath);
  return new Response(buf, {
    status: 200,
    headers: {
      ...streamHeadersBase,
      'Content-Length': String(totalSize),
    },
  });
}
