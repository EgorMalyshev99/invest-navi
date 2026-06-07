import { LEARN_ARTICLES, type LearnArticleMeta } from '../config/articles';

import type { LearnArticleSlug } from '../model/types';

const BEGINNER_SLUG_ORDER: LearnArticleSlug[] = [
  'getting-started',
  'stocks-and-bonds',
  'common-mistakes',
  'instrument-stocks',
  'instrument-bonds',
  'instrument-etf',
  'scenario-watchlist',
  'scenario-checklist',
];

const ADVANCED_SLUG_ORDER: LearnArticleSlug[] = [
  'instrument-stocks',
  'instrument-bonds',
  'instrument-etf',
  'scenario-watchlist',
  'scenario-checklist',
  'getting-started',
  'stocks-and-bonds',
  'common-mistakes',
];

export type LearnHubKnowledgeLevel = 'beginner' | 'intermediate' | 'advanced' | null | undefined;

export function getLearnHubArticleOrder(
  knowledgeLevel: LearnHubKnowledgeLevel,
): LearnArticleMeta[] {
  const slugOrder = knowledgeLevel === 'advanced' ? ADVANCED_SLUG_ORDER : BEGINNER_SLUG_ORDER;
  const bySlug = new Map(LEARN_ARTICLES.map((article) => [article.slug, article]));

  return slugOrder.flatMap((slug) => {
    const article = bySlug.get(slug);
    return article ? [article] : [];
  });
}
