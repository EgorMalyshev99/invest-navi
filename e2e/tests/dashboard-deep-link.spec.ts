import { expect, test } from '@playwright/test';

test.describe('Dashboard deep links', () => {
  test('direct /login survives reload', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response?.status()).not.toBe(404);

    await expect(page.getByRole('heading', { name: /вход|sign in/i })).toBeVisible();

    await page.reload();
    expect(page.url()).toMatch(/\/login/);
    await expect(page.getByRole('heading', { name: /вход|sign in/i })).toBeVisible();
  });

  test('direct /market loads SPA without 404', async ({ page }) => {
    const response = await page.goto('/market');
    expect(response?.status()).not.toBe(404);

    await page.reload();
    expect(page.url()).toMatch(/\/(market|login)/);
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('direct /auth/yandex/callback loads OAuth handler', async ({ page }) => {
    const response = await page.goto('/auth/yandex/callback?error=access_denied');
    expect(response?.status()).not.toBe(404);

    await expect(page).toHaveURL(/\/(login|auth\/yandex\/callback)/);
    await expect(page.locator('#root')).not.toBeEmpty();

    await page.reload();
    expect(page.url()).toMatch(/\/(login|auth\/yandex\/callback)/);
    await expect(page.locator('#root')).not.toBeEmpty();
  });
});
