import { defineConfig, devices } from '@playwright/test';

const reuseExistingServer = !process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'landing',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3001',
      },
    },
    {
      name: 'dashboard',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3003',
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter api dev',
      url: 'http://localhost:3000/health',
      reuseExistingServer,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter landing dev',
      url: 'http://localhost:3001',
      reuseExistingServer,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter dashboard dev',
      url: 'http://localhost:3003',
      reuseExistingServer,
      timeout: 120_000,
    },
  ],
});
