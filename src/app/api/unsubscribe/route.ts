import { unsubscribeByToken } from '@/lib/subscribers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token') ?? '';
  const removed = await unsubscribeByToken(token);

  const heading = removed
    ? 'You’ve been removed from Semi’s song list.'
    : 'That unsubscribe link was already used or wasn’t recognized.';
  const detail = removed
    ? 'No hard feelings at all—the porch is always open whenever you feel like listening.'
    : 'If you still get an unwanted note, just reply to cubby@colonhyphenbracket.pink and we’ll take care of it right away.';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unsubscribed · Semi</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#E8E2D5;color:#111827;font-family:Georgia,'Times New Roman',serif;padding:24px;">
  <main style="max-width:480px;background:#F3EFE9;border:1px solid #D6CFC1;border-radius:20px;padding:36px 32px;text-align:center;">
    <p style="margin:0 0 12px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:18px;font-weight:700;color:#FE299E;">; - ]</p>
    <h1 style="margin:0 0 14px 0;font-size:24px;line-height:1.25;">${heading}</h1>
    <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#4B5563;">${detail}</p>
    <a href="/" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#111827;color:#F3EFE9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;font-weight:600;text-decoration:none;">Back to Semi’s songs</a>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
