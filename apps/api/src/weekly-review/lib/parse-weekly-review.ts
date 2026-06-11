import {
  extractJsonObject,
  normalizeInsightString,
  normalizeInsightStringArray,
} from '../../ai/lib/parse-json-block';

import type { WeeklyReviewContent } from './weekly-review.types';

export function parseWeeklyReviewJson(raw: string): WeeklyReviewContent | null {
  const jsonBlock = extractJsonObject(raw);
  if (!jsonBlock) {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonBlock) as Record<string, unknown>;
    const summary = normalizeInsightString(parsed.summary);
    const sectors = normalizeInsightStringArray(parsed.sectors);
    const bondsAndRub = normalizeInsightString(parsed.bondsAndRub);
    const events = normalizeInsightStringArray(parsed.events);
    const risksForNextWeek = normalizeInsightStringArray(parsed.risksForNextWeek);

    if (!summary || !bondsAndRub || sectors.length === 0 || risksForNextWeek.length === 0) {
      return null;
    }

    return {
      summary,
      sectors,
      bondsAndRub,
      events,
      risksForNextWeek,
    };
  } catch {
    return null;
  }
}
