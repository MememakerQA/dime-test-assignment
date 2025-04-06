export const errorCode = {
    badRequest: 'BAD_REQUEST',
    userNotFound: 'USER_NOT_FOUND',
    invalidExecutionTime: 'INVALID_EXECUTION_TIME',
    invalidFeeCalculation: 'INVALID_FEE_CALCULATION',
    priceControlValidation: 'PRICE_CONTROL_VALIDATION',
    inactiveAccount: 'INACTIVE_ACCOUNT',
    insufficientBuyerPower: 'INSUFFICIENT_BUYER_POWER',
    InternalServerError: 'INTERNAL_SERVER_ERROR',
};

export const errorMessage = {
    badRequest: 'invalid request format',
    userNotFound: 'invalid user id / not found',
    invalidExecutionTime: 'invalid execution time',
    invalidFeeCalculation: 'invalid comm, vat calculation',
    priceControlValidation: 'invalid price (exceed/under 30%)',
    inactiveAccount: 'Inactive account status',
    insufficientBuyerPower: 'Insufficient buying power',
    InternalServerError: 'Error from external system',
};
