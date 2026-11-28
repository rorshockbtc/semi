/**
 * Physical-distribution Stream-Only Listening Pass.
 * - Issued exclusively to cubby@colonhyphenbracket.pink for QR distribution.
 * - Binds to a listener's deviceId on activation so their device is remembered.
 * - Strictly online stream-only (Cache-Control: no-store, Content-Disposition: inline, no downloads).
 */

export const LISTEN_PASS_COOKIE_NAME = 'semi_listen_pass';

const OWNER_EMAILS = new Set([
  'cubby@colonhyphenbracket.pink',
  'cubby@colomhyphenbracket.pink', // typo-tolerant alias
]);

const PASS_SECRET =
  process.env.LISTEN_PASS_SECRET?.trim() ||
  process.env.DELUXE_TOKEN_SECRET?.trim() ||
  'semi-physical-listening-pass-v1-colonhyphenbracket-2026';

export function isListenPassOwnerEmail(email: string): boolean {
  return OWNER_EMAILS.has(email.trim().toLowerCase());
}

async function hmacHex(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(PASS_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Deterministic signed QR pass code for physical distribution.
 */
export async function getPhysicalPassCode(): Promise<string> {
  const sig = await hmacHex('physical-pass-v1:semi:all-albums');
  return `semi-v1-${sig.slice(0, 20)}`;
}

export async function verifyPhysicalPassCode(code: string | null | undefined): Promise<boolean> {
  if (!code) return false;
  const expected = await getPhysicalPassCode();
  return code.trim() === expected;
}

/**
 * Create a device-bound stream token after a listener activates a physical pass.
 */
export async function createDeviceStreamToken(deviceId: string): Promise<string> {
  const cleanId = deviceId.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  const payload = `dev:${cleanId}`;
  const sig = await hmacHex(payload);
  return `${cleanId}.${sig.slice(0, 24)}`;
}

export async function verifyDeviceStreamToken(
  token: string | null | undefined
): Promise<{ valid: boolean; deviceId?: string }> {
  if (!token) return { valid: false };
  const parts = token.trim().split('.');
  if (parts.length !== 2) return { valid: false };
  const [deviceId, sig] = parts;
  if (!deviceId || !sig) return { valid: false };
  const expected = await createDeviceStreamToken(deviceId);
  if (expected !== `${deviceId}.${sig}`) {
    return { valid: false };
  }
  return { valid: true, deviceId };
}
