import {
  DELUXE_COOKIE_NAME,
  DELUXE_PRICE_CENTS,
  upsertAlbumPurchase,
} from '../../../../../lib/album-purchases.ts';

export const dynamic = 'force-dynamic';

const STRIKE_API_BASE = 'https://api.strike.me/v1';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const invoiceId = url.searchParams.get('invoiceId')?.trim();
  const email = url.searchParams.get('email')?.trim().toLowerCase() || '';

  if (!invoiceId || !email || !email.includes('@')) {
    return Response.json({ ok: false, error: 'Missing invoiceId or email' }, { status: 400 });
  }

  const strikeKey = process.env.STRIKE_API_KEY?.trim();
  if (!strikeKey) {
    return Response.json({ ok: false, strikeNotConfigured: true }, { status: 503 });
  }

  const res = await fetch(`${STRIKE_API_BASE}/invoices/${encodeURIComponent(invoiceId)}`, {
    headers: {
      Authorization: `Bearer ${strikeKey}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    return Response.json({ ok: false, paid: false, state: 'UNKNOWN' }, { status: 502 });
  }

  const data = (await res.json()) as { state?: string };
  const state = data.state || 'UNPAID';
  if (state !== 'PAID') {
    return Response.json({ ok: true, paid: false, state });
  }

  const { record } = await upsertAlbumPurchase({
    email,
    source: 'strike-btc',
    stripeSessionId: invoiceId,
    amountCents: DELUXE_PRICE_CENTS,
  });

  const maxAge = 60 * 60 * 24 * 365;
  return new Response(
    JSON.stringify({
      ok: true,
      paid: true,
      unlocked: true,
      email: record.email,
      token: record.accessToken,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${DELUXE_COOKIE_NAME}=${encodeURIComponent(record.accessToken)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`,
      },
    }
  );
}
