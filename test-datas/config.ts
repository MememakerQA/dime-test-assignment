import dotenv from 'dotenv';

dotenv.config();

export const serviceEndpoint = process.env.SERVICE_ENDPOINT || 'localhost:8080/qa-exam/create-order';

export const databaseConfig = {
  moduleName: 'pymysql',
  dbName: process.env.DB_NAME || 'th-stock',
  user: process.env.DB_USER || 'any',
  password: process.env.DB_PASSWORD || '1234',
  host: process.env.DB_HOST || 'thstock-host-db',
  port: 1234,
};