import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // The app route is /admin, but this project is deployed at the root of the
  // admin subdomain, so generated JS/CSS must be served from /assets.
  base: '/',
  plugins: [react()],
  server: {
    port: 5174,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://api.digitalpintu.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 4174,
    host: '0.0.0.0',
  },
});
