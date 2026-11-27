import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const DELUXE_PRICE_CENTS = 1299;
export const DELUXE_PRICE_LABEL = '$12.99';
export const PROMO_CODE_FREE = 'trypipesdotpink';
export const BLACK_FRIDAY_PROMO_CODE = 'blackfriday';
export const BLACK_FRIDAY_PRICE_CENTS = 599;
/** Tuesday, December 1, 2026 at 12:00 AM CST (UTC-6 = 06:00 UTC). */
export const BLACK_FRIDAY_EXPIRES_AT_MS = Date.UTC(2026, 11, 1, 6, 0, 0);
export const DELUXE_COOKIE_NAME = 'semi_io_deluxe_token';
export const ALBUM_EDITION_VERSION = '2026.11.22-v2';

export function resolvePromoPricing(
  rawCode: string,
  nowMs: number = Date.now()
):
  | { valid: true; kind: 'free' | 'discount'; amountCents: number; code: string }
  | { valid: false; expired?: boolean; error: string } {
  const clean = rawCode.trim().toLowerCase();
  if (clean === PROMO_CODE_FREE) {
    return { valid: true, kind: 'free', amountCents: 0, code: PROMO_CODE_FREE };
  }
  if (clean === BLACK_FRIDAY_PROMO_CODE) {
    if (nowMs >= BLACK_FRIDAY_EXPIRES_AT_MS) {
      return {
        valid: false,
        expired: true,
        error: 'The BlackFriday promo code expired Tuesday at 12:00 AM CST.',
      };
    }
    return {
      valid: true,
      kind: 'discount',
      amountCents: BLACK_FRIDAY_PRICE_CENTS,
      code: BLACK_FRIDAY_PROMO_CODE,
    };
  }
  return {
    valid: false,
    error: 'That discount code was not recognized. Check the spelling or clear it to pay with Stripe.',
  };
}

export interface AlbumPurchaseRecord {
  email: string;
  accessToken: string;
  source: string;
  stripeSessionId: string | null;
  amountCents: number;
  createdAt: string;
  updatedAt: string;
}

interface LoginCodeRecord {
  email: string;
  code: string;
  expiresAt: number;
}

interface D1Like {
  prepare(query: string): {
    bind(...values: unknown[]): {
      run(): Promise<unknown>;
      first<T = Record<string, unknown>>(): Promise<T | null>;
    };
  };
}

async function getD1Binding(): Promise<D1Like | null> {
  if (typeof navigator === 'undefined' || navigator.userAgent !== 'Cloudflare-Workers') {
    return null;
  }
  try {
    const ctx = await getCloudflareContext({ async: true });
    const env = ctx?.env as Record<string, unknown> | undefined;
    const db = env?.DB as D1Like | undefined;
    if (db && typeof db.prepare === 'function') {
      return db;
    }
  } catch {
    // Local dev / unit tests outside OpenNext worker runtime
  }
  return null;
}

function getSigningSecret(): string {
  return (
    process.env.ALBUM_TOKEN_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    process.env.SMTP_PASS ||
    'semi-io-deluxe-west-nashville-2026'
  );
}

export function createSignedAccessToken(email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  const payload = Buffer.from(
    JSON.stringify({ e: cleanEmail, iat: Math.floor(Date.now() / 1000) }),
    'utf8'
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySignedAccessToken(token: string): string | null {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('base64url');
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      e?: string;
    };
    return typeof parsed.e === 'string' && parsed.e.includes('@') ? parsed.e : null;
  } catch {
    return null;
  }
}

function getFallbackPath(filename: string): string {
  const localDir = path.join(process.cwd(), '.data');
  try {
    fs.mkdirSync(localDir, { recursive: true });
    return path.join(localDir, filename);
  } catch {
    return path.join(os.tmpdir(), `semi-${filename}`);
  }
}

