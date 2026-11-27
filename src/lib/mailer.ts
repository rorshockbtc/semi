import nodemailer from 'nodemailer';

const SITE_URL = 'https://semi.colonhyphenbracket.pink';
const PHOTO_URL = `${SITE_URL}/photos/semi-smiling-portrait.jpg`;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || process.env.PRIVATE_EMAIL_HOST || 'mail.privateemail.com';
  const port = Number(process.env.SMTP_PORT || process.env.PRIVATE_EMAIL_PORT || 465);
  const user = process.env.SMTP_USER || process.env.PRIVATE_EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.PRIVATE_EMAIL_PASS;
  return { host, port, user, pass };
}

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
                I wrote <em>I/O</em> one song at a time here in West Nashville—mostly acoustic guitar, mandolin when the rain lets up, and notes from the conversations people trust me to keep. All twelve songs are up right now if you want to put them on while you work or drive.
              </p>
              <p style="margin:0 0 22px 0;">
                I won’t crowd your inbox. Whenever a new track or studio note goes up, I’ll send you a quiet postcard right here.
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
                      Listen to I/O (12 songs) &rarr;
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
    'I wrote I/O one song at a time here in West Nashville—mostly acoustic guitar, mandolin when the rain lets up, and notes from the conversations people trust me to keep. All twelve songs are up right now if you want to put them on while you work or drive:',
    `${SITE_URL}/songs`,
    '',
    'I won’t crowd your inbox. Whenever a new track or studio note goes up, I’ll send you a quiet postcard right here.',
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
  const { host, port, user, pass } = getSmtpConfig();
  if (!user || !pass) {
    return { sent: false, skippedReason: 'smtp_not_configured' };
  }

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

export async function sendDeluxeReceiptEmail(params: {
  recipientEmail: string;
  accessToken: string;
  origin?: string;
}): Promise<{ sent: boolean; skippedReason?: string }> {
  const { host, port, user, pass } = getSmtpConfig();
  if (!user || !pass) {
    return { sent: false, skippedReason: 'smtp_not_configured' };
  }

  const baseUrl = params.origin || SITE_URL;
  const vaultUrl = `${baseUrl}/songs?deluxeToken=${encodeURIComponent(params.accessToken)}#deluxe-edition`;

  const text = [
    'Hey —',
    '',
    'Thank you for picking up the Deluxe Collector’s Edition of I/O.',
    '',
    'Your permanent download link (all 12 main tracks + Bonus Tracks 13, 14, and 15—closing with the alternate studio take of “Ghost”—plus cover art and any future remasters or additions) is ready here:',
    vaultUrl,
    '',
    'Save this email, or sign in anytime on the site with this email address to download future album updates for free—you will never have to pay twice.',
    '',
    'With gratitude from West Nashville,',
    'Semi  ; - ]',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:28px 16px;background-color:#E8E2D5;color:#111827;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#FAF8F5;border:1px solid #D6CFC1;border-radius:16px;padding:28px 32px;">
          <tr>
            <td style="font-size:17px;line-height:1.7;color:#111827;">
              <p style="margin:0 0 16px 0;">Hey —</p>
              <p style="margin:0 0 16px 0;">Thank you for picking up the <strong>Deluxe Collector’s Edition of <em>I/O</em></strong>.</p>
              <p style="margin:0 0 22px 0;">Your copy includes all 12 album tracks plus the 3 exclusive West Nashville alternate takes at the end of the record—closing with Track 15, <em>Ghost (Alternate Take)</em>—along with lifetime access to any future audio updates or new art.</p>
              <p style="margin:0 0 26px 0;">
                <a href="${vaultUrl}" style="display:inline-block;padding:13px 24px;border-radius:999px;background-color:#FE299E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">
                  Open your I/O Deluxe Vault &amp; Download &rarr;
                </a>
              </p>
              <p style="margin:0 0 18px 0;font-size:15px;color:#4B5563;">Whenever we update a track or add new album artwork, you can return to this link—or enter <strong>${params.recipientEmail}</strong> on the site for a 6-digit access code—without ever paying twice.</p>
              <p style="margin:0;">With gratitude,<br /><strong>Semi</strong> &nbsp;<span style="color:#FE299E;font-weight:700;">; - ]</span></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    from: `"Semi" <${user}>`,
    to: params.recipientEmail,
    bcc: user,
    replyTo: user,
    subject: 'Your I/O Deluxe Edition download & lifetime update link — Semi (; - ])',
    text,
    html,
  });

  return { sent: true };
}

export async function sendDeluxeLoginCodeEmail(params: {
  recipientEmail: string;
  code: string;
}): Promise<{ sent: boolean; skippedReason?: string }> {
  const subject = `${params.code} is your I/O Deluxe Edition access code`;
  const text = [
    'Hey —',
    '',
    `Your 6-digit access code to unlock your I/O Deluxe Edition downloads & updates is: ${params.code}`,
    '',
    'This code stays good for 15 minutes.',
    '',
    '— Semi  ; - ]',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:28px 16px;background-color:#E8E2D5;color:#111827;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;background-color:#FAF8F5;border:1px solid #D6CFC1;border-radius:16px;padding:28px 32px;">
          <tr>
            <td style="font-size:17px;line-height:1.7;color:#111827;">
              <p style="margin:0 0 14px 0;">Your 6-digit code to access your <strong><em>I/O</em> Deluxe Edition</strong> library and latest updates:</p>
              <div style="margin:18px 0 22px 0;padding:16px 20px;border-radius:12px;background-color:#F3EFE9;border:1px solid #D6CFC1;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:28px;font-weight:700;letter-spacing:0.22em;text-align:center;color:#111827;">
                ${params.code}
              </div>
              <p style="margin:0 0 14px 0;font-size:14px;color:#4B5563;">Valid for 15 minutes.</p>
              <p style="margin:0;">— <strong>Semi</strong> &nbsp;<span style="color:#FE299E;font-weight:700;">; - ]</span></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      const from = process.env.RESEND_FROM?.trim() || 'Semi <semi@colonhyphenbracket.pink>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to: [params.recipientEmail], subject, text, html }),
      });
      if (res.ok) return { sent: true };
    } catch {
      // Fall through to SMTP or clean fallback
    }
  }

  const { host, port, user, pass } = getSmtpConfig();
  if (!user || !pass) {
    return { sent: false, skippedReason: 'smtp_not_configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"Semi" <${user}>`,
      to: params.recipientEmail,
      replyTo: user,
      subject,
      text,
      html,
    });

    return { sent: true };
  } catch (err) {
    console.warn('[Mailer] SMTP send failed (likely Workers socket restriction):', err);
    return { sent: false, skippedReason: 'smtp_unavailable' };
  }
}
