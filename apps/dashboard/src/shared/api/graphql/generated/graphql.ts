/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AssetInsightSource =
  | 'AI'
  | 'FALLBACK';

export type CreateDiaryEntryInput = {
  action: DiaryAction;
  assetSymbol: string;
  confidence?: number | null | undefined;
  failureCriteria?: string | null | undefined;
  horizon: DiaryHorizon;
  rationale?: string | null | undefined;
  risks?: string | null | undefined;
  successCriteria?: string | null | undefined;
};

export type CreatePortfolioPositionInput = {
  assetSymbol: string;
  /** ISO date YYYY-MM-DD */
  entryDate: string;
  entryPrice: number;
  goal?: string | null | undefined;
  quantity: number;
};

export type DiaryAction =
  | 'BUY'
  | 'HOLD'
  | 'OBSERVE'
  | 'SELL';

export type DiaryHorizon =
  | 'LONG'
  | 'ONE_MONTH'
  | 'ONE_YEAR'
  | 'THREE_MONTHS';

export type DiaryHypothesisFeedbackInput = {
  action: DiaryAction;
  assetSymbol: string;
  confidence?: number | null | undefined;
  failureCriteria?: string | null | undefined;
  horizon: DiaryHorizon;
  locale?: string | null | undefined;
  rationale?: string | null | undefined;
  risks?: string | null | undefined;
  successCriteria?: string | null | undefined;
};

export type DiaryStatus =
  | 'ACTIVE'
  | 'CANCELLED'
  | 'COMPLETED';

export type EducationalAnswerInput = {
  locale?: string | null | undefined;
  question: string;
};

export type InstrumentType =
  | 'Bond'
  | 'Currency'
  | 'Etf'
  | 'Index'
  | 'Share';

export type KnowledgeLevel =
  | 'ADVANCED'
  | 'BEGINNER'
  | 'INTERMEDIATE';

export type LoginInput = {
  email: string;
  password: string;
};

export type MarketDataSource =
  | 'Merged'
  | 'Moex'
  | 'Tinkoff';

export type OAuthProvider =
  | 'GOOGLE'
  | 'YANDEX';

export type PortfolioRiskSeverity =
  | 'Info'
  | 'Warning';

export type PreferredLocale =
  | 'EN'
  | 'RU';

export type RegisterInput = {
  email: string;
  name?: string | null | undefined;
  password: string;
};

export type UpdateDiaryEntryInput = {
  action?: DiaryAction | null | undefined;
  confidence?: number | null | undefined;
  failureCriteria?: string | null | undefined;
  horizon?: DiaryHorizon | null | undefined;
  rationale?: string | null | undefined;
  risks?: string | null | undefined;
  status?: DiaryStatus | null | undefined;
  successCriteria?: string | null | undefined;
};

export type UpdatePortfolioPositionInput = {
  assetSymbol?: string | null | undefined;
  /** ISO date YYYY-MM-DD */
  entryDate?: string | null | undefined;
  entryPrice?: number | null | undefined;
  goal?: string | null | undefined;
  quantity?: number | null | undefined;
};

export type UpdateProfileInput = {
  knowledgeLevel?: KnowledgeLevel | null | undefined;
  name?: string | null | undefined;
  preferredLocale?: PreferredLocale | null | undefined;
};

export type AssetsQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type AssetsQuery = { assets: Array<{ symbol: string, name: string, lastPrice: number, changePercent: number, lotSize: number, valueToday: number, instrumentType: InstrumentType, currency: string | null, figi: string | null, sector: string | null, dividendYieldPercent: number | null, dataSource: MarketDataSource }> };

export type AssetQueryVariables = Exact<{
  symbol: string;
}>;


