import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents() {},
    env: {
      mockApi:
        process.env.VITE_API_BASE_URL ??
        'https://665de6d7e88051d60408c32d.mockapi.io',
    },
  },
});
