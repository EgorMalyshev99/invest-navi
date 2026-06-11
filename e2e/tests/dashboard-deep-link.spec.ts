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

  test('unauthenticated /market redirects to login with from', async ({ page }) => {
    await page.goto('/market');

    await expect(page).toHaveURL(/\/login\?from=%2Fmarket|\/login\?from=\/market/);
    await expect(page.getByRole('heading', { name: /вход|sign in/i })).toBeVisible();
  });

  test('direct /market loads SPA without 404', async ({ page }) => {
    const response = await page.goto('/market');
    expect(response?.status()).not.toBe(404);

    await page.reload();
    expect(page.url()).toMatch(/\/(market|login)/);
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('OAuth callback error redirects to login with message', async ({ page }) => {
    await page.goto('/auth/yandex/callback?error=access_denied');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/отмен|cancelled|denied/i)).toBeVisible();
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('direct /auth/yandex/callback loads OAuth handler', async ({ page }) => {
    const response = await page.goto('/auth/yandex/callback?error=access_denied');
    expect(response?.status()).not.toBe(404);

    await expect(page).toHaveURL(/\/login/);

    await page.reload();
    expect(page.url()).toMatch(/\/login/);
    await expect(page.locator('#root')).not.toBeEmpty();
  });
});
