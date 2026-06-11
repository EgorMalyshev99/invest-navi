import path from 'node:path';
import { fileURLToPath } from 'node:url';

import reactConfig from '@repo/vitest-config/react';
import { mergeConfig } from 'vitest/config';

const dashboardRoot = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(reactConfig, {
  test: {
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(dashboardRoot, './src'),
    },
  },
});
