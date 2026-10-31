const { test, expect } = require('../../fixtures');

// These tests need a logged-out browser, so they drop the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test('valid user lands on the inventory page', { tag: '@smoke' }, async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});

test('locked-out user sees a clear error', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('locked_out_user', 'secret_sauce');
  await loginPage.expectError(/locked out/i);
});

const invalid = [
  { name: 'empty username', user: '', pass: 'secret_sauce', error: /Username is required/ },
  { name: 'empty password', user: 'standard_user', pass: '', error: /Password is required/ },
  { name: 'wrong password', user: 'standard_user', pass: 'nope', error: /do not match/ },
];

for (const c of invalid) {
  test(`login rejects ${c.name}`, async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(c.user, c.pass);
    await loginPage.expectError(c.error);
  });
}
