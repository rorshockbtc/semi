import nodemailer from 'nodemailer';

const SITE_URL = 'https://semi.colonhyphenbracket.pink';
const PHOTO_URL = `${SITE_URL}/photos/semi-smiling-portrait.jpg`;

export function buildSemiWelcomeEmailHtml(unsubscribeToken: string): string {
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  const songsUrl = `${SITE_URL}/songs`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>A quick note from Semi</title>
</head>
<body style="margin:0;padding:0;background-color:#E8E2D5;color:#111827;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#E8E2D5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#FAF8F5;border:1px solid #D6CFC1;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 0 28px;">
              <img
                src="${PHOTO_URL}"
                alt="Semi smiling in afternoon porch light in West Nashville"
                width="504"
                style="display:block;width:100%;max-width:504px;height:auto;border-radius:12px;border:1px solid #E5DFD3;"
              />
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 24px 32px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.7;color:#111827;">
              <p style="margin:0 0 18px 0;">Hey —</p>
              <p style="margin:0 0 18px 0;">
                Thanks for leaving your address.
              </p>
              <p style="margin:0 0 18px 0;">
                I’m writing <em>I/O</em> one song at a time here in West Nashville—mostly acoustic guitar, mandolin when the rain lets up, and notes from the conversations people trust me to keep. Five songs are up right now if you want to put them on while you work or drive.
              </p>
              <p style="margin:0 0 22px 0;">
                I won’t crowd your inbox. Whenever a new track goes up—and once all ten to fifteen songs are ready to download together as a full record—I’ll send you a quiet note right here.
              </p>
              <p style="margin:0 0 26px 0;">
                Glad you stopped by,<br />
                <strong>Semi</strong> &nbsp;<span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#FE299E;font-weight:700;">; - ]</span>
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius:999px;background-color:#FE299E;">
                    <a
                      href="${songsUrl}"
                      style="display:inline-block;padding:13px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;"
                    >
                      Listen to the 5 songs out now &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px 24px 32px;border-top:1px solid #E5DFD3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.6;color:#4B5563;">
              Sent from West Nashville via <a href="mailto:cubby@colonhyphenbracket.pink" style="color:#A3285C;text-decoration:underline;">cubby@colonhyphenbracket.pink</a>.
              If you ever want off this list, <a href="${unsubscribeUrl}" style="color:#4B5563;text-decoration:underline;">one click unsubscribes you immediately</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildSemiWelcomeEmailText(unsubscribeToken: string): string {
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  return [
    'Hey —',
    '',
    'Thanks for leaving your address.',
    '',
    'I’m writing I/O one song at a time here in West Nashville—mostly acoustic guitar, mandolin when the rain lets up, and notes from the conversations people trust me to keep. Five songs are up right now if you want to put them on while you work or drive:',
    `${SITE_URL}/songs`,
    '',
    'I won’t crowd your inbox. Whenever a new track goes up—and once all ten to fifteen songs are ready to download together as a full record—I’ll send you a quiet note right here.',
    '',
    'Glad you stopped by,',
    'Semi  ; - ]',
    '',
    '---',
    `Unsubscribe anytime: ${unsubscribeUrl}`,
  ].join('\n');
}

export async function sendSemiWelcomeEmail(params: {
  recipientEmail: string;
  unsubscribeToken: string;
}): Promise<{ sent: boolean; skippedReason?: string }> {
  const host = process.env.SMTP_HOST || process.env.PRIVATE_EMAIL_HOST || 'mail.privateemail.com';
  const port = Number(process.env.SMTP_PORT || process.env.PRIVATE_EMAIL_PORT || 465);
  const user = process.env.SMTP_USER || process.env.PRIVATE_EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.PRIVATE_EMAIL_PASS;

  if (!user || !pass) {
    return { sent: false, skippedReason: 'smtp_not_configured' };
  }

  // Instantiate per request so TCP sockets are never shared across Cloudflare Worker invocations
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const fromAddress = `"Semi" <${user}>`;
  await transporter.sendMail({
    from: fromAddress,
    to: params.recipientEmail,
    bcc: user,
    replyTo: user,
    subject: 'Glad you stopped by — a quick note from Semi',
    text: buildSemiWelcomeEmailText(params.unsubscribeToken),
    html: buildSemiWelcomeEmailHtml(params.unsubscribeToken),
  });

  return { sent: true };
}
