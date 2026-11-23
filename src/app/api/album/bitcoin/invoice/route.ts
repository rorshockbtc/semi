import { DELUXE_PRICE_CENTS } from '../../../../../lib/album-purchases.ts';

export const dynamic = 'force-dynamic';

const STRIKE_API_BASE = 'https://api.strike.me/v1';

export async function POST(request: Request) {
  let body: { email?: string } = {};
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return Response.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !email.includes('@') || !email.includes('.')) {
    return Response.json(
      { ok: false, error: 'Please enter a valid email address for your receipt and lifetime updates.' },
      { status: 400 }
    );
  }

  const strikeKey = process.env.STRIKE_API_KEY?.trim();
  if (!strikeKey) {
    return Response.json(
      {
        ok: false,
        strikeNotConfigured: true,
        error: 'Bitcoin Lightning checkout is being connected right now. Run `npx wrangler secret put STRIKE_API_KEY` to enable.',
      },
      { status: 503 }
    );
  }

  const amountUsd = (DELUXE_PRICE_CENTS / 100).toFixed(2);
  const correlationId = `semi-io-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const invRes = await fetch(`${STRIKE_API_BASE}/invoices`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${strikeKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      correlationId,
      description: `Semi (; - ]) — I/O Deluxe Edition (15 Tracks + Booklet) · ${email}`,
      amount: {
        amount: amountUsd,
        currency: 'USD',
      },
    }),
  });

  if (!invRes.ok) {
    const errText = await invRes.text().catch(() => '');
    console.error('[Strike] Invoice creation failed:', invRes.status, errText);
    return Response.json(
      { ok: false, error: 'Unable to create Lightning invoice right now. Please try again.' },
      { status: 502 }
    );
  }

  const invData = (await invRes.json()) as { invoiceId?: string; state?: string };
  if (!invData.invoiceId) {
    return Response.json({ ok: false, error: 'Strike did not return an invoice ID.' }, { status: 502 });
  }

  const quoteRes = await fetch(`${STRIKE_API_BASE}/invoices/${invData.invoiceId}/quote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${strikeKey}`,
      Accept: 'application/json',
    },
  });

  if (!quoteRes.ok) {
    const errText = await quoteRes.text().catch(() => '');
    console.error('[Strike] Quote creation failed:', quoteRes.status, errText);
    return Response.json(
      { ok: false, error: 'Unable to generate Lightning payment quote right now.' },
      { status: 502 }
    );
  }

  const quoteData = (await quoteRes.json()) as {
    lnInvoice?: string;
    expirationInSec?: number;
    targetAmount?: { amount?: string; currency?: string };
  };

  if (!quoteData.lnInvoice) {
    return Response.json({ ok: false, error: 'Strike did not return a Lightning invoice.' }, { status: 502 });
  }

  return Response.json({
    ok: true,
    invoiceId: invData.invoiceId,
    lnInvoice: quoteData.lnInvoice,
    expirationInSec: quoteData.expirationInSec ?? 600,
    btcAmount: quoteData.targetAmount?.amount ?? null,
    email,
  });
}