export type AssetQuery = { asset: { symbol: string, name: string, lastPrice: number, changePercent: number, lotSize: number, valueToday: number, instrumentType: InstrumentType, currency: string | null, figi: string | null, sector: string | null, dividendYieldPercent: number | null, dataSource: MarketDataSource }, sectors: Array<{ code: string, name: string, currentValue: number, changePercent: number, dataSource: MarketDataSource }>, indices: Array<{ code: string, name: string, currentValue: number, changePercent: number, valueToday: number, dataSource: MarketDataSource }> };

export type IndicesQueryVariables = Exact<{ [key: string]: never; }>;


export type IndicesQuery = { indices: Array<{ code: string, name: string, currentValue: number, changePercent: number, valueToday: number, dataSource: MarketDataSource }> };

export type SectorsQueryVariables = Exact<{ [key: string]: never; }>;


export type SectorsQuery = { sectors: Array<{ code: string, name: string, currentValue: number, changePercent: number, dataSource: MarketDataSource }> };

export type FxRatesQueryVariables = Exact<{ [key: string]: never; }>;


export type FxRatesQuery = { fxRates: Array<{ code: string, name: string, currentValue: number, changePercent: number, valueToday: number, dataSource: MarketDataSource }> };

export type AssetInsightQueryVariables = Exact<{
  symbol: string;
  locale?: string | null | undefined;
}>;


export type AssetInsightQuery = { assetInsight: { symbol: string, source: AssetInsightSource, provider: string | null, whatIs: string, whatChanged: string, whyMatters: string, risks: Array<string>, forInvestor: string, vsIndex: string | null } };

export type BondFieldsFragment = { symbol: string, name: string, lastPrice: number, changePercent: number, lotSize: number, valueToday: number, couponPercent: number | null, maturityDate: string | null, yieldAtPrice: number | null, faceValue: number | null, currency: string | null, dataSource: MarketDataSource };

export type BondsQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type BondsQuery = { bonds: Array<{ symbol: string, name: string, lastPrice: number, changePercent: number, lotSize: number, valueToday: number, couponPercent: number | null, maturityDate: string | null, yieldAtPrice: number | null, faceValue: number | null, currency: string | null, dataSource: MarketDataSource }> };

export type BondQueryVariables = Exact<{
  symbol: string;
}>;


export type BondQuery = { bond: { symbol: string, name: string, lastPrice: number, changePercent: number, lotSize: number, valueToday: number, couponPercent: number | null, maturityDate: string | null, yieldAtPrice: number | null, faceValue: number | null, currency: string | null, dataSource: MarketDataSource } };

export type BondInsightQueryVariables = Exact<{
  symbol: string;
  locale?: string | null | undefined;
}>;


export type BondInsightQuery = { bondInsight: { symbol: string, name: string, source: AssetInsightSource, provider: string | null, overview: string, couponAndMaturity: string, yieldContext: string, rateSensitivity: string, risks: Array<string>, questionsBeforeBuy: Array<string>, liquidityNote: string | null } };

export type DiaryEntryFieldsFragment = { id: string, assetSymbol: string, action: DiaryAction, horizon: DiaryHorizon, rationale: string | null, risks: string | null, successCriteria: string | null, failureCriteria: string | null, confidence: number | null, status: DiaryStatus, snapshotPrice: number | null, snapshotIndexValue: number | null, reviewAt: unknown, createdAt: unknown, updatedAt: unknown };

export type DiaryEntriesQueryVariables = Exact<{
  status?: DiaryStatus | null | undefined;
}>;


export type DiaryEntriesQuery = { diaryEntries: Array<{ id: string, assetSymbol: string, action: DiaryAction, horizon: DiaryHorizon, rationale: string | null, risks: string | null, successCriteria: string | null, failureCriteria: string | null, confidence: number | null, status: DiaryStatus, snapshotPrice: number | null, snapshotIndexValue: number | null, reviewAt: unknown, createdAt: unknown, updatedAt: unknown }> };

export type DiaryEntryQueryVariables = Exact<{
  id: string;
}>;


