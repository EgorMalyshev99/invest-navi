import { mergeConfig } from 'vitest/config';

import baseConfig from '@repo/vitest-config/base';

export default mergeConfig(baseConfig, {
  resolve: {
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
