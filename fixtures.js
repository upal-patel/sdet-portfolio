const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');
const { BookerClient } = require('./api/BookerClient');

// Tests ask for what they need by name; no `new` and no setup code in test bodies.
const test = base.extend({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),

  booker: async ({ request }, use) => use(new BookerClient(request)),

  token: async ({ booker }, use) => {
    const res = await booker.createToken(process.env.BOOKER_USER ?? 'admin', process.env.BOOKER_PASSWORD ?? 'password123');
    expect(res).toBeOK();
    await use((await res.json()).token);
  },

  // Unique data per test, so tests never collide when run in parallel.
  bookingPayload: async ({}, use) =>
    use({
      firstname: 'Test',
      lastname: `User-${Math.random().toString(36).slice(2, 10)}`,
      totalprice: 250,
      depositpaid: true,
      bookingdates: { checkin: '2027-03-01', checkout: '2027-03-05' },
      additionalneeds: 'Breakfast',
    }),

  // Creates a booking for the test and always deletes it afterwards.
  booking: async ({ booker, token, bookingPayload }, use) => {
    const res = await booker.createBooking(bookingPayload);
    expect(res).toBeOK();
    const { bookingid } = await res.json();
    await use({ id: bookingid, payload: bookingPayload });
    await booker.deleteBooking(bookingid, token);
  },
});

module.exports = { test, expect };