export type DiaryEntryQuery = { diaryEntry: { id: string, assetSymbol: string, action: DiaryAction, horizon: DiaryHorizon, rationale: string | null, risks: string | null, successCriteria: string | null, failureCriteria: string | null, confidence: number | null, status: DiaryStatus, snapshotPrice: number | null, snapshotIndexValue: number | null, reviewAt: unknown, createdAt: unknown, updatedAt: unknown } };

export type CreateDiaryEntryMutationVariables = Exact<{
  input: CreateDiaryEntryInput;
}>;


export type CreateDiaryEntryMutation = { createDiaryEntry: { id: string, assetSymbol: string, action: DiaryAction, horizon: DiaryHorizon, rationale: string | null, risks: string | null, successCriteria: string | null, failureCriteria: string | null, confidence: number | null, status: DiaryStatus, snapshotPrice: number | null, snapshotIndexValue: number | null, reviewAt: unknown, createdAt: unknown, updatedAt: unknown } };

export type UpdateDiaryEntryMutationVariables = Exact<{
  id: string;
  input: UpdateDiaryEntryInput;
}>;


export type UpdateDiaryEntryMutation = { updateDiaryEntry: { id: string, assetSymbol: string, action: DiaryAction, horizon: DiaryHorizon, rationale: string | null, risks: string | null, successCriteria: string | null, failureCriteria: string | null, confidence: number | null, status: DiaryStatus, snapshotPrice: number | null, snapshotIndexValue: number | null, reviewAt: unknown, createdAt: unknown, updatedAt: unknown } };

export type DiaryHypothesisFeedbackQueryVariables = Exact<{
  input: DiaryHypothesisFeedbackInput;
}>;


export type DiaryHypothesisFeedbackQuery = { diaryHypothesisFeedback: { summary: string, strengths: Array<string>, gaps: Array<string>, questions: Array<string>, source: AssetInsightSource, provider: string | null } };

export type DiaryRetrospectiveQueryVariables = Exact<{
  entryId: string;
  locale?: string | null | undefined;
}>;


export type DiaryRetrospectiveQuery = { diaryRetrospective: { entryId: string, isReady: boolean, daysElapsed: number, priceChangePercent: number | null, indexChangePercent: number | null, summary: string, questions: Array<string>, source: AssetInsightSource, provider: string | null } };

export type EducationalAnswerMutationVariables = Exact<{
  input: EducationalAnswerInput;
}>;


export type EducationalAnswerMutation = { educationalAnswer: { answer: string, source: AssetInsightSource, provider: string | null } };

export type PortfolioPositionFieldsFragment = { id: string, assetSymbol: string, assetName: string | null, instrumentType: InstrumentType | null, currency: string | null, quantity: number, entryPrice: number, entryDate: string, goal: string | null, currentPrice: number | null, marketValue: number | null, costBasis: number, unrealizedPl: number | null, unrealizedPlPercent: number | null, createdAt: unknown, updatedAt: unknown };

export type PortfolioSummaryFieldsFragment = { positionsCount: number, totalCostBasis: number, totalMarketValue: number, totalUnrealizedPl: number, totalUnrealizedPlPercent: number | null, byInstrumentType: Array<{ key: string, label: string | null, weightPercent: number, value: number }>, bySymbol: Array<{ key: string, label: string | null, weightPercent: number, value: number }>, byCurrency: Array<{ key: string, label: string | null, weightPercent: number, value: number }>, riskHints: Array<{ code: string, severity: PortfolioRiskSeverity, symbol: string | null, weightPercent: number | null }> };

export type PortfolioPositionsQueryVariables = Exact<{ [key: string]: never; }>;


export type PortfolioPositionsQuery = { portfolioPositions: Array<{ id: string, assetSymbol: string, assetName: string | null, instrumentType: InstrumentType | null, currency: string | null, quantity: number, entryPrice: number, entryDate: string, goal: string | null, currentPrice: number | null, marketValue: number | null, costBasis: number, unrealizedPl: number | null, unrealizedPlPercent: number | null, createdAt: unknown, updatedAt: unknown }> };

