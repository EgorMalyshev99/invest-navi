/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query Assets($limit: Int) {\n  assets(limit: $limit) {\n    symbol\n    name\n    lastPrice\n    changePercent\n    lotSize\n    valueToday\n    instrumentType\n    currency\n    figi\n    sector\n    dividendYieldPercent\n    dataSource\n  }\n}\n\nquery Asset($symbol: String!) {\n  asset(symbol: $symbol) {\n    symbol\n    name\n    lastPrice\n    changePercent\n    lotSize\n    valueToday\n    instrumentType\n    currency\n    figi\n    sector\n    dividendYieldPercent\n    dataSource\n  }\n  sectors {\n    code\n    name\n    currentValue\n    changePercent\n    dataSource\n  }\n  indices {\n    code\n    name\n    currentValue\n    changePercent\n    valueToday\n    dataSource\n  }\n}\n\nquery Indices {\n  indices {\n    code\n    name\n    currentValue\n    changePercent\n    valueToday\n    dataSource\n  }\n}\n\nquery AssetInsight($symbol: String!, $locale: String) {\n  assetInsight(symbol: $symbol, locale: $locale) {\n    symbol\n    source\n    provider\n    whatIs\n    whatChanged\n    whyMatters\n    risks\n    forInvestor\n    vsIndex\n  }\n}": typeof types.AssetsDocument,
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    userId\n    email\n    name\n    knowledgeLevel\n    preferredLocale\n  }\n}\n\nquery Me {\n  me {\n    userId\n    email\n    name\n    knowledgeLevel\n    preferredLocale\n  }\n}": typeof types.LoginDocument,
};
const documents: Documents = {
    "query Assets($limit: Int) {\n  assets(limit: $limit) {\n    symbol\n    name\n    lastPrice\n    changePercent\n    lotSize\n    valueToday\n    instrumentType\n    currency\n    figi\n    sector\n    dividendYieldPercent\n    dataSource\n  }\n}\n\nquery Asset($symbol: String!) {\n  asset(symbol: $symbol) {\n    symbol\n    name\n    lastPrice\n    changePercent\n    lotSize\n    valueToday\n    instrumentType\n    currency\n    figi\n    sector\n    dividendYieldPercent\n    dataSource\n  }\n  sectors {\n    code\n    name\n    currentValue\n    changePercent\n    dataSource\n  }\n  indices {\n    code\n    name\n    currentValue\n    changePercent\n    valueToday\n    dataSource\n  }\n}\n\nquery Indices {\n  indices {\n    code\n    name\n    currentValue\n    changePercent\n    valueToday\n    dataSource\n  }\n}\n\nquery AssetInsight($symbol: String!, $locale: String) {\n  assetInsight(symbol: $symbol, locale: $locale) {\n    symbol\n    source\n    provider\n    whatIs\n    whatChanged\n    whyMatters\n    risks\n    forInvestor\n    vsIndex\n  }\n}": types.AssetsDocument,
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    userId\n    email\n    name\n    knowledgeLevel\n    preferredLocale\n  }\n}\n\nquery Me {\n  me {\n    userId\n    email\n    name\n    knowledgeLevel\n    preferredLocale\n  }\n}": types.LoginDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Assets($limit: Int) {\n  assets(limit: $limit) {\n    symbol\n    name\n    lastPrice\n    changePercent\n    lotSize\n    valueToday\n    instrumentType\n    currency\n    figi\n    sector\n    dividendYieldPercent\n    dataSource\n  }\n}\n\nquery Asset($symbol: String!) {\n  asset(symbol: $symbol) {\n    symbol\n    name\n    lastPrice\n    changePercent\n    lotSize\n    valueToday\n    instrumentType\n    currency\n    figi\n    sector\n    dividendYieldPercent\n    dataSource\n  }\n  sectors {\n    code\n    name\n    currentValue\n    changePercent\n    dataSource\n  }\n  indices {\n    code\n    name\n    currentValue\n    changePercent\n    valueToday\n    dataSource\n  }\n}\n\nquery Indices {\n  indices {\n    code\n    name\n    currentValue\n    changePercent\n    valueToday\n    dataSource\n  }\n}\n\nquery AssetInsight($symbol: String!, $locale: String) {\n  assetInsight(symbol: $symbol, locale: $locale) {\n    symbol\n    source\n    provider\n    whatIs\n    whatChanged\n    whyMatters\n    risks\n    forInvestor\n    vsIndex\n  }\n}"): (typeof documents)["query Assets($limit: Int) {\n  assets(limit: $limit) {\n    symbol\n    name\n    lastPrice\n    changePercent\n    lotSize\n    valueToday\n    instrumentType\n    currency\n    figi\n    sector\n    dividendYieldPercent\n    dataSource\n  }\n}\n\nquery Asset($symbol: String!) {\n  asset(symbol: $symbol) {\n    symbol\n    name\n    lastPrice\n    changePercent\n    lotSize\n    valueToday\n    instrumentType\n    currency\n    figi\n    sector\n    dividendYieldPercent\n    dataSource\n  }\n  sectors {\n    code\n    name\n    currentValue\n    changePercent\n    dataSource\n  }\n  indices {\n    code\n    name\n    currentValue\n    changePercent\n    valueToday\n    dataSource\n  }\n}\n\nquery Indices {\n  indices {\n    code\n    name\n    currentValue\n    changePercent\n    valueToday\n    dataSource\n  }\n}\n\nquery AssetInsight($symbol: String!, $locale: String) {\n  assetInsight(symbol: $symbol, locale: $locale) {\n    symbol\n    source\n    provider\n    whatIs\n    whatChanged\n    whyMatters\n    risks\n    forInvestor\n    vsIndex\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    userId\n    email\n    name\n    knowledgeLevel\n    preferredLocale\n  }\n}\n\nquery Me {\n  me {\n    userId\n    email\n    name\n    knowledgeLevel\n    preferredLocale\n  }\n}"): (typeof documents)["mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    userId\n    email\n    name\n    knowledgeLevel\n    preferredLocale\n  }\n}\n\nquery Me {\n  me {\n    userId\n    email\n    name\n    knowledgeLevel\n    preferredLocale\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;