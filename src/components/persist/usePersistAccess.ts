'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'semi_io_deluxe_access_v2';
const COOKIE_NAME = 'semi_io_deluxe_token';

function readToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`).exec(document.cookie || '');
  if (match) return decodeURIComponent(match[1]);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string };
    return typeof parsed.token === 'string' && parsed.token ? parsed.token : null;
  } catch {
    return null;
  }
}

export interface PersistAccess {
  checking: boolean;
  unlocked: boolean;
  token: string | null;
  email: string | null;
  grant: (token: string, email: string) => void;
}

/** Shared I/O Deluxe recognition for the Persist listening room (paid or promo-code unlocks). */
export function usePersistAccess(): PersistAccess {
  const [checking, setChecking] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const existing = readToken();
    if (!existing) {
      setChecking(false);
      return;
    }
    fetch(`/api/album/verify-session?token=${encodeURIComponent(existing)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { ok?: boolean; unlocked?: boolean; email?: string; token?: string } | null) => {
        if (cancelled || !data?.ok || !data.unlocked) return;
        setToken(data.token ?? existing);
        setEmail(data.email ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const grant = useCallback((nextToken: string, nextEmail: string) => {
    setToken(nextToken);
    setEmail(nextEmail);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: nextEmail, token: nextToken }));
    } catch {
      // storage unavailable
    }
  }, []);

  return { checking, unlocked: Boolean(token), token, email, grant };
}