export type PortfolioSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type PortfolioSummaryQuery = { portfolioSummary: { positionsCount: number, totalCostBasis: number, totalMarketValue: number, totalUnrealizedPl: number, totalUnrealizedPlPercent: number | null, byInstrumentType: Array<{ key: string, label: string | null, weightPercent: number, value: number }>, bySymbol: Array<{ key: string, label: string | null, weightPercent: number, value: number }>, byCurrency: Array<{ key: string, label: string | null, weightPercent: number, value: number }>, riskHints: Array<{ code: string, severity: PortfolioRiskSeverity, symbol: string | null, weightPercent: number | null }> } };

export type CreatePortfolioPositionMutationVariables = Exact<{
  input: CreatePortfolioPositionInput;
}>;


export type CreatePortfolioPositionMutation = { createPortfolioPosition: { id: string, assetSymbol: string, assetName: string | null, instrumentType: InstrumentType | null, currency: string | null, quantity: number, entryPrice: number, entryDate: string, goal: string | null, currentPrice: number | null, marketValue: number | null, costBasis: number, unrealizedPl: number | null, unrealizedPlPercent: number | null, createdAt: unknown, updatedAt: unknown } };

export type UpdatePortfolioPositionMutationVariables = Exact<{
  id: string;
  input: UpdatePortfolioPositionInput;
}>;


export type UpdatePortfolioPositionMutation = { updatePortfolioPosition: { id: string, assetSymbol: string, assetName: string | null, instrumentType: InstrumentType | null, currency: string | null, quantity: number, entryPrice: number, entryDate: string, goal: string | null, currentPrice: number | null, marketValue: number | null, costBasis: number, unrealizedPl: number | null, unrealizedPlPercent: number | null, createdAt: unknown, updatedAt: unknown } };

export type DeletePortfolioPositionMutationVariables = Exact<{
  id: string;
}>;


export type DeletePortfolioPositionMutation = { deletePortfolioPosition: boolean };

export type WeeklyMarketReviewQueryVariables = Exact<{
  locale?: string | null | undefined;
}>;


