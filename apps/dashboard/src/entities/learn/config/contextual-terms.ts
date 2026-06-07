import type { GlossaryTermId } from '../model/types';

/** Screen → glossary terms shown in context (PRODUCT §11). */
export const CONTEXTUAL_GLOSSARY_BY_SCREEN = {
  'asset-detail': ['volatility', 'dividend', 'index'] as const satisfies readonly GlossaryTermId[],
  'bond-detail': [
    'coupon',
    'yield',
    'issuer',
    'face-value',
  ] as const satisfies readonly GlossaryTermId[],
  'bonds-intro': ['coupon', 'bond'] as const satisfies readonly GlossaryTermId[],
  'diary-view': ['diversification', 'volatility'] as const satisfies readonly GlossaryTermId[],
  'diary-entry-form': [
    'diversification',
    'volatility',
  ] as const satisfies readonly GlossaryTermId[],
  'portfolio-view': ['diversification'] as const satisfies readonly GlossaryTermId[],
  'market-overview': ['index', 'sector'] as const satisfies readonly GlossaryTermId[],
} as const;

export type ContextualGlossaryScreen = keyof typeof CONTEXTUAL_GLOSSARY_BY_SCREEN;
