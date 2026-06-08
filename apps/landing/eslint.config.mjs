import { nextJsConfig } from '@repo/eslint-config/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,

  {
    files: ['src/components/**/*', 'app/**/*'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'Literal[value=/\\bspace-[xy]-(?!0\\b)/]',
          message: 'Prefer flex with gap-* instead of space-x-* or space-y-*.',
        },
      ],
    },
  },
];
