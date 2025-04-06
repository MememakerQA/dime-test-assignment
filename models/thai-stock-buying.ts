export interface IThaiStockBuying {
    price: number;
    qty: number;
    commission: number;
    vat: number;
    symbol: string;
    stockId: string;
    orderType: string;
}

export interface IThaiStockBuyingResponse {
    data: {
        orderId: string;
        orderType: string;
        price: number;
        qty: number;
        commission: number;
        vat: number;
        symbol: string;
        stockId: string;
    };
}
