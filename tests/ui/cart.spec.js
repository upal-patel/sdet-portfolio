const { test, expect } = require('../../fixtures');

test('adding two products updates the cart badge', { tag: '@smoke' }, async ({ inventoryPage }) => {
  await inventoryPage.goto();
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.addToCart('Sauce Labs Bike Light');
  await inventoryPage.expectCartCount(2);
});

test('inventory shows six products', async ({ inventoryPage }) => {
  await inventoryPage.goto();
  await expect(inventoryPage.items).toHaveCount(6);
});

// TODO(week 2): checkout happy path (add CartPage and CheckoutPage page objects)
// TODO(week 2): sort by price low-to-high and assert the order
// TODO(week 5): page.route('**/*.jpg', r => r.abort()) and check the page still works
// TODO(week 5): expect(page).toHaveScreenshot() on the inventory page
