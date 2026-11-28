import { NextResponse } from 'next/server';
import { DELUXE_COOKIE_NAME, createSignedAccessToken } from '@/lib/album-purchases';

export const dynamic = 'force-dynamic';

/**
 * Unlinked secret backdoor for direct Persist album access without login.
 */
export async function GET(request: Request) {
  const token = createSignedAccessToken('cubby@colonhyphenbracket.pink');
  const url = new URL('/persist', request.url);
  const res = NextResponse.redirect(url, 302);

  res.cookies.set(DELUXE_COOKIE_NAME, token, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });

  return res;
}
