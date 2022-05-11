import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/': {
        target: 'http://localhost:5000/',
        secure: false,
        changeOrigin: true,
        rewrite: (newPath) => {
          return newPath.replace(/^\/api/, '');
        },
      },
    },
  },
});
