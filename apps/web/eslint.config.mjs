import { nextJsConfig } from '@repo/eslint-config/next-js';

const FSD_LAYER_ERROR = 'FSD: importing from a higher layer is forbidden.';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,

  // ── shared: bottom layer, cannot import from any higher layer ──
  {
    files: ['src/shared/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/entities/*'], message: FSD_LAYER_ERROR },
            { group: ['@/features/*'], message: FSD_LAYER_ERROR },
            { group: ['@/widgets/*'], message: FSD_LAYER_ERROR },
          ],
        },
      ],
    },
  },

  // ── entities: can use shared, cannot import features/widgets ──
  {
    files: ['src/entities/**/*'],
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

  // ── features: can use entities+shared, cannot import widgets ──
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
