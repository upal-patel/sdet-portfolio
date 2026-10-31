// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,       // a stray test.only fails the CI run
  retries: process.env.CI ? 1 : 0,    // retries are a safety net, not a fix
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // ---------- UI: Sauce Demo shop ----------
    {
      name: 'ui-setup',
      testDir: './tests/ui',
      testMatch: /auth\.setup\.js/,
      use: { baseURL: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com', testIdAttribute: 'data-test' },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      testIgnore: /auth\.setup\.js/,
      dependencies: ['ui-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
        testIdAttribute: 'data-test',   // Sauce Demo uses data-test="..."
        storageState: '.auth/user.json',
      },
    },
    // TODO(week 3): add Firefox, WebKit and a mobile project (devices['Pixel 7'])

    // ---------- API: Restful Booker (no browser needed) ----------
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },

    // ---------- AI evals: claim-note summariser ----------
    { name: 'ai', testDir: './tests/ai' },
  ],
});
