/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AssetInsightSource = 'AI' | 'FALLBACK';

export type InstrumentType = 'Bond' | 'Currency' | 'Etf' | 'Index' | 'Share';

export type KnowledgeLevel = 'ADVANCED' | 'BEGINNER' | 'INTERMEDIATE';

export type LoginInput = {
  email: string;
  password: string;
};

export type MarketDataSource = 'Merged' | 'Moex' | 'Tinkoff';

export type PreferredLocale = 'EN' | 'RU';

export type RegisterInput = {
  email: string;
  name?: string | null | undefined;
  password: string;
};

export type UpdateProfileInput = {
  knowledgeLevel?: KnowledgeLevel | null | undefined;
  name?: string | null | undefined;
  preferredLocale?: PreferredLocale | null | undefined;
};

export type AssetsQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;

export type AssetsQuery = {
  assets: Array<{
    symbol: string;
    name: string;
    lastPrice: number;
    changePercent: number;
    lotSize: number;
    valueToday: number;
    instrumentType: InstrumentType;
    currency: string | null;
    figi: string | null;
    sector: string | null;
    dividendYieldPercent: number | null;
    dataSource: MarketDataSource;
  }>;
};

export type AssetQueryVariables = Exact<{
  symbol: string;
}>;

export type AssetQuery = {
  asset: {
    symbol: string;
    name: string;
    lastPrice: number;
    changePercent: number;
    lotSize: number;
    valueToday: number;
    instrumentType: InstrumentType;
    currency: string | null;
    figi: string | null;
    sector: string | null;
    dividendYieldPercent: number | null;
    dataSource: MarketDataSource;
  };
  sectors: Array<{
    code: string;
    name: string;
    currentValue: number;
    changePercent: number;
    dataSource: MarketDataSource;
  }>;
  indices: Array<{
    code: string;
    name: string;
    currentValue: number;
    changePercent: number;
    valueToday: number;
    dataSource: MarketDataSource;
  }>;
};

export type IndicesQueryVariables = Exact<{ [key: string]: never }>;

export type IndicesQuery = {
  indices: Array<{
    code: string;
    name: string;
    currentValue: number;
    changePercent: number;
    valueToday: number;
    dataSource: MarketDataSource;
  }>;
};

export type AssetInsightQueryVariables = Exact<{
  symbol: string;
  locale?: string | null | undefined;
}>;

export type AssetInsightQuery = {
  assetInsight: {
    symbol: string;
    source: AssetInsightSource;
    provider: string | null;
    whatIs: string;
    whatChanged: string;
    whyMatters: string;
    risks: Array<string>;
    forInvestor: string;
    vsIndex: string | null;
  };
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = { login: { accessToken: string; refreshToken: string } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;

export type RegisterMutation = { register: { accessToken: string; refreshToken: string } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;

export type UpdateProfileMutation = {
  updateProfile: {
    userId: string;
    email: string;
    name: string | null;
    knowledgeLevel: KnowledgeLevel;
    preferredLocale: PreferredLocale;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  me: {
    userId: string;
    email: string;
    name: string | null;
    knowledgeLevel: KnowledgeLevel;
    preferredLocale: PreferredLocale;
  };
};

export const AssetsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Assets' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assets' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastPrice' } },
                { kind: 'Field', name: { kind: 'Name', value: 'changePercent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lotSize' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueToday' } },
                { kind: 'Field', name: { kind: 'Name', value: 'instrumentType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'figi' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sector' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dividendYieldPercent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dataSource' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AssetsQuery, AssetsQueryVariables>;
export const AssetDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Asset' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'symbol' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'asset' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'symbol' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'symbol' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastPrice' } },
                { kind: 'Field', name: { kind: 'Name', value: 'changePercent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lotSize' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueToday' } },
                { kind: 'Field', name: { kind: 'Name', value: 'instrumentType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'figi' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sector' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dividendYieldPercent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dataSource' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sectors' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currentValue' } },
                { kind: 'Field', name: { kind: 'Name', value: 'changePercent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dataSource' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'indices' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currentValue' } },
                { kind: 'Field', name: { kind: 'Name', value: 'changePercent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueToday' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dataSource' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AssetQuery, AssetQueryVariables>;
export const IndicesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Indices' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'indices' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currentValue' } },
                { kind: 'Field', name: { kind: 'Name', value: 'changePercent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'valueToday' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dataSource' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<IndicesQuery, IndicesQueryVariables>;
export const AssetInsightDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'AssetInsight' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'symbol' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assetInsight' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'symbol' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'symbol' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'locale' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                { kind: 'Field', name: { kind: 'Name', value: 'source' } },
                { kind: 'Field', name: { kind: 'Name', value: 'provider' } },
                { kind: 'Field', name: { kind: 'Name', value: 'whatIs' } },
                { kind: 'Field', name: { kind: 'Name', value: 'whatChanged' } },
                { kind: 'Field', name: { kind: 'Name', value: 'whyMatters' } },
                { kind: 'Field', name: { kind: 'Name', value: 'risks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'forInvestor' } },
                { kind: 'Field', name: { kind: 'Name', value: 'vsIndex' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AssetInsightQuery, AssetInsightQueryVariables>;
export const LoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Login' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'LoginInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'login' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                { kind: 'Field', name: { kind: 'Name', value: 'refreshToken' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Register' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'RegisterInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'register' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                { kind: 'Field', name: { kind: 'Name', value: 'refreshToken' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const UpdateProfileDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateProfile' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateProfileInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateProfile' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'knowledgeLevel' } },
                { kind: 'Field', name: { kind: 'Name', value: 'preferredLocale' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const MeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Me' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'me' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'knowledgeLevel' } },
                { kind: 'Field', name: { kind: 'Name', value: 'preferredLocale' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
