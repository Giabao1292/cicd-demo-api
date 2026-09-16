import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/cicd-demo-api/',
  plugins: [react()],
  test: {
    coverage: {
      include: ['scripts/i18n-utils.mjs'],
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
    },
  },
});
