import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/cicd-demo-api/',
  plugins: [react()],
});
