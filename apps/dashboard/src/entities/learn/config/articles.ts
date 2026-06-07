import type { LearnArticleSlug, LearnCategory, LearnRelatedHref } from '../model/types';

export interface LearnArticleMeta {
  slug: LearnArticleSlug;
  category: LearnCategory;
  sections: readonly string[];
  relatedHrefs?: readonly LearnRelatedHref[];
}

export const LEARN_ARTICLES: LearnArticleMeta[] = [
  {
    slug: 'getting-started',
    category: 'fundamentals',
    sections: ['s1', 's2', 's3'],
    relatedHrefs: ['/market', '/watchlist', '/diary'],
  },
  {
    slug: 'stocks-and-bonds',
    category: 'fundamentals',
    sections: ['s1', 's2', 's3', 's4'],
    relatedHrefs: ['/market', '/bonds'],
  },
  {
    slug: 'common-mistakes',
    category: 'mistakes',
    sections: ['s1', 's2', 's3', 's4'],
    relatedHrefs: ['/diary', '/portfolio'],
  },
  {
    slug: 'instrument-stocks',
    category: 'instruments',
    sections: ['s1', 's2', 's3'],
    relatedHrefs: ['/market'],
  },
  {
    slug: 'instrument-bonds',
    category: 'instruments',
    sections: ['s1', 's2', 's3'],
    relatedHrefs: ['/bonds'],
  },
  {
    slug: 'instrument-etf',
    category: 'instruments',
    sections: ['s1', 's2', 's3'],
    relatedHrefs: ['/market'],
  },
  {
    slug: 'scenario-watchlist',
    category: 'scenarios',
    sections: ['s1', 's2', 's3', 's4'],
    relatedHrefs: ['/watchlist', '/market'],
  },
  {
    slug: 'scenario-checklist',
    category: 'scenarios',
    sections: ['s1', 's2', 's3'],
    relatedHrefs: ['/diary'],
  },
];

export const LEARN_ARTICLE_SLUGS = LEARN_ARTICLES.map((article) => article.slug);

export function isLearnArticleSlug(value: string): value is LearnArticleSlug {
  return LEARN_ARTICLE_SLUGS.includes(value as LearnArticleSlug);
}

export function getLearnArticleMeta(slug: LearnArticleSlug): LearnArticleMeta | undefined {
  return LEARN_ARTICLES.find((article) => article.slug === slug);
}
