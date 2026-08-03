import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = (env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

  return ({
  // The app route is /admin, but this project is deployed at the root of the
  // admin subdomain, so generated JS/CSS must be served from /assets.
  base: '/',
  plugins: [react()],
  server: {
    port: 5174,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: apiTarget,
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
});
