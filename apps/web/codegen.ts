import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../api/src/schema.gql',
  documents: ['src/**/*.graphql'],
  generates: {
    './src/shared/api/graphql/generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
