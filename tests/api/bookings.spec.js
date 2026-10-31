const { test, expect } = require('../../fixtures');
const { schemas, validate } = require('../../api/schemas');

test('create booking returns a valid schema', { tag: '@smoke' }, async ({ booker, bookingPayload, token }) => {
  const res = await booker.createBooking(bookingPayload);

  expect(res).toBeOK();
  const body = await res.json();
  expect(validate(schemas.createdBooking, body)).toEqual([]);   // fails loudly on contract drift
  expect(body.booking.lastname).toBe(bookingPayload.lastname);

  await booker.deleteBooking(body.bookingid, token);
});

test('get booking matches what was created', { tag: '@smoke' }, async ({ booker, booking }) => {
  const res = await booker.getBooking(booking.id);

  expect(res).toBeOK();
  const body = await res.json();
  expect(validate(schemas.booking, body)).toEqual([]);
  expect(body).toEqual(booking.payload);
});

test('update changes only the given fields', async ({ booker, booking, token }) => {
  const updated = { ...booking.payload, totalprice: 999, additionalneeds: 'Late checkout' };

  const res = await booker.updateBooking(booking.id, updated, token);

  expect(res).toBeOK();
  const body = await res.json();
  expect(body.totalprice).toBe(999);
  expect(body.firstname).toBe(booking.payload.firstname);
});

test('delete without a token is forbidden', { tag: '@negative' }, async ({ booker, booking }) => {
  const res = await booker.deleteBooking(booking.id, null);
  expect(res.status()).toBe(403);
});

for (const field of ['firstname', 'lastname', 'totalprice', 'bookingdates']) {
  test(`create rejects missing ${field}`, { tag: '@negative' }, async ({ booker, bookingPayload }) => {
    delete bookingPayload[field];

    const res = await booker.createBooking(bookingPayload);

    // TODO(week 6): the practice API returns 500 here; a well-built API returns 400.
    // Note what you find: that's a defect-report story for interviews.
    expect([400, 500]).toContain(res.status());
  });
}

test('unknown booking returns 404', { tag: '@negative' }, async ({ booker }) => {
  const res = await booker.getBooking(999999999);
  expect(res.status()).toBe(404);
});

test('get booking responds within 2 seconds', async ({ booker, booking }) => {
  const start = Date.now();
  const res = await booker.getBooking(booking.id);
  expect(res).toBeOK();
  expect(Date.now() - start).toBeLessThan(2000);   // soft SLA, not a load test
});

// TODO(week 6): bad credentials on /auth, PATCH partial update, GET /booking?firstname= filter
// TODO(week 7): hybrid test: create data through the API, then check it in the UI
