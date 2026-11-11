import dotenv from 'dotenv';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { VIEWPORTS } from './src/visual/viewports';

/** The contract test is the only one that hits the real API; it has its own project. */
const CONTRACT_SPEC = /contract\.spec\.ts/;

// Load credentials before anything else; workers re-evaluate this config, so they get them too.
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: './src/setup/clean-reports.ts',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Max 2 workers (Cloudflare); a single one on CI. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: false }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    baseURL: 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test',
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // Functional tests against the mocked API: all three browsers.
    {
      name: 'mock-chromium',
      testDir: './tests/mock',
      testIgnore: CONTRACT_SPEC,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mock-firefox',
      testDir: './tests/mock',
      testIgnore: CONTRACT_SPEC,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mock-webkit',
      testDir: './tests/mock',
      testIgnore: CONTRACT_SPEC,
      use: { ...devices['Desktop Safari'] },
    },

    // Contract: the one test that talks to the REAL API. No browser, runs once (not per browser).
    {
      name: 'contract',
      testDir: './tests/mock',
      testMatch: CONTRACT_SPEC,
    },

    // Visual regression: Chromium only, always headless. One project per viewport; the viewport
    // label also goes into every baseline file name (see tests/visual/helpers.ts).
    {
      name: 'visual-desktop',
      testDir: './tests/visual',
      metadata: { viewport: 'desktop' },
      use: { ...devices['Desktop Chrome'], viewport: VIEWPORTS.desktop },
    },
    {
      name: 'visual-mobile',
      testDir: './tests/visual',
      testMatch: /login.visual.spec.ts/, // only the login form is captured on mobile
      metadata: { viewport: 'mobile' },
      use: { ...devices['Desktop Chrome'], viewport: VIEWPORTS.mobile, isMobile: true, hasTouch: true },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
