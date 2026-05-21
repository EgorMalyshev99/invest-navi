import globals from 'globals';

import { config as baseConfig } from './base.js';

/**
 * ESLint flat config for Node.js / shared libraries.
 *
 * @type {import('eslint').Linter.Config[]}
 */
export const libraryConfig = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    ignores: ['.*.js', 'node_modules/', 'dist/'],
  },
];

export default libraryConfig;
