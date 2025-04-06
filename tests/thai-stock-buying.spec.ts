import { expect, test } from '@playwright/test';
import { ThaiStockBuyingRequest } from '../requests/thai-stock-buying';
import { error } from 'console';
import { errorCode, errorMessage } from '../test-datas/error-response';

test.describe('Thai Stock Buying API Tests - Success Case', () => {
    test('SV-003: Verify send thai stock buying api with No. of share is minimum value', async ({
        request,
    }) => {
        const thaiStockBuyingRequest = new ThaiStockBuyingRequest(request);
        const commissionFee = thaiStockBuyingRequest.calCommissionFee(100, 100);
        const vat = thaiStockBuyingRequest.calVat(commissionFee);
        const userId = 'e6060427-5618-4a58-945d-b0a060478337';
        const data = {
            price: 100,
            qty: 100,
            commission: commissionFee,
            vat: vat,
            symbol: 'KKP',
            stockId: '999901',
            orderType: 'limit',
        };

        const response = await thaiStockBuyingRequest.postCreateNewOrder(
            userId,
            data,
        );
        const responseBody = await response.json();

        expect(response.status()).toBe(200);
        await thaiStockBuyingRequest.verifyResponseIsMatchWithDB(responseBody);
    });

    test('PV-002: Verify send thai stock buying api with limit price is less than current price but more than 70% of current price', async ({
        request,
    }) => {
        const thaiStockBuyingRequest = new ThaiStockBuyingRequest(request);
        const commissionFee = thaiStockBuyingRequest.calCommissionFee(70, 100);
        const vat = thaiStockBuyingRequest.calVat(commissionFee);
        const userId = 'e6060427-5618-4a58-945d-b0a060478337';
        const data = {
            price: 70,
            qty: 100,
            commission: commissionFee,
            vat: vat,
            symbol: 'KKP',
            stockId: '999901',
            orderType: 'limit',
        };

        const response = await thaiStockBuyingRequest.postCreateNewOrder(
            userId,
            data,
        );
        const responseBody = await response.json();

        expect(response.status()).toBe(200);
        await thaiStockBuyingRequest.verifyResponseIsMatchWithDB(responseBody);
    });

    test('PV-004: Verify send thai stock buying api with limit price is more than current price but less than 130% of current price', async ({
        request,
    }) => {
        const thaiStockBuyingRequest = new ThaiStockBuyingRequest(request);
        const commissionFee = thaiStockBuyingRequest.calCommissionFee(130, 100);
        const vat = thaiStockBuyingRequest.calVat(commissionFee);
        const userId = 'e6060427-5618-4a58-945d-b0a060478337';
        const data = {
            price: 130,
            qty: 100,
            commission: commissionFee,
            vat: vat,
            symbol: 'KKP',
            stockId: '999901',
            orderType: 'limit',
        };

        const response = await thaiStockBuyingRequest.postCreateNewOrder(
            userId,
            data,
        );
        const responseBody = await response.json();

        expect(response.status()).toBe(200);
        await thaiStockBuyingRequest.verifyResponseIsMatchWithDB(responseBody);
    });
});

test.describe('Thai Stock Buying API Tests - Error Case', () => {
    test('SV-001: Verify send thai stock buying api with No. of share is less than minimum value', async ({
        request,
    }) => {
        const thaiStockBuyingRequest = new ThaiStockBuyingRequest(request);
        const commissionFee = thaiStockBuyingRequest.calCommissionFee(100, 99);
        const vat = thaiStockBuyingRequest.calVat(commissionFee);
        const userId = 'e6060427-5618-4a58-945d-b0a060478337';
        const data = {
            price: 100,
            qty: 99,
            commission: commissionFee,
            vat: vat,
            symbol: 'KKP',
            stockId: '999901',
            orderType: 'limit',
        };

        const response = await thaiStockBuyingRequest.postCreateNewOrder(
            userId,
            data,
        );
        const responseBody = await response.json();

        expect(response.status()).toBe(400);
        expect(responseBody.error.code).toBe(errorCode.badRequest);
        expect(responseBody.error.message).toBe(errorMessage.badRequest);
    });

    test('PV-003: Verify send thai stock buying api with limit price is less than 70% of current price', async ({
        request,
    }) => {
        const thaiStockBuyingRequest = new ThaiStockBuyingRequest(request);
        const commissionFee = thaiStockBuyingRequest.calCommissionFee(69, 100);
        const vat = thaiStockBuyingRequest.calVat(commissionFee);
        const userId = 'e6060427-5618-4a58-945d-b0a060478337';
        const data = {
            price: 69,
            qty: 100,
            commission: commissionFee,
            vat: vat,
            symbol: 'KKP',
            stockId: '999901',
            orderType: 'limit',
        };
        const response = await thaiStockBuyingRequest.postCreateNewOrder(
            userId,
            data,
        );
        const responseBody = await response.json();
        expect(response.status()).toBe(400);
        expect(responseBody.error.code).toBe(errorCode.priceControlValidation);
        expect(responseBody.error.message).toBe(
            errorMessage.priceControlValidation,
        );
    });

    test('CV-001: Verify send thai stock buying api with invalid commission calculation', async ({
        request,
    }) => {
        const thaiStockBuyingRequest = new ThaiStockBuyingRequest(request);
        const commissionFee = thaiStockBuyingRequest.calCommissionFee(100, 100);
        const vat = thaiStockBuyingRequest.calVat(commissionFee);
        const userId = 'e6060427-5618-4a58-945d-b0a060478337';
        const data = {
            price: 100,
            qty: 100,
            commission: commissionFee + 1,
            vat: vat,
            symbol: 'KKP',
            stockId: '999901',
            orderType: 'limit',
        };

        const response = await thaiStockBuyingRequest.postCreateNewOrder(
            userId,
            data,
        );
        const responseBody = await response.json();

        expect(response.status()).toBe(400);
        expect(responseBody.error.code).toBe(errorCode.invalidFeeCalculation);
        expect(responseBody.error.message).toBe(
            errorMessage.invalidFeeCalculation,
        );
    });
});