export type WeeklyMarketReviewQuery = { weeklyMarketReview: { weekStart: unknown, locale: string, summary: string, sectors: Array<string>, bondsAndRub: string, events: Array<string>, risksForNextWeek: Array<string>, source: AssetInsightSource, generatedAt: unknown } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { accessToken: string } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { register: { accessToken: string } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { updateProfile: { userId: string, email: string, name: string | null, knowledgeLevel: KnowledgeLevel, preferredLocale: PreferredLocale } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { userId: string, email: string, name: string | null, knowledgeLevel: KnowledgeLevel, preferredLocale: PreferredLocale, oauthProviders: Array<OAuthProvider> } };

export type UnlinkOAuthProviderMutationVariables = Exact<{
  provider: OAuthProvider;
}>;


export type UnlinkOAuthProviderMutation = { unlinkOAuthProvider: { userId: string, email: string, name: string | null, knowledgeLevel: KnowledgeLevel, preferredLocale: PreferredLocale, oauthProviders: Array<OAuthProvider> } };

export const BondFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BondFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bond"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"lotSize"}},{"kind":"Field","name":{"kind":"Name","value":"valueToday"}},{"kind":"Field","name":{"kind":"Name","value":"couponPercent"}},{"kind":"Field","name":{"kind":"Name","value":"maturityDate"}},{"kind":"Field","name":{"kind":"Name","value":"yieldAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"faceValue"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}}]} as unknown as DocumentNode<BondFieldsFragment, unknown>;
export const DiaryEntryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiaryEntryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiaryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"horizon"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"risks"}},{"kind":"Field","name":{"kind":"Name","value":"successCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"failureCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotPrice"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotIndexValue"}},{"kind":"Field","name":{"kind":"Name","value":"reviewAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<DiaryEntryFieldsFragment, unknown>;
export const PortfolioPositionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PortfolioPositionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PortfolioPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"assetName"}},{"kind":"Field","name":{"kind":"Name","value":"instrumentType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"entryPrice"}},{"kind":"Field","name":{"kind":"Name","value":"entryDate"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"currentPrice"}},{"kind":"Field","name":{"kind":"Name","value":"marketValue"}},{"kind":"Field","name":{"kind":"Name","value":"costBasis"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPl"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPlPercent"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PortfolioPositionFieldsFragment, unknown>;
export const PortfolioSummaryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PortfolioSummaryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PortfolioSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionsCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostBasis"}},{"kind":"Field","name":{"kind":"Name","value":"totalMarketValue"}},{"kind":"Field","name":{"kind":"Name","value":"totalUnrealizedPl"}},{"kind":"Field","name":{"kind":"Name","value":"totalUnrealizedPlPercent"}},{"kind":"Field","name":{"kind":"Name","value":"byInstrumentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"weightPercent"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bySymbol"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"weightPercent"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"byCurrency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"weightPercent"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"riskHints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"weightPercent"}}]}}]}}]} as unknown as DocumentNode<PortfolioSummaryFieldsFragment, unknown>;
export const AssetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Assets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"lotSize"}},{"kind":"Field","name":{"kind":"Name","value":"valueToday"}},{"kind":"Field","name":{"kind":"Name","value":"instrumentType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"figi"}},{"kind":"Field","name":{"kind":"Name","value":"sector"}},{"kind":"Field","name":{"kind":"Name","value":"dividendYieldPercent"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}}]}}]} as unknown as DocumentNode<AssetsQuery, AssetsQueryVariables>;
export const AssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Asset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"symbol"},"value":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"lotSize"}},{"kind":"Field","name":{"kind":"Name","value":"valueToday"}},{"kind":"Field","name":{"kind":"Name","value":"instrumentType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"figi"}},{"kind":"Field","name":{"kind":"Name","value":"sector"}},{"kind":"Field","name":{"kind":"Name","value":"dividendYieldPercent"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sectors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}},{"kind":"Field","name":{"kind":"Name","value":"indices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"valueToday"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}}]}}]} as unknown as DocumentNode<AssetQuery, AssetQueryVariables>;
export const IndicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Indices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"valueToday"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}}]}}]} as unknown as DocumentNode<IndicesQuery, IndicesQueryVariables>;
export const SectorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Sectors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sectors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}}]}}]} as unknown as DocumentNode<SectorsQuery, SectorsQueryVariables>;
export const FxRatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FxRates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fxRates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"valueToday"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}}]}}]} as unknown as DocumentNode<FxRatesQuery, FxRatesQueryVariables>;
export const AssetInsightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AssetInsight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assetInsight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"symbol"},"value":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"whatIs"}},{"kind":"Field","name":{"kind":"Name","value":"whatChanged"}},{"kind":"Field","name":{"kind":"Name","value":"whyMatters"}},{"kind":"Field","name":{"kind":"Name","value":"risks"}},{"kind":"Field","name":{"kind":"Name","value":"forInvestor"}},{"kind":"Field","name":{"kind":"Name","value":"vsIndex"}}]}}]}}]} as unknown as DocumentNode<AssetInsightQuery, AssetInsightQueryVariables>;
export const BondsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Bonds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bonds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BondFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BondFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bond"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"lotSize"}},{"kind":"Field","name":{"kind":"Name","value":"valueToday"}},{"kind":"Field","name":{"kind":"Name","value":"couponPercent"}},{"kind":"Field","name":{"kind":"Name","value":"maturityDate"}},{"kind":"Field","name":{"kind":"Name","value":"yieldAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"faceValue"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}}]} as unknown as DocumentNode<BondsQuery, BondsQueryVariables>;
export const BondDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Bond"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bond"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"symbol"},"value":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BondFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BondFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Bond"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"lotSize"}},{"kind":"Field","name":{"kind":"Name","value":"valueToday"}},{"kind":"Field","name":{"kind":"Name","value":"couponPercent"}},{"kind":"Field","name":{"kind":"Name","value":"maturityDate"}},{"kind":"Field","name":{"kind":"Name","value":"yieldAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"faceValue"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"dataSource"}}]}}]} as unknown as DocumentNode<BondQuery, BondQueryVariables>;
export const BondInsightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BondInsight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bondInsight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"symbol"},"value":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"overview"}},{"kind":"Field","name":{"kind":"Name","value":"couponAndMaturity"}},{"kind":"Field","name":{"kind":"Name","value":"yieldContext"}},{"kind":"Field","name":{"kind":"Name","value":"rateSensitivity"}},{"kind":"Field","name":{"kind":"Name","value":"risks"}},{"kind":"Field","name":{"kind":"Name","value":"questionsBeforeBuy"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityNote"}}]}}]}}]} as unknown as DocumentNode<BondInsightQuery, BondInsightQueryVariables>;
export const DiaryEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiaryEntries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DiaryStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"diaryEntries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiaryEntryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiaryEntryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiaryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"horizon"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"risks"}},{"kind":"Field","name":{"kind":"Name","value":"successCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"failureCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotPrice"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotIndexValue"}},{"kind":"Field","name":{"kind":"Name","value":"reviewAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<DiaryEntriesQuery, DiaryEntriesQueryVariables>;
export const DiaryEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiaryEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"diaryEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiaryEntryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiaryEntryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiaryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"horizon"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"risks"}},{"kind":"Field","name":{"kind":"Name","value":"successCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"failureCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotPrice"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotIndexValue"}},{"kind":"Field","name":{"kind":"Name","value":"reviewAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<DiaryEntryQuery, DiaryEntryQueryVariables>;
export const CreateDiaryEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDiaryEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDiaryEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDiaryEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiaryEntryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiaryEntryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiaryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"horizon"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"risks"}},{"kind":"Field","name":{"kind":"Name","value":"successCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"failureCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotPrice"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotIndexValue"}},{"kind":"Field","name":{"kind":"Name","value":"reviewAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateDiaryEntryMutation, CreateDiaryEntryMutationVariables>;
export const UpdateDiaryEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDiaryEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDiaryEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDiaryEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DiaryEntryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DiaryEntryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiaryEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"horizon"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"risks"}},{"kind":"Field","name":{"kind":"Name","value":"successCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"failureCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotPrice"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotIndexValue"}},{"kind":"Field","name":{"kind":"Name","value":"reviewAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateDiaryEntryMutation, UpdateDiaryEntryMutationVariables>;
export const DiaryHypothesisFeedbackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiaryHypothesisFeedback"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DiaryHypothesisFeedbackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"diaryHypothesisFeedback"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"strengths"}},{"kind":"Field","name":{"kind":"Name","value":"gaps"}},{"kind":"Field","name":{"kind":"Name","value":"questions"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]}}]} as unknown as DocumentNode<DiaryHypothesisFeedbackQuery, DiaryHypothesisFeedbackQueryVariables>;
export const DiaryRetrospectiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DiaryRetrospective"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"diaryRetrospective"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryId"}},{"kind":"Field","name":{"kind":"Name","value":"isReady"}},{"kind":"Field","name":{"kind":"Name","value":"daysElapsed"}},{"kind":"Field","name":{"kind":"Name","value":"priceChangePercent"}},{"kind":"Field","name":{"kind":"Name","value":"indexChangePercent"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"questions"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]}}]} as unknown as DocumentNode<DiaryRetrospectiveQuery, DiaryRetrospectiveQueryVariables>;
export const EducationalAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EducationalAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EducationalAnswerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"educationalAnswer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]}}]} as unknown as DocumentNode<EducationalAnswerMutation, EducationalAnswerMutationVariables>;
export const PortfolioPositionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PortfolioPositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portfolioPositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PortfolioPositionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PortfolioPositionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PortfolioPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"assetName"}},{"kind":"Field","name":{"kind":"Name","value":"instrumentType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"entryPrice"}},{"kind":"Field","name":{"kind":"Name","value":"entryDate"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"currentPrice"}},{"kind":"Field","name":{"kind":"Name","value":"marketValue"}},{"kind":"Field","name":{"kind":"Name","value":"costBasis"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPl"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPlPercent"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PortfolioPositionsQuery, PortfolioPositionsQueryVariables>;
export const PortfolioSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PortfolioSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portfolioSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PortfolioSummaryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PortfolioSummaryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PortfolioSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionsCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostBasis"}},{"kind":"Field","name":{"kind":"Name","value":"totalMarketValue"}},{"kind":"Field","name":{"kind":"Name","value":"totalUnrealizedPl"}},{"kind":"Field","name":{"kind":"Name","value":"totalUnrealizedPlPercent"}},{"kind":"Field","name":{"kind":"Name","value":"byInstrumentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"weightPercent"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bySymbol"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"weightPercent"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"byCurrency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"weightPercent"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"riskHints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"weightPercent"}}]}}]}}]} as unknown as DocumentNode<PortfolioSummaryQuery, PortfolioSummaryQueryVariables>;
export const CreatePortfolioPositionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePortfolioPosition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePortfolioPositionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPortfolioPosition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PortfolioPositionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PortfolioPositionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PortfolioPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"assetName"}},{"kind":"Field","name":{"kind":"Name","value":"instrumentType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"entryPrice"}},{"kind":"Field","name":{"kind":"Name","value":"entryDate"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"currentPrice"}},{"kind":"Field","name":{"kind":"Name","value":"marketValue"}},{"kind":"Field","name":{"kind":"Name","value":"costBasis"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPl"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPlPercent"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreatePortfolioPositionMutation, CreatePortfolioPositionMutationVariables>;
export const UpdatePortfolioPositionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePortfolioPosition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePortfolioPositionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePortfolioPosition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PortfolioPositionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PortfolioPositionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PortfolioPosition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"assetName"}},{"kind":"Field","name":{"kind":"Name","value":"instrumentType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"entryPrice"}},{"kind":"Field","name":{"kind":"Name","value":"entryDate"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"currentPrice"}},{"kind":"Field","name":{"kind":"Name","value":"marketValue"}},{"kind":"Field","name":{"kind":"Name","value":"costBasis"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPl"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPlPercent"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdatePortfolioPositionMutation, UpdatePortfolioPositionMutationVariables>;
export const DeletePortfolioPositionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePortfolioPosition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePortfolioPosition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeletePortfolioPositionMutation, DeletePortfolioPositionMutationVariables>;
export const WeeklyMarketReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WeeklyMarketReview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weeklyMarketReview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weekStart"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"sectors"}},{"kind":"Field","name":{"kind":"Name","value":"bondsAndRub"}},{"kind":"Field","name":{"kind":"Name","value":"events"}},{"kind":"Field","name":{"kind":"Name","value":"risksForNextWeek"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"generatedAt"}}]}}]}}]} as unknown as DocumentNode<WeeklyMarketReviewQuery, WeeklyMarketReviewQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"knowledgeLevel"}},{"kind":"Field","name":{"kind":"Name","value":"preferredLocale"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"knowledgeLevel"}},{"kind":"Field","name":{"kind":"Name","value":"preferredLocale"}},{"kind":"Field","name":{"kind":"Name","value":"oauthProviders"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UnlinkOAuthProviderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnlinkOAuthProvider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OAuthProvider"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlinkOAuthProvider"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"provider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"knowledgeLevel"}},{"kind":"Field","name":{"kind":"Name","value":"preferredLocale"}},{"kind":"Field","name":{"kind":"Name","value":"oauthProviders"}}]}}]}}]} as unknown as DocumentNode<UnlinkOAuthProviderMutation, UnlinkOAuthProviderMutationVariables>;