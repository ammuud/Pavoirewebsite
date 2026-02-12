import { env } from '../config/env.js';

const canSendWithResend = Boolean(env.resendApiKey && env.resendFromEmail);

export const sendEmail = async ({ to, subject, html }) => {
  if (!canSendWithResend) {
    console.log(`[EMAIL MOCK] Missing RESEND config. to=${to} subject=${subject}`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.resendFromEmail,
      to: [to],
      subject,
      html
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${text}`);
  }
};
