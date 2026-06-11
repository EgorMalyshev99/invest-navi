import { defineConfig } from 'vitest/config';

export const baseConfig = defineConfig({
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    passWithNoTests: true,
  },
});

export default baseConfig;
