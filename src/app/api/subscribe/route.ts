import { NextResponse } from 'next/server';
import { sendSemiWelcomeEmail } from '@/lib/mailer';
import { normalizeTopics, recordSubscriberTopics, upsertSubscriber } from '@/lib/subscribers';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isSyntheticTestEmail(email: string): boolean {
  return /@(example\.com|example\.org|semi\.test|playwright\.local)$/i.test(email);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { email?: unknown; topics?: unknown };
    const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const topics = normalizeTopics(body.topics);

    if (!rawEmail || rawEmail.length > 254 || !EMAIL_RE.test(rawEmail)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const { record, isNewOrReactivated, storage } = await upsertSubscriber(rawEmail);
    try {
      await recordSubscriberTopics(rawEmail, topics);
    } catch (topicErr) {
      console.warn('[Subscribe] Topic save warning (subscriber still saved):', topicErr);
    }

    let emailDispatched = false;
    if (isNewOrReactivated && !isSyntheticTestEmail(rawEmail)) {
      try {
        const result = await sendSemiWelcomeEmail({
          recipientEmail: record.email,
          unsubscribeToken: record.unsubscribeToken,
        });
        emailDispatched = result.sent;
      } catch (mailErr) {
        console.warn('[Subscribe] Welcome email warning (subscriber still saved):', mailErr);
      }
    }

    return NextResponse.json({
      ok: true,
      alreadySubscribed: !isNewOrReactivated,
      emailDispatched,
      storage,
      message: isNewOrReactivated
        ? 'You’re on the list. Check your inbox for a quick note from Semi.'
        : 'You’re already on Semi’s list—she’ll write when the next song goes up.',
    });
  } catch (err) {
    console.error('[Subscribe] Unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Something went sideways saving your email. Please try again.' },
      { status: 500 }
    );
  }
}
