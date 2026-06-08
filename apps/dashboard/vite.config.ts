import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const dashboardRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(dashboardRoot, '../..');

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '');

  return {
    plugins: [tailwindcss(), tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
    resolve: {
      alias: {
        '@': path.resolve(dashboardRoot, './src'),
        '@repo/api': path.resolve(monorepoRoot, 'packages/api/src'),
      },
    },
    server: {
      host: env.VITE_APP_HOST,
      port: Number(env.VITE_APP_PORT) || 3000,
      fs: {
        allow: [monorepoRoot],
      },
    },
  };
});
