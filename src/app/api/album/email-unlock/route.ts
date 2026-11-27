import { NextResponse } from 'next/server';
import {
  ALBUM_EDITION_VERSION,
  DELUXE_COOKIE_NAME,
  createSignedAccessToken,
  hasRegisteredEmailAccess,
} from '@/lib/album-purchases';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Direct email-only unlock for Persist:
 * Unlocks immediately if the email is already registered in `album_purchases` or `subscribers`.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { email?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const registered = await hasRegisteredEmailAccess(email);
    if (!registered) {
      return NextResponse.json(
        {
          ok: false,
          notFound: true,
          error:
            'We didn’t find that email in the I/O library yet. Check for typos or unlock with an access code.',
        },
        { status: 404 }
      );
    }

    const token = createSignedAccessToken(email);
    const origin = new URL(req.url).origin;
    const res = NextResponse.json({
      ok: true,
      unlocked: true,
      email,
      token,
      editionVersion: ALBUM_EDITION_VERSION,
    });
    res.cookies.set(DELUXE_COOKIE_NAME, token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: origin.startsWith('https://'),
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch (err) {
    console.error('[EmailUnlock] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unable to check your email right now. Please try again.' },
      { status: 500 }
    );
  }
}
