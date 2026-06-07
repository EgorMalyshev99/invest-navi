import { reactViteConfig } from '@repo/eslint-config/react-vite';

const FSD_LAYER_ERROR = 'FSD: importing from a higher layer is forbidden.';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactViteConfig,

  {
    ignores: ['src/routeTree.gen.ts', 'src/shared/api/graphql/generated/**'],
  },

  {
    files: ['src/routes/**/*.{ts,tsx}', 'src/main.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  {
    files: ['src/i18n/**/*.{ts,tsx}', 'src/shared/auth/auth-context.tsx'],
    rules: {
      '@eslint-react/no-use-context': 'off',
      '@eslint-react/no-context-provider': 'off',
      '@eslint-react/no-array-index-key': 'off',
      '@eslint-react/no-forward-ref': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },

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
      'react-refresh/only-export-components': 'off',
    },
  },

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

  {
    files: ['src/features/**/*', 'src/widgets/**/*', 'src/entities/**/*', 'src/routes/**/*'],
    ignores: ['src/shared/ui/**'],
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
