import {
  extractJsonObject,
  normalizeInsightString,
  normalizeInsightStringArray,
} from './parse-json-block';

import type { RetroInsightContent } from './compliance/compliance-types';


export function parseRetroInsightJson(raw: string): RetroInsightContent | null {
  const jsonBlock = extractJsonObject(raw);
  if (!jsonBlock) {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonBlock) as Record<string, unknown>;
    const summary = normalizeInsightString(parsed.summary);
    if (!summary) {
      return null;
    }

    return {
      summary,
      questions: normalizeInsightStringArray(parsed.questions),
    };
  } catch {
    return null;
  }
}
