import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  webExt: {
    startUrls: ['https://www.thegermanproject.com/stories/chicken-little'],
  },
  manifest: {
    permissions: ['storage'],
    host_permissions: ['https://api.deepseek.com/*'],
  },
});
