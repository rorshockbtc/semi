import fs from 'node:fs';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { DELUXE_COOKIE_NAME, verifyPurchaseToken } from '../../../../../lib/album-purchases.ts';

export const dynamic = 'force-dynamic';

const VALID_ART_FILES = new Set([
  'io_cover.jpg',
  'io_cover_rear.jpg',
  'io_01.jpg',
  'io_02.jpg',
  'io_03.jpg',
  'io_05.jpg',
  'io_06.jpg',
  'io_07.jpg',
  'io_08.jpg',
  'io_09.jpg',
]);

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

  const cookieHeader = req.headers.get('cookie') || '';
  const match = new RegExp(`(?:^|;\\s*)${DELUXE_COOKIE_NAME}=([^;]+)`).exec(cookieHeader);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!VALID_ART_FILES.has(filename)) {
    return new Response('Artwork not found', { status: 404 });
  }

  const token = extractToken(request);
  const authCheck = await verifyPurchaseToken(token);
  if (!authCheck.valid) {
    return new Response('Purchase required to access I/O Deluxe booklet artwork', { status: 401 });
  }

  const assets = await getAssetsBinding();
  if (assets) {
    const assetUrl = new URL(`/deluxe-art/${filename}`, request.url);
    const res = await assets.fetch(new Request(assetUrl.toString()));
    if (!res.ok) {
      return new Response('Artwork asset missing', { status: 404 });
    }
    return new Response(res.body, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'private, max-age=3600',
        Vary: 'Cookie',
      },
    });
  }

  const localPath = path.join(process.cwd(), 'public', 'deluxe-art', filename);
  if (!fs.existsSync(localPath)) {
    return new Response('Artwork asset missing', { status: 404 });
  }

  const bytes = fs.readFileSync(localPath);
  return new Response(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': String(bytes.byteLength),
      'Cache-Control': 'private, no-cache',
    },
  });
}
