import { NextResponse } from 'next/server';
import { createBuyerLoginCode } from '@/lib/album-purchases';
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
            'We didn’t find an I/O Deluxe purchase under that email yet. Check for typos or unlock the album first.',
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
        return NextResponse.json(
          {
            ok: false,
            emailUnavailable: true,
            error: 'Email code delivery isn’t available right now—use the Access / Promo Code tab to unlock immediately.',
          },
          { status: 503 }
        );
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
