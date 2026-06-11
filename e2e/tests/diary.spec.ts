import { expect, test } from '@playwright/test';

test.describe('Dashboard diary', () => {
  test('register, complete onboarding, and open diary', async ({ page }) => {
    const email = `e2e-${Date.now()}@example.com`;
    const password = 'Abcdef12abcd';

    await page.goto('/register');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^пароль$|^password$/i).fill(password);
    await page.getByLabel(/подтверд|confirm/i).fill(password);
    await page.getByRole('button', { name: /продолжить|continue/i }).click();

    await expect(
      page.getByRole('button', { name: /перейти в кабинет|go to dashboard/i }),
    ).toBeVisible();
    await page.getByRole('button', { name: /перейти в кабинет|go to dashboard/i }).click();

    await page.waitForURL(/\/overview/);

    await page.goto('/diary');
    await expect(page.getByRole('button', { name: /новая запись|new entry/i })).toBeVisible();
  });
});
