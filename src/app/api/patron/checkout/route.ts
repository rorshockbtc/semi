export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      amountDollars?: unknown;
      frequency?: unknown;
      email?: unknown;
      note?: unknown;
    };

    const amountDollars = Number(body.amountDollars);
    const frequency = body.frequency === 'monthly' ? 'monthly' : 'once';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const note = typeof body.note === 'string' ? body.note.trim().slice(0, 400) : '';

    if (!Number.isFinite(amountDollars) || amountDollars < 1 || amountDollars > 10000) {
      return Response.json(
        { ok: false, error: 'Please enter a support amount between $1 and $10,000.' },
        { status: 400 }
      );
    }

    const unitAmountCents = Math.round(amountDollars * 100);
    const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!stripeKey || (!stripeKey.startsWith('sk_') && !stripeKey.startsWith('rk_'))) {
      return Response.json(
        {
          ok: false,
          stripeNotConfigured: true,
          error: 'Card patronage is being connected right now. You can also support with Bitcoin below.',
        },
        { status: 503 }
      );
    }

    const origin = new URL(req.url).origin;
    const form = new URLSearchParams();
    form.set('mode', frequency === 'monthly' ? 'subscription' : 'payment');
    if (email && email.includes('@')) {
      form.set('customer_email', email);
    }
    form.set('line_items[0][price_data][currency]', 'usd');
    form.set('line_items[0][price_data][unit_amount]', String(unitAmountCents));
    form.set(
      'line_items[0][price_data][product_data][name]',
      frequency === 'monthly'
        ? 'Become a Patron — Semi (; - ]) (Monthly)'
        : 'Become a Patron — Semi (; - ]) (One-Time)'
    );
    form.set(
      'line_items[0][price_data][product_data][description]',
      'Supporting independent songs, artwork, videos, and stories from Semi (; - ]).'
    );
    if (frequency === 'monthly') {
      form.set('line_items[0][price_data][recurring][interval]', 'month');
    }
    form.set('line_items[0][quantity]', '1');
    form.set('metadata[type]', 'patron');
    form.set('metadata[frequency]', frequency);
    if (note) {
      form.set('metadata[note]', note);
    }
    form.set('success_url', `${origin}/patron?status=success&frequency=${frequency}`);
    form.set('cancel_url', `${origin}/patron?status=cancelled`);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    const stripeJson = (await stripeRes.json().catch(() => ({}))) as {
      url?: string;
      error?: { message?: string };
    };

    if (!stripeRes.ok || !stripeJson.url) {
      console.error('[PatronCheckout] Stripe error:', stripeJson);
      return Response.json(
        {
          ok: false,
          error: stripeJson.error?.message || 'Unable to start Stripe checkout right now. Please try again.',
        },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, checkoutUrl: stripeJson.url });
  } catch (err) {
    console.error('[PatronCheckout] Error:', err);
    return Response.json(
      { ok: false, error: 'Unable to start patronage checkout right now.' },
      { status: 500 }
    );
  }
}
