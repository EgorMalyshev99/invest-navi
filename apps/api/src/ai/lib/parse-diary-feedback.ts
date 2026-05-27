import {
  extractJsonObject,
  normalizeInsightString,
  normalizeInsightStringArray,
} from './parse-json-block';

import type { DiaryHypothesisFeedbackContent } from './diary-feedback.types';


export function parseDiaryFeedbackJson(raw: string): DiaryHypothesisFeedbackContent | null {
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
      strengths: normalizeInsightStringArray(parsed.strengths),
      gaps: normalizeInsightStringArray(parsed.gaps),
      questions: normalizeInsightStringArray(parsed.questions),
    };
  } catch {
    return null;
  }
}
