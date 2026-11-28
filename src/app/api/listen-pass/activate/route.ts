import { NextResponse } from 'next/server';
import {
  LISTEN_PASS_COOKIE_NAME,
  createDeviceStreamToken,
  verifyDeviceStreamToken,
  verifyPhysicalPassCode,
} from '@/lib/listen-pass';

export const dynamic = 'force-dynamic';

function readCookieToken(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = new RegExp(`(?:^|;\\s*)${LISTEN_PASS_COOKIE_NAME}=([^;]+)`).exec(cookieHeader);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      pass?: string;
      deviceId?: string;
    };

    const incomingPass = typeof body.pass === 'string' ? body.pass.trim() : '';
    const incomingDeviceId =
      typeof body.deviceId === 'string'
        ? body.deviceId.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
        : '';

    // 1. Check if this device already holds a valid bound stream token cookie
    const existingCookie = readCookieToken(request);
    const existingCheck = await verifyDeviceStreamToken(existingCookie);
    if (existingCheck.valid && existingCheck.deviceId) {
      return NextResponse.json({
        active: true,
        deviceId: existingCheck.deviceId,
        streamToken: existingCookie,
        remembered: true,
      });
    }

    // 2. Otherwise verify the scanned physical pass code & bind to this deviceId
    const passValid = await verifyPhysicalPassCode(incomingPass);
    if (!passValid) {
      return NextResponse.json(
        { active: false, error: 'Scan a valid physical listening pass QR code to unlock streaming.' },
        { status: 401 }
      );
    }

    const deviceId =
      incomingDeviceId ||
      `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    const streamToken = await createDeviceStreamToken(deviceId);

    const res = NextResponse.json({
      active: true,
      deviceId,
      streamToken,
      remembered: false,
    });

    res.cookies.set(LISTEN_PASS_COOKIE_NAME, streamToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // Remember this device for 1 year
    });

    return res;
  } catch {
    return NextResponse.json(
      { active: false, error: 'Could not activate listening pass.' },
      { status: 500 }
    );
  }
}
