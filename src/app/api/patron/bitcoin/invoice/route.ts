export const dynamic = 'force-dynamic';

const STRIKE_API_BASE = 'https://api.strike.me/v1';

export async function POST(request: Request) {
  let body: { amountDollars?: unknown; frequency?: unknown; email?: unknown; note?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  const amountDollars = Number(body.amountDollars);
  const frequency = body.frequency === 'monthly' ? 'monthly' : 'once';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!Number.isFinite(amountDollars) || amountDollars < 1 || amountDollars > 10000) {
    return Response.json(
      { ok: false, error: 'Please enter a support amount between $1 and $10,000.' },
      { status: 400 }
    );
  }

  const strikeKey = process.env.STRIKE_API_KEY?.trim();
  if (!strikeKey) {
    return Response.json(
      {
        ok: false,
        strikeNotConfigured: true,
        error: 'Bitcoin Lightning patronage is being connected right now. Please try card checkout above.',
      },
      { status: 503 }
    );
  }

  const amountUsd = amountDollars.toFixed(2);
  const correlationId = `semi-patron-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const invRes = await fetch(`${STRIKE_API_BASE}/invoices`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${strikeKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      correlationId,
      description: `Semi (; - ]) — Patron Support (${frequency})${email ? ` · ${email}` : ''}`,
      amount: {
        amount: amountUsd,
        currency: 'USD',
      },
    }),
  });

  if (!invRes.ok) {
    const errText = await invRes.text().catch(() => '');
    console.error('[PatronStrike] Invoice creation failed:', invRes.status, errText);
    return Response.json(
      { ok: false, error: 'Unable to create Lightning invoice right now. Please try again.' },
      { status: 502 }
    );
  }

  const invData = (await invRes.json()) as { invoiceId?: string };
  if (!invData.invoiceId) {
    return Response.json({ ok: false, error: 'Strike returned an invalid invoice.' }, { status: 502 });
  }

  const quoteRes = await fetch(`${STRIKE_API_BASE}/invoices/${invData.invoiceId}/quote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${strikeKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!quoteRes.ok) {
    const errText = await quoteRes.text().catch(() => '');
    console.error('[PatronStrike] Quote failed:', quoteRes.status, errText);
    return Response.json(
      { ok: false, error: 'Unable to generate Lightning quote right now.' },
      { status: 502 }
    );
  }

  const quoteData = (await quoteRes.json()) as {
    lnInvoice?: string;
    expirationInSec?: number;
    sourceAmount?: { amount?: string; currency?: string };
  };

  if (!quoteData.lnInvoice) {
    return Response.json({ ok: false, error: 'Lightning invoice missing from quote.' }, { status: 502 });
  }

  return Response.json({
    ok: true,
    invoiceId: invData.invoiceId,
    lnInvoice: quoteData.lnInvoice,
    amountUsd,
    btcAmount: quoteData.sourceAmount?.amount ?? null,
    expirationInSec: quoteData.expirationInSec ?? 60,
  });
}
