# SDET Portfolio — Playwright (JavaScript): UI, API & AI Testing

One Playwright project tests three layers with the same runner, fixtures, reports and CI:

| Project | Folder | What it tests |
| --- | --- | --- |
| `ui` | `tests/ui/` | [Sauce Demo](https://www.saucedemo.com) shop: login, inventory, cart |
| `api` | `tests/api/` | [Restful Booker](https://restful-booker.herokuapp.com) API: auth, CRUD, JSON schema, negative cases, response time |
| `ai` | `tests/ai/` | An LLM claim-note summariser: schema, golden set, pass rate, LLM-as-judge, prompt injection |

Plus `python-challenges/`: Python coding problems with pytest tests.

## Run locally

```bash
npm ci
npx playwright install chromium
npx playwright test                 # everything
npm run test:api                    # one project
npm run test:smoke                  # only @smoke tests
npx playwright show-report
```

AI evals run offline with a stub model. To use a real model, set `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL`.

## Structure

```
pages/            page objects (LoginPage, InventoryPage)
api/              BookerClient (wraps the request fixture) + ajv JSON schemas
fixtures.js       page objects, API client, auth token and self-cleaning test data as fixtures
tests/ui/         auth.setup.js (log in once, reuse storageState), login, cart
tests/api/        bookings.spec.js
tests/ai/         summarizer.js, evals.spec.js, data/golden.json, data/injections.json
```

## Design choices

- **Each test owns its data.** The `booking` fixture creates a booking and deletes it afterwards.
- **No hard waits.** Auto-waiting locators and web-first assertions only.
- **Page objects + fixtures.** Tests read like user stories; selectors live in one place.
- **API and UI in one runner.** Shared config, auth and reports; API calls seed data for UI tests.
- **Layered AI evals.** Cheap deterministic checks first; the LLM judge runs last, and only with a key.
- **Config from environment variables**, so the same suite runs locally, in Docker and in CI.
