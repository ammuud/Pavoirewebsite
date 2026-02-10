import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const hasSmtp = Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass
      }
    })
  : null;

const fromEmail = env.smtpUser || 'noreply@pavoire.com';

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log(`[EMAIL MOCK] to=${to} subject=${subject}`);
    return;
  }
  await transporter.sendMail({ from: fromEmail, to, subject, html });
};
