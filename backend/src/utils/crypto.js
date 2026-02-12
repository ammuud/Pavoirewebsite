import crypto from 'crypto';

export const hashValue = (value) => crypto.createHash('sha256').update(value).digest('hex');

export const hmacSignature = (value, secret) => crypto.createHmac('sha256', secret).update(value).digest('hex');
