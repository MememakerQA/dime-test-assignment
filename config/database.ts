import { ConnectionOptions } from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'demo';
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envFilePath });

export const dbConfig: ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
};
