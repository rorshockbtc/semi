import { NextResponse } from 'next/server';
import {
  ALBUM_EDITION_VERSION,
  DELUXE_COOKIE_NAME,
  verifyBuyerLoginCode,
} from '@/lib/album-purchases';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      email?: unknown;
      code?: unknown;
    };
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const code = typeof body.code === 'string' ? body.code.trim() : '';

    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter your email and the 6-digit code from your inbox.' },
        { status: 400 }
      );
    }

    const verified = await verifyBuyerLoginCode(email, code);
    if (!verified.valid || !verified.accessToken) {
      return NextResponse.json(
        { ok: false, error: 'That 6-digit code is invalid or expired. Request a fresh code to try again.' },
        { status: 401 }
      );
    }

    const origin = new URL(req.url).origin;
    const res = NextResponse.json({
      ok: true,
      unlocked: true,
      email,
      token: verified.accessToken,
      editionVersion: ALBUM_EDITION_VERSION,
    });
    res.cookies.set(DELUXE_COOKIE_NAME, verified.accessToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: origin.startsWith('https://'),
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch (err) {
    console.error('[VerifyCode] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unable to verify code right now. Please try again.' },
      { status: 500 }
    );
  }
}
