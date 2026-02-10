import pkg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pkg;

if (!env.dbUrl) {
  console.warn('DATABASE_URL is not set. Database operations will fail until configured.');
}

export const pool = new Pool({
  connectionString: env.dbUrl,
  ssl: env.dbUrl?.includes('localhost') ? false : { rejectUnauthorized: false }
});
