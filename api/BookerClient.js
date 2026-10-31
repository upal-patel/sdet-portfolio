// Thin API client over Playwright's APIRequestContext: one place for paths, auth and headers.
class BookerClient {
  /** @param {import('@playwright/test').APIRequestContext} request */
  constructor(request) {
    this.request = request;
  }

  async createToken(username, password) {
    return this.request.post('/auth', { data: { username, password } });
  }

  async getBooking(id) {
    return this.request.get(`/booking/${id}`);
  }

  async createBooking(payload) {
    return this.request.post('/booking', { data: payload });
  }

  async updateBooking(id, payload, token) {
    return this.request.put(`/booking/${id}`, { data: payload, headers: { Cookie: `token=${token}` } });
  }

  async deleteBooking(id, token) {
    const headers = token ? { Cookie: `token=${token}` } : {};
    return this.request.delete(`/booking/${id}`, { headers });
  }
}

module.exports = { BookerClient };
