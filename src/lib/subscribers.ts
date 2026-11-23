import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface SubscriberRecord {
  email: string;
  unsubscribeToken: string;
  status: 'active' | 'unsubscribed';
  createdAt: string;
  updatedAt: string;
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
    // Running outside OpenNext / Cloudflare Workers (e.g. next dev or next start)
  }
  return null;
}

function getFallbackFilePath(): string {
  const localDir = path.join(process.cwd(), '.data');
  try {
    fs.mkdirSync(localDir, { recursive: true });
    return path.join(localDir, 'subscribers.json');
  } catch {
    return path.join(os.tmpdir(), 'semi-subscribers.json');
  }
}

function readFallbackSubscribers(): SubscriberRecord[] {
  try {
    const file = getFallbackFilePath();
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFallbackSubscribers(records: SubscriberRecord[]): void {
  try {
    const file = getFallbackFilePath();
    fs.writeFileSync(file, JSON.stringify(records, null, 2), 'utf8');
  } catch {
    // Ignore read-only filesystem errors when running on ephemeral serverless
  }
}

async function ensureSubscribersTable(d1: D1Like): Promise<void> {
  await d1
    .prepare(
      'CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, unsubscribe_token TEXT NOT NULL, status TEXT NOT NULL DEFAULT \'active\', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)'
    )
    .bind()
    .run();
}

export async function upsertSubscriber(rawEmail: string): Promise<{
  record: SubscriberRecord;
  isNewOrReactivated: boolean;
  storage: 'd1' | 'local';
}> {
  const email = rawEmail.trim().toLowerCase();
  const now = new Date().toISOString();
  const freshToken = crypto.randomBytes(20).toString('hex');

  const d1 = await getD1Binding();
  if (d1) {
    await ensureSubscribersTable(d1);
    const existing = await d1
      .prepare('SELECT email, unsubscribe_token, status, created_at FROM subscribers WHERE email = ?1')
      .bind(email)
      .first<{ email: string; unsubscribe_token: string; status: string; created_at: string }>();

    if (existing) {
      const wasActive = existing.status === 'active';
      await d1
        .prepare('UPDATE subscribers SET status = ?1, updated_at = ?2 WHERE email = ?3')
        .bind('active', now, email)
        .run();
      return {
        record: {
          email,
          unsubscribeToken: existing.unsubscribe_token,
          status: 'active',
          createdAt: existing.created_at,
          updatedAt: now,
        },
        isNewOrReactivated: !wasActive,
        storage: 'd1',
      };
    }

    await d1
      .prepare(
        'INSERT INTO subscribers (email, unsubscribe_token, status, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)'
      )
      .bind(email, freshToken, 'active', now, now)
      .run();

    return {
      record: {
        email,
        unsubscribeToken: freshToken,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      isNewOrReactivated: true,
      storage: 'd1',
    };
  }

  const list = readFallbackSubscribers();
  const existing = list.find((r) => r.email === email);
  if (existing) {
    const wasActive = existing.status === 'active';
    existing.status = 'active';
    existing.updatedAt = now;
    writeFallbackSubscribers(list);
    return {
      record: existing,
      isNewOrReactivated: !wasActive,
      storage: 'local',
    };
  }

  const created: SubscriberRecord = {
    email,
    unsubscribeToken: freshToken,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
  list.push(created);
  writeFallbackSubscribers(list);
  return {
    record: created,
    isNewOrReactivated: true,
    storage: 'local',
  };
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const clean = token.trim();
  if (!clean) return false;
  const now = new Date().toISOString();

  const d1 = await getD1Binding();
  if (d1) {
    await ensureSubscribersTable(d1);
    const existing = await d1
      .prepare('SELECT email FROM subscribers WHERE unsubscribe_token = ?1')
      .bind(clean)
      .first<{ email: string }>();
    if (!existing) return false;
    await d1
      .prepare('UPDATE subscribers SET status = ?1, updated_at = ?2 WHERE unsubscribe_token = ?3')
      .bind('unsubscribed', now, clean)
      .run();
    return true;
  }

  const list = readFallbackSubscribers();
  const found = list.find((r) => r.unsubscribeToken === clean);
  if (!found) return false;
  found.status = 'unsubscribed';
  found.updatedAt = now;
  writeFallbackSubscribers(list);
  return true;
}
