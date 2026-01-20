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
      ['NEXT_PUBLIC_MODE']: 'test',
      ['NEXT_PUBLIC_FIREBASE_TEST_API_KEY']: 'AIzaSyDnxkpxxwHpmtLlAcG1VbJSbt5OgWgNL2g',
    },
    globals: true,
  },
} as UserConfig);
