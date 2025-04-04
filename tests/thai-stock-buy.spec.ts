import { test, expect } from '@playwright/test';

test.describe('Thai Stock Buying Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('your-app-url');
    await page.goto('/buy-stocks');
  });

  test('basic layout and functionality', async ({ page }) => {
    // Stock info and form layout validation
    await expect(page.getByTestId('stock-info-section')).toBeVisible();
    await expect(page.getByTestId('buy-form-section')).toBeVisible();

    // Share quantity validation
    await page.getByLabel('Number of shares').fill('50');
    await expect(page.getByText('Minimum 100 shares required')).toBeVisible();

    await page.getByLabel('Number of shares').fill('150');
    await expect(page.getByText('Shares must be a multiple of 100')).toBeVisible();

    await page.getByLabel('Number of shares').fill('200');
    await expect(page.getByText('Minimum 100 shares required')).not.toBeVisible();
  });

  test('THB amount validation', async ({ page }) => {
    const currentPrice = 10;
    const minShares = 100;
    const minAmount = minShares * currentPrice;

    await page.getByLabel('THB Amount').fill((minAmount - 1).toString());
    await expect(page.getByText(`Minimum amount is ${minAmount} THB`)).toBeVisible();
    await expect(page.getByLabel('THB Amount')).toHaveValue(minAmount.toString());
  });

  test('price range validation', async ({ page }) => {
    const currentPrice = 100;
    const maxPrice = currentPrice * 1.3;
    const minPrice = currentPrice * 0.7;

    await page.getByLabel('Limit Price').fill((maxPrice + 1).toString());
    await expect(page.getByText('Price cannot exceed 30% of current price')).toBeVisible();

    await page.getByLabel('Limit Price').fill((minPrice - 1).toString());
    await expect(page.getByText('Price cannot be less than 70% of current price')).toBeVisible();
  });

  test('commission calculations', async ({ page }) => {
    // Normal commission
    await page.getByLabel('Number of shares').fill('100');
    await page.getByLabel('Limit Price').fill('100');

    const orderValue = 10000; // 100 shares * 100 price
    const commission = orderValue * 0.0015;
    const vat = commission * 0.07;

    await expect(page.getByTestId('commission-amount')).toHaveText(commission.toFixed(2));
    await expect(page.getByTestId('vat-amount')).toHaveText(vat.toFixed(2));

    // Free commission on 1st of month
    await page.evaluate(() => {
      const mockDate = new Date('2025-04-01');
      Date.now = () => mockDate.getTime();
    });
    await expect(page.getByText('Free Commission Applied')).toBeVisible();
  });

  test('order type and timing validation', async ({ page }) => {
    // Order types
    const orderTypes = ['Limit', 'Market', 'ATO', 'ATC'];
    for (const type of orderTypes) {
      await page.getByLabel('Order Type').selectOption(type);
      await expect(page.getByLabel('Order Type')).toHaveValue(type);
    }

    // Market timing
    await page.evaluate(() => {
      const mockDate = new Date();
      mockDate.setHours(7, 29);
      Date.now = () => mockDate.getTime();
    });
    await page.getByRole('button', { name: 'Submit Order' }).click();
    await expect(page.getByText('Orders can only be submitted between 07:30 - 16:45')).toBeVisible();
  });

  test('order creation and validation', async ({ page }) => {
    await page.getByLabel('Number of shares').fill('100');
    await page.getByLabel('Limit Price').fill('100');
    await page.getByRole('button', { name: 'Submit Order' }).click();

    await expect(page.getByTestId('order-id')).toHaveText(/TSBY\d{8}\d{5}/);
    await expect(page.getByTestId('order-status')).toHaveText(/Pending|Executing|Completed|Rejected/);
  });
});