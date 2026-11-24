import fs from 'node:fs';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { DELUXE_COOKIE_NAME, verifyPurchaseToken } from '../../../../../lib/album-purchases.ts';

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

function extractToken(request: Request): string | null {
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');
  if (queryToken) return queryToken;

  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${DELUXE_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(request: Request) {
  const token = extractToken(request);
  const verified = await verifyPurchaseToken(token);
  if (!verified) {
    return Response.json(
      { ok: false, error: 'Deluxe Edition purchase required.' },
      { status: 401 }
    );
  }

  const assets = await getAssetsBinding();
  if (assets) {
    const assetUrl = new URL('/deluxe-vault/14-localhost-video.mp4', request.url);
    const assetRes = await assets.fetch(
      new Request(assetUrl.toString(), {
        headers: {
          ...(request.headers.get('range') ? { range: request.headers.get('range')! } : {}),
        },
      })
    );
    if (!assetRes.ok && assetRes.status !== 206) {
      return Response.json({ ok: false, error: 'Video not found.' }, { status: 404 });
    }
    const headers = new Headers(assetRes.headers);
    headers.set('Content-Type', 'video/mp4');
    headers.set('Cache-Control', 'private, no-store');
    headers.set(
      'Content-Disposition',
      'inline; filename="14 - Localhost (Music Video).mp4"'
    );
    return new Response(assetRes.body, {
      status: assetRes.status,
      headers,
    });
  }

  const localPath = path.join(process.cwd(), 'public', 'deluxe-vault', '14-localhost-video.mp4');
  if (!fs.existsSync(localPath)) {
    return Response.json({ ok: false, error: 'Video not found.' }, { status: 404 });
  }
  const buf = fs.readFileSync(localPath);
  return new Response(new Uint8Array(buf), {
    status: 200,
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': String(buf.length),
      'Cache-Control': 'private, no-store',
      'Content-Disposition': 'inline; filename="14 - Localhost (Music Video).mp4"',
    },
  });
}
