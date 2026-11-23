import {
  DELUXE_COOKIE_NAME,
  DELUXE_PRICE_CENTS,
  PROMO_CODE_FREE,
  upsertAlbumPurchase,
} from '../../../../lib/album-purchases.ts';
import { sendDeluxeReceiptEmail } from '../../../../lib/mailer.ts';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isSyntheticTestEmail(email: string): boolean {
  return /@(example\.com|example\.org|semi\.test|playwright\.local)$/i.test(email);
}

function buildCookieHeader(token: string, isHttps: boolean): string {
  const parts = [
    `${DELUXE_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${60 * 60 * 24 * 365}`,
  ];
  if (isHttps) parts.push('Secure');
  return parts.join('; ');
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      email?: unknown;
      promoCode?: unknown;
    };

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const promo = typeof body.promoCode === 'string' ? body.promoCode.trim().toLowerCase() : '';

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return Response.json(
        {
          ok: false,
          error:
            'Please enter a valid email address so we can send your receipt & lifetime update link.',
        },
        { status: 400 }
      );
    }

    const origin = new URL(req.url).origin;

    // 1. Direct 100%-off promo code: trypipesdotpink
    if (promo) {
      if (promo !== PROMO_CODE_FREE) {
        return Response.json(
          {
            ok: false,
            error:
              'That discount code was not recognized. Check the spelling or clear it to pay with Stripe.',
          },
          { status: 400 }
        );
      }

      const { record, isNew } = await upsertAlbumPurchase({
        email,
        source: `promo:${PROMO_CODE_FREE}`,
        amountCents: 0,
      });

      if (isNew && !isSyntheticTestEmail(email)) {
        try {
          await sendDeluxeReceiptEmail({
            recipientEmail: email,
            accessToken: record.accessToken,
            origin,
          });
        } catch (mailErr) {
          console.warn('[AlbumCheckout] Promo receipt email warning:', mailErr);
        }
      }

      return Response.json(
        {
          ok: true,
          unlocked: true,
          email: record.email,
          token: record.accessToken,
          message: 'Code accepted! Your I/O Deluxe 15-Track Edition is unlocked with lifetime updates.',
        },
        {
          status: 200,
          headers: {
            'Set-Cookie': buildCookieHeader(record.accessToken, origin.startsWith('https://')),
          },
        }
      );
    }

    // 2. Paid $12.99 Stripe Checkout Session
    const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!stripeKey || !stripeKey.startsWith('sk_')) {
      return Response.json(
        {
          ok: false,
          stripeNotConfigured: true,
          error:
            'Card checkout is being connected right now. If you have a promo code, enter it above—or check back shortly.',
        },
        { status: 503 }
      );
    }

    const form = new URLSearchParams();
    form.set('mode', 'payment');
    form.set('customer_email', email);
    form.set('allow_promotion_codes', 'true');
    form.set('line_items[0][price_data][currency]', 'usd');
    form.set('line_items[0][price_data][unit_amount]', String(DELUXE_PRICE_CENTS));
    form.set(
      'line_items[0][price_data][product_data][name]',
      'Semi (; - ]) — I/O (Deluxe 15-Track Collector’s Edition)'
    );
    form.set(
      'line_items[0][price_data][product_data][description]',
      'All 12 album tracks + 3 exclusive studio alternate takes (Tracks 13–15, closing with Ghost Alt Take), cover art, and free lifetime updates.'
    );
    form.set(
      'line_items[0][price_data][product_data][images][0]',
      `${origin}/photos/io-album-cover.jpg`
    );
    form.set('line_items[0][quantity]', '1');
    form.set('metadata[album]', 'io-deluxe-15');
    form.set('metadata[buyer_email]', email);
    form.set(
      'success_url',
      `${origin}/songs?checkout=success&session_id={CHECKOUT_SESSION_ID}#deluxe-edition`
    );
    form.set('cancel_url', `${origin}/songs?checkout=cancelled#deluxe-edition`);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    const stripeJson = (await stripeRes.json().catch(() => ({}))) as {
      id?: string;
      url?: string;
      error?: { message?: string };
    };

    if (!stripeRes.ok || !stripeJson.url) {
      console.error('[AlbumCheckout] Stripe error:', stripeJson);
      return Response.json(
        {
          ok: false,
          error:
            stripeJson.error?.message ||
            'Unable to start Stripe Checkout right now. Please try again.',
        },
        { status: 502 }
      );
    }

    return Response.json({
      ok: true,
      unlocked: false,
      checkoutUrl: stripeJson.url,
      sessionId: stripeJson.id,
    });
  } catch (err) {
    console.error('[AlbumCheckout] Unexpected error:', err);
    return Response.json(
      { ok: false, error: 'Something went wrong starting checkout. Please try again.' },
      { status: 500 }
    );
  }
}
