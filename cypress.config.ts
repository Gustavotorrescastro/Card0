export default {
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on: unknown, config: unknown) {
      void on
      return config
    },
  },
}
