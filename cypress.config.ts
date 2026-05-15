import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ) {
      return config;
    },
  },
});