import { NextResponse } from 'next/server';
import { getPhysicalPassCode, isListenPassOwnerEmail } from '@/lib/listen-pass';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { email?: string };
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!isListenPassOwnerEmail(email)) {
      return NextResponse.json(
        { error: 'This QR pass generator is restricted to the album owner.' },
        { status: 403 }
      );
    }

    const passCode = await getPhysicalPassCode();
    const passUrl = `${SITE_URL}/listen?pass=${encodeURIComponent(passCode)}`;

    return NextResponse.json({
      ok: true,
      passCode,
      passUrl,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to generate pass QR.' }, { status: 500 });
  }
}
