import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationPath = path.resolve(__dirname, '../../sql/schema.sql');

const sql = fs.readFileSync(migrationPath, 'utf8');
await pool.query(sql);
console.log('Database schema migrated.');
await pool.end();
