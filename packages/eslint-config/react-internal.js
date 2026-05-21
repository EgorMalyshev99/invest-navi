import eslintReact from '@eslint-react/eslint-plugin';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { config as baseConfig } from './base.js';

/**
 * ESLint flat config for internal React libraries (e.g. @repo/ui).
 *
 * @type {import('eslint').Linter.Config[]}
 */
export const config = [
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
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
];
