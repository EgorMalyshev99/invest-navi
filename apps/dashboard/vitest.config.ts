import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mergeConfig } from 'vitest/config';

import reactConfig from '@repo/vitest-config/react';

const dashboardRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(dashboardRoot, '../..');

export default mergeConfig(reactConfig, {
  test: {
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(dashboardRoot, './src'),
      '@repo/api': path.resolve(monorepoRoot, 'packages/api/src'),
    },
  },
});
