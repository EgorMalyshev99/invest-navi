import eslintReact from '@eslint-react/eslint-plugin';
import pluginNext from '@next/eslint-plugin-next';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { config as baseConfig } from './base.js';

/**
 * ESLint flat config for Next.js applications.
 *
 * @type {import('eslint').Linter.Config[]}
 */
export const nextJsConfig = [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ...eslintReact.configs['recommended-typescript'],
    languageOptions: {
      ...eslintReact.configs['recommended-typescript'].languageOptions,
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
];
