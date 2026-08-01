import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/admin/',
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
