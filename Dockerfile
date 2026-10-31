# Run the whole Playwright suite in the official image (browsers included).
#   docker build -t sdet-tests . && docker run --rm sdet-tests
# Keep the image tag in step with the @playwright/test version in package.json.
FROM mcr.microsoft.com/playwright:v1.50.0-noble
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "playwright", "test"]
