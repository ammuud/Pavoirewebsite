import { Router } from 'express';
import { pool } from '../db/pool.js';
import { env } from '../config/env.js';
import { generateOtpCode } from '../utils/otp.js';
import { hashValue } from '../utils/crypto.js';
import { sendEmail } from '../services/email.service.js';
import { signSession } from '../utils/auth.js';

const router = Router();

router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = generateOtpCode();
  const otpHash = hashValue(otp);
  const expiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);

  await pool.query(
    `INSERT INTO users(email, otp_hash, otp_expires_at)
     VALUES($1, $2, $3)
     ON CONFLICT(email) DO UPDATE SET otp_hash = $2, otp_expires_at = $3, updated_at = NOW()`,
    [email.toLowerCase(), otpHash, expiresAt]
  );

  await sendEmail({
    to: email,
    subject: 'Your Pavoire OTP Code',
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in ${env.otpExpiryMinutes} minutes.</p>`
  });

  return res.json({ message: 'OTP sent successfully' });
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = result.rows[0];

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.otp_hash || !user.otp_expires_at) return res.status(400).json({ message: 'No OTP requested' });
  if (new Date(user.otp_expires_at) < new Date()) return res.status(400).json({ message: 'OTP expired' });

  const valid = hashValue(otp) === user.otp_hash;
  if (!valid) return res.status(400).json({ message: 'Invalid OTP' });

  await pool.query('UPDATE users SET otp_hash = NULL, otp_expires_at = NULL WHERE id = $1', [user.id]);

  const token = signSession({ userId: user.id, email: user.email, role: user.role });
  return res.json({ message: 'Verified', token, user: { id: user.id, email: user.email, role: user.role } });
});

export default router;
