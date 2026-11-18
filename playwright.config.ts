import { defineConfig, devices } from '@playwright/test';

const PORT = 3450;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run start`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
