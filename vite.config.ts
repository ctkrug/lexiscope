import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the built site works from any subpath
  // (e.g. apps.charliekrug.com/lexiscope), not just the domain root.
  base: './',
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
  },
});
