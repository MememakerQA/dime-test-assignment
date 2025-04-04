import { APIRequestContext } from '@playwright/test';
import { databaseConfig } from '../test-datas/config';
import mysql, { ConnectionOptions } from 'mysql2';

export class BuyThaiStock {
  private readonly request: APIRequestContext;
  private readonly serviceEndpoint: string;
  responseCode: number;
  responseBody: any;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.serviceEndpoint = process.env.SERVICE_ENDPOINT || 'http://localhost:3000/buy-thai-stock';
  }

  async postBuyThaiStock() {
    const response = await this.request.post(this.serviceEndpoint, {
      data: {
        price: 100,
        qty: 100,
        commission: 0.0015,
        vat: 0.07,
        symbol: 'PTT',
        stockId: 'PTT',
        orderType: 'BUY',
      },
      headers: {
        'Content-Type': 'application/json',
        userId: process.env.USER_ID || 'any',
      },
    });

    this.responseCode = response.status();
    this.responseBody = await response.json();
  }

  async queryBuyThaiStock() {
    try {
      const database = mysql.createConnection(databaseConfig as ConnectionOptions);
      return new Promise((resolve, reject) => {
        database.query('SELECT * FROM stock_orders ORDER BY created_at DESC LIMIT 1', (error, results) => {
          database.end();
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error('Error querying stock orders:', error);
      throw error;
    }
  }
}