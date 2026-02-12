import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signSession = (payload) => jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });

export const verifySession = (token) => jwt.verify(token, env.jwtSecret);
