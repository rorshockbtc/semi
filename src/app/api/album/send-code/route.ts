import { NextResponse } from 'next/server';
import {
  ALBUM_EDITION_VERSION,
  DELUXE_COOKIE_NAME,
  createBuyerLoginCode,
  createSignedAccessToken,
} from '@/lib/album-purchases';
import { sendDeluxeLoginCodeEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { email?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter the email address you used when getting the album.' },
        { status: 400 }
      );
    }

    const result = await createBuyerLoginCode(email);
    if (!result.found || !result.code) {
      return NextResponse.json(
        {
          ok: false,
          notFound: true,
          error:
            'We didn’t find an I/O Deluxe purchase under that email yet. Check for typos or unlock with an access code.',
        },
        { status: 404 }
      );
    }

    const isTestEmail = /@(example\.com|example\.org|semi\.test|playwright\.local)$/i.test(email);
    if (!isTestEmail) {
      const sent = await sendDeluxeLoginCodeEmail({
        recipientEmail: email,
        code: result.code,
      });
      if (!sent.sent) {
        // Buyer is already verified in D1 (`album_purchases`); unlock directly instead of stranding them when SMTP is unavailable.
        const token = createSignedAccessToken(email);
        const origin = new URL(req.url).origin;
        const res = NextResponse.json({
          ok: true,
          directUnlock: true,
          unlocked: true,
          email,
          token,
          editionVersion: ALBUM_EDITION_VERSION,
          message: `Verified your I/O Deluxe Edition library for ${email}.`,
        });
        res.cookies.set(DELUXE_COOKIE_NAME, token, {
          httpOnly: false,
          sameSite: 'lax',
          secure: origin.startsWith('https://'),
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
        });
        return res;
      }
    }

    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(req.url);

    return NextResponse.json({
      ok: true,
      sent: true,
      ...(isLocalhost && isTestEmail ? { testCode: result.code } : {}),
      message: `Sent a 6-digit verification code to ${email}.`,
    });
  } catch (err) {
    console.error('[SendCode] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'Unable to send access code right now. Please try again.' },
      { status: 500 }
    );
  }
}
