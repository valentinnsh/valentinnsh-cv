import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const defaultChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chromePath = process.env.CHROME_PATH || (existsSync(defaultChrome) ? defaultChrome : undefined);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:4322${process.env.BASE_PATH || '/'}`,
    browserName: 'chromium',
    launchOptions: chromePath ? { executablePath: chromePath } : {},
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4322 --ignore-lock',
    url: `http://127.0.0.1:4322${process.env.BASE_PATH || '/'}`,
    reuseExistingServer: false,
  },
});
