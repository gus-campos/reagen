import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, UserConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Garante que @ aponta para src
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    env: {
      ['NEXT_PUBLIC_FIREBASE_API_KEY']: 'AIzaSyCaldii3iEgvnubFwjL93F3YofhPnSERC8',
    },
    globals: true,
  },
} as UserConfig);
