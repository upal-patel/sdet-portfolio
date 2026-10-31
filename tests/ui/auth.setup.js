const { test: setup, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

// Log in once, save the session, and reuse it in every UI test (fast and stable).
setup('authenticate', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(process.env.SAUCE_USER ?? 'standard_user', process.env.SAUCE_PASSWORD ?? 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: '.auth/user.json' });
});
