import { APIRequestContext, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import {
    IThaiStockBuying,
    IThaiStockBuyingResponse,
} from '../models/thai-stock-buying';
import { dbConfig } from '../config/database';
import mysql from 'mysql2/promise';

const env = process.env.NODE_ENV || 'demo';
const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envFilePath });

export class ThaiStockBuyingRequest {
    readonly request: APIRequestContext;
    readonly userId: string;
    readonly endpoint: string =
        process.env.SERVICE_ENDPOINT || 'localhost:8080/qa-exam/create-order';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * Create a new order
     * @param userId - The user ID of the user creating the order
     * @param data - The order data to be sent in the request body
     * @returns The response from the server
     */
    async postCreateNewOrder(userId: string, data: IThaiStockBuying) {
        const response = await this.request.post(this.endpoint, {
            data: data,
            headers: {
                userId: userId,
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    /**
     * Calculate commission fee based on multiplying price and quantity
     * @param price - The price of the stock
     * @param qty - The quantity of stocks
     * @returns Commission fee amount
     */
    calCommissionFee(price: number, qty: number) {
        return price * qty * 0.0015;
    }

    /**
     * Calculate VAT based on commission fee
     * @param commissionFee - Commission fee amount
     * @returns VAT amount (7% of commission fee)
     */
    calVat(commissionFee: number) {
        return commissionFee * 0.07;
    }

    /**
     * Verify that API response data matches what's stored in the database
     * @param responseBody - API response body to verify
     * @throws Error if verification fails or database query fails
     */
    async verifyResponseIsMatchWithDB(responseBody: IThaiStockBuyingResponse) {
        const responseData = responseBody.data;
        const orderDetailFromDb = await this.getOrderDetailFromDbById(
            responseData.orderId,
        );

        if (!orderDetailFromDb || orderDetailFromDb.length === 0) {
            throw new Error(`No order found with ID: ${responseData.orderId}`);
        }

        const dbRecord = orderDetailFromDb[0];

        const fieldsToVerify = [
            'orderId',
            'orderType',
            'price',
            'qty',
            'commission',
            'vat',
            'symbol',
            'stockId',
        ];

        for (const field of fieldsToVerify) {
            expect(dbRecord[field]).toBe(responseData[field]);
        }
    }

    /**
     * Retrieve order details from database by order ID
     * @param orderId - ID of the order to retrieve
     * @returns Array of matching order records
     * @throws Error if database query fails
     */
    async getOrderDetailFromDbById(orderId: string) {
        const database = await mysql.createConnection(dbConfig);
        try {
            await database.connect();
            const getOrderDetailQuery =
                'SELECT * FROM `thai-stock-buying` WHERE orderId = ?';
            const [rows] = (await database.execute(getOrderDetailQuery, [
                orderId,
            ])) as [any[], any];
            return rows;
        } catch (error) {
            console.error('Database query failed:', error);
            throw new Error(`Failed to get order details: ${error.message}`);
        } finally {
            await database.end();
        }
    }
}
