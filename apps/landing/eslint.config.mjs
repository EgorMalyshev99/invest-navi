import { nextJsConfig } from '@repo/eslint-config/next-js';

const FSD_LAYER_ERROR = 'FSD: importing from a higher layer is forbidden.';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,

  {
    files: ['src/shared/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/features/*'], message: FSD_LAYER_ERROR },
            { group: ['@/widgets/*'], message: FSD_LAYER_ERROR },
          ],
        },
      ],
    },
  },

  {
    files: ['src/features/**/*', 'src/widgets/**/*', 'app/**/*'],
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

  {
    files: ['src/features/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [{ group: ['@/widgets/*'], message: FSD_LAYER_ERROR }],
        },
      ],
    },
  },
];
