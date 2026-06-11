import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const dashboardRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(dashboardRoot, '../..');

export default defineConfig((config) => {
  const env = loadEnv(config.mode, dashboardRoot, '');
  const isDev = config.command === 'serve';
  const apiPackageRoot = path.resolve(monorepoRoot, 'packages/api');
  const apiSourceRoot = path.resolve(apiPackageRoot, 'src');

  return {
    plugins: [tailwindcss(), tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
    resolve: {
      alias: {
        '@': path.resolve(dashboardRoot, './src'),
        ...(isDev
          ? {
              '@repo/api$': path.resolve(apiSourceRoot, 'entry.ts'),
              '@repo/api': apiSourceRoot,
            }
          : {}),
      },
    },
    server: {
      host: env.VITE_APP_HOST,
      port: Number(env.VITE_APP_PORT) || 3003,
      fs: {
        allow: [monorepoRoot],
      },
    },
  };
});
