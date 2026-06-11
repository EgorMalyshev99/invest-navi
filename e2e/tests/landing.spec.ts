import { expect, test } from '@playwright/test';

test.describe('Landing', () => {
  test('shows hero and primary CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /начать|start free/i })).toBeVisible();
  });

  test('product section mentions learning and weekly review', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /обучение|learning/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /обзор недели|weekly review/i })).toBeVisible();
  });
});
