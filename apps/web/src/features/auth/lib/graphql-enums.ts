import type { KnowledgeLevelValue } from '@/features/auth/model/schemas';
import type { KnowledgeLevel, PreferredLocale } from '@/shared/api/graphql/generated/graphql';

export type PreferredLocaleValue = 'ru' | 'en';

const knowledgeLevelToGraphql: Record<KnowledgeLevelValue, KnowledgeLevel> = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  advanced: 'ADVANCED',
};

const knowledgeLevelFromGraphql: Record<KnowledgeLevel, KnowledgeLevelValue> = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

const preferredLocaleToGraphql: Record<PreferredLocaleValue, PreferredLocale> = {
  ru: 'RU',
  en: 'EN',
};

const preferredLocaleFromGraphql: Record<PreferredLocale, PreferredLocaleValue> = {
  RU: 'ru',
  EN: 'en',
};

export function toGraphqlKnowledgeLevel(value: KnowledgeLevelValue): KnowledgeLevel {
  return knowledgeLevelToGraphql[value];
}

export function fromGraphqlKnowledgeLevel(value: KnowledgeLevel): KnowledgeLevelValue {
  return knowledgeLevelFromGraphql[value];
}

export function toGraphqlPreferredLocale(value: PreferredLocaleValue): PreferredLocale {
  return preferredLocaleToGraphql[value];
}

export function fromGraphqlPreferredLocale(value: PreferredLocale): PreferredLocaleValue {
  return preferredLocaleFromGraphql[value];
}
