import { nextJsConfig } from '@repo/eslint-config/next-js';

const FSD_LAYER_ERROR = 'FSD: importing from a higher layer is forbidden.';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,

  // shadcn/ui registry components (third-party patterns; keep app rules strict elsewhere)
  {
    files: ['src/shared/ui/**/*'],
    rules: {
      '@eslint-react/no-use-context': 'off',
      '@eslint-react/no-context-provider': 'off',
      '@eslint-react/no-array-index-key': 'off',
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
      '@eslint-react/use-state': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@eslint-react/set-state-in-effect': 'off',
    },
  },

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