function readJsonArray<T>(filename: string): T[] {
  try {
    const file = getFallbackPath(filename);
    if (!fs.existsSync(file)) return [];
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJsonArray<T>(filename: string, items: T[]): void {
  try {
    fs.writeFileSync(getFallbackPath(filename), JSON.stringify(items, null, 2), 'utf8');
  } catch {
    // Ignore read-only fs errors
  }
}

async function ensureCommerceTables(d1: D1Like): Promise<void> {
  await d1
    .prepare(
      `CREATE TABLE IF NOT EXISTS album_purchases (
        email TEXT PRIMARY KEY,
        access_token TEXT NOT NULL,
        source TEXT NOT NULL,
        stripe_session_id TEXT,
        amount_cents INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`
    )
    .bind()
    .run();

  await d1
    .prepare(
      `CREATE TABLE IF NOT EXISTS album_login_codes (
        email TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        expires_at INTEGER NOT NULL
      )`
    )
    .bind()
    .run();
}

export async function upsertAlbumPurchase(params: {
  email: string;
  source: string;
  stripeSessionId?: string | null;
  amountCents: number;
}): Promise<{ record: AlbumPurchaseRecord; isNew: boolean; storage: 'd1' | 'local' }> {
  const email = params.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const freshToken = createSignedAccessToken(email);

  const d1 = await getD1Binding();
  if (d1) {
    await ensureCommerceTables(d1);
    const existing = await d1
      .prepare(
        'SELECT email, access_token, source, stripe_session_id, amount_cents, created_at FROM album_purchases WHERE email = ?1'
      )
      .bind(email)
      .first<{
        email: string;
        access_token: string;
        source: string;
        stripe_session_id: string | null;
        amount_cents: number;
        created_at: string;
      }>();

    if (existing) {
      // Ensure token is valid signed format; upgrade if needed
      const tokenToKeep = verifySignedAccessToken(existing.access_token)
        ? existing.access_token
        : freshToken;
      const mergedAmount = Math.max(existing.amount_cents, params.amountCents);
      const mergedSession = params.stripeSessionId || existing.stripe_session_id;
      await d1
        .prepare(
          'UPDATE album_purchases SET access_token = ?1, stripe_session_id = ?2, amount_cents = ?3, updated_at = ?4 WHERE email = ?5'
        )
        .bind(tokenToKeep, mergedSession ?? null, mergedAmount, now, email)
        .run();

      return {
        record: {
          email,
          accessToken: tokenToKeep,
          source: existing.source,
          stripeSessionId: mergedSession ?? null,
          amountCents: mergedAmount,
          createdAt: existing.created_at,
          updatedAt: now,
        },
        isNew: false,
        storage: 'd1',
      };
    }

    await d1
      .prepare(
        'INSERT INTO album_purchases (email, access_token, source, stripe_session_id, amount_cents, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)'
      )
      .bind(
        email,
        freshToken,
        params.source,
        params.stripeSessionId ?? null,
        params.amountCents,
        now,
        now
      )
      .run();

    return {
      record: {
        email,
        accessToken: freshToken,
        source: params.source,
        stripeSessionId: params.stripeSessionId ?? null,
        amountCents: params.amountCents,
        createdAt: now,
        updatedAt: now,
      },
      isNew: true,
      storage: 'd1',
    };
  }

  const all = readJsonArray<AlbumPurchaseRecord>('album-purchases.json');
  const found = all.find((r) => r.email === email);
  if (found) {
    if (!verifySignedAccessToken(found.accessToken)) {
      found.accessToken = freshToken;
    }
    found.amountCents = Math.max(found.amountCents, params.amountCents);
    found.stripeSessionId = params.stripeSessionId || found.stripeSessionId;
    found.updatedAt = now;
    writeJsonArray('album-purchases.json', all);
    return { record: found, isNew: false, storage: 'local' };
  }

  const record: AlbumPurchaseRecord = {
    email,
    accessToken: freshToken,
    source: params.source,
    stripeSessionId: params.stripeSessionId ?? null,
    amountCents: params.amountCents,
    createdAt: now,
    updatedAt: now,
  };
  all.push(record);
  writeJsonArray('album-purchases.json', all);
  return { record, isNew: true, storage: 'local' };
}

export async function findPurchaseByEmail(
  rawEmail: string
): Promise<AlbumPurchaseRecord | null> {
  const email = rawEmail.trim().toLowerCase();
  const d1 = await getD1Binding();
  if (d1) {
    await ensureCommerceTables(d1);
    const row = await d1
      .prepare(
        'SELECT email, access_token, source, stripe_session_id, amount_cents, created_at, updated_at FROM album_purchases WHERE email = ?1'
      )
      .bind(email)
      .first<{
        email: string;
        access_token: string;
        source: string;
        stripe_session_id: string | null;
        amount_cents: number;
        created_at: string;
        updated_at: string;
      }>();
    if (!row) return null;
    const token = verifySignedAccessToken(row.access_token)
      ? row.access_token
      : createSignedAccessToken(email);
    return {
      email: row.email,
      accessToken: token,
      source: row.source,
      stripeSessionId: row.stripe_session_id,
      amountCents: row.amount_cents,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  const all = readJsonArray<AlbumPurchaseRecord>('album-purchases.json');
  return all.find((r) => r.email === email) ?? null;
}

/** Checks whether an email is registered in either `album_purchases` or `subscribers` (first-album downloads / signups). */
export async function hasRegisteredEmailAccess(rawEmail: string): Promise<boolean> {
  const email = rawEmail.trim().toLowerCase();
  if (!email) return false;

  const purchase = await findPurchaseByEmail(email);
  if (purchase) return true;

  const d1 = await getD1Binding();
  if (d1) {
    try {
      await d1
        .prepare(
          'CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, unsubscribe_token TEXT NOT NULL, status TEXT NOT NULL DEFAULT \'active\', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)'
        )
        .bind()
        .run();
      const row = await d1
        .prepare('SELECT email FROM subscribers WHERE email = ?1')
        .bind(email)
        .first<{ email: string }>();
      if (row?.email) return true;
    } catch {
      // Ignore D1 subscriber lookup error
    }
    return false;
  }

  const subs = readJsonArray<{ email?: string }>('subscribers.json');
  return subs.some((s) => typeof s.email === 'string' && s.email.trim().toLowerCase() === email);
}

export async function verifyPurchaseToken(token: string | null | undefined): Promise<{
  valid: boolean;
  email: string | null;
}> {
  if (!token) return { valid: false, email: null };
  const signedEmail = verifySignedAccessToken(token);
  if (signedEmail) {
    return { valid: true, email: signedEmail };
  }

  const d1 = await getD1Binding();
  if (d1) {
    await ensureCommerceTables(d1);
    const row = await d1
      .prepare('SELECT email FROM album_purchases WHERE access_token = ?1')
      .bind(token)
      .first<{ email: string }>();
    if (row?.email) {
      return { valid: true, email: row.email };
    }
  } else {
    const all = readJsonArray<AlbumPurchaseRecord>('album-purchases.json');
    const found = all.find((r) => r.accessToken === token);
    if (found) return { valid: true, email: found.email };
  }

  return { valid: false, email: null };
}

export async function createBuyerLoginCode(rawEmail: string): Promise<{
  found: boolean;
  code?: string;
}> {
  const email = rawEmail.trim().toLowerCase();
  const purchase = await findPurchaseByEmail(email);
  if (!purchase) {
    return { found: false };
  }

  const code = String(crypto.randomInt(100000, 999999));
  const expiresAt = Date.now() + 15 * 60 * 1000;

  const d1 = await getD1Binding();
  if (d1) {
    await ensureCommerceTables(d1);
    await d1
      .prepare(
        'INSERT INTO album_login_codes (email, code, expires_at) VALUES (?1, ?2, ?3) ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at'
      )
      .bind(email, code, expiresAt)
      .run();
  } else {
    const codes = readJsonArray<LoginCodeRecord>('album-login-codes.json').filter(
      (c) => c.email !== email
    );
    codes.push({ email, code, expiresAt });
    writeJsonArray('album-login-codes.json', codes);
  }

  return { found: true, code };
}

export async function verifyBuyerLoginCode(
  rawEmail: string,
  rawCode: string
): Promise<{ valid: boolean; accessToken?: string }> {
  const email = rawEmail.trim().toLowerCase();
  const code = rawCode.trim();
  if (!/^\d{6}$/.test(code)) return { valid: false };

  const d1 = await getD1Binding();
  if (d1) {
    await ensureCommerceTables(d1);
    const row = await d1
      .prepare('SELECT code, expires_at FROM album_login_codes WHERE email = ?1')
      .bind(email)
      .first<{ code: string; expires_at: number }>();

    if (!row || row.code !== code || Date.now() > Number(row.expires_at)) {
      return { valid: false };
    }
    await d1.prepare('DELETE FROM album_login_codes WHERE email = ?1').bind(email).run();
  } else {
    const codes = readJsonArray<LoginCodeRecord>('album-login-codes.json');
    const match = codes.find((c) => c.email === email);
    if (!match || match.code !== code || Date.now() > match.expiresAt) {
      return { valid: false };
    }
    writeJsonArray(
      'album-login-codes.json',
      codes.filter((c) => c.email !== email)
    );
  }

  const purchase = await findPurchaseByEmail(email);
  if (!purchase) return { valid: false };
  return { valid: true, accessToken: purchase.accessToken };
}
