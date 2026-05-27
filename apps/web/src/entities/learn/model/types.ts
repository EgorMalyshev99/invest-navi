export type LearnCategory = 'fundamentals' | 'instruments' | 'mistakes' | 'scenarios';

export type LearnArticleSlug =
  | 'getting-started'
  | 'stocks-and-bonds'
  | 'common-mistakes'
  | 'instrument-stocks'
  | 'instrument-bonds'
  | 'instrument-etf'
  | 'scenario-watchlist'
  | 'scenario-checklist';

export type GlossaryTermId =
  | 'stock'
  | 'bond'
  | 'dividend'
  | 'coupon'
  | 'index'
  | 'diversification'
  | 'volatility'
  | 'issuer'
  | 'yield'
  | 'lot'
  | 'sector'
  | 'face-value';

export type RiskTypeId = 'market' | 'rate' | 'currency' | 'dividend' | 'liquidity';

export type MarketMood = 'up' | 'down' | 'flat';

export type LearnRelatedHref =
  | '/market'
  | '/watchlist'
  | '/diary'
  | '/portfolio'
  | '/bonds'
  | '/learn/glossary';
