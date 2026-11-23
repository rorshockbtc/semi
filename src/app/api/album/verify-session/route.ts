import { NextResponse } from 'next/server';
import {
  ALBUM_EDITION_VERSION,
  DELUXE_COOKIE_NAME,
  upsertAlbumPurchase,
  verifyPurchaseToken,
} from '@/lib/album-purchases';
import { sendDeluxeReceiptEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id')?.trim();
  const tokenParam = url.searchParams.get('token')?.trim();

  // Direct token entitlement check (for emailed links or saved localStorage sessions)
  if (tokenParam && !sessionId) {
    const check = await verifyPurchaseToken(tokenParam);
    if (!check.valid || !check.email) {
      return NextResponse.json({ ok: false, unlocked: false }, { status: 401 });
    }
    const res = NextResponse.json({
      ok: true,
      unlocked: true,
      email: check.email,
      token: tokenParam,
      editionVersion: ALBUM_EDITION_VERSION,
    });
    res.cookies.set(DELUXE_COOKIE_NAME, tokenParam, {
      httpOnly: false,
      sameSite: 'lax',
      secure: url.origin.startsWith('https://'),
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: 'Missing checkout session_id.' },
      { status: 400 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeKey || !stripeKey.startsWith('sk_')) {
    return NextResponse.json(
      { ok: false, error: 'Stripe verification is not configured.' },
      { status: 503 }
    );
  }

  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: { Authorization: `Bearer ${stripeKey}` },
    }
  );

  const session = (await stripeRes.json().catch(() => ({}))) as {
    id?: string;
    payment_status?: string;
    amount_total?: number;
    customer_details?: { email?: string };
    customer_email?: string;
    metadata?: { buyer_email?: string };
  };

  if (
    !stripeRes.ok ||
    (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required')
  ) {
    return NextResponse.json(
      { ok: false, error: 'Payment has not completed yet.' },
      { status: 402 }
    );
  }

  const email = (
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.buyer_email ||
    ''
  )
    .trim()
    .toLowerCase();

  if (!email) {
    return NextResponse.json(
      { ok: false, error: 'Unable to determine customer email from Stripe session.' },
      { status: 400 }
    );
  }

  const { record, isNew } = await upsertAlbumPurchase({
    email,
    source: 'stripe',
    stripeSessionId: session.id ?? sessionId,
    amountCents: Number(session.amount_total ?? 1299),
  });

  if (isNew) {
    try {
      await sendDeluxeReceiptEmail({
        recipientEmail: email,
        accessToken: record.accessToken,
        origin: url.origin,
      });
    } catch (err) {
      console.warn('[VerifySession] Receipt email warning:', err);
    }
  }

  const res = NextResponse.json({
    ok: true,
    unlocked: true,
    email: record.email,
    token: record.accessToken,
    editionVersion: ALBUM_EDITION_VERSION,
  });
  res.cookies.set(DELUXE_COOKIE_NAME, record.accessToken, {
    httpOnly: false,
    sameSite: 'lax',
    secure: url.origin.startsWith('https://'),
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
