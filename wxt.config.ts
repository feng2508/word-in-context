import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  webExt: {
    startUrls: ['manual-tests/tasks.html'],
  },
  manifest: {
    name: "Word in Context",
    description: "Explain German words in context.",
    action: {
      default_title: "Open Word in Context",
    },
    permissions: ['storage'],
    host_permissions: ['https://api.deepseek.com/*'],
  },
});
