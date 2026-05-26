import type { DiaryHypothesisFeedbackContent } from './diary-feedback.types';

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

export function parseDiaryFeedbackJson(raw: string): DiaryHypothesisFeedbackContent | null {
  const trimmed = raw.trim();
  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as Record<string, unknown>;
    const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
    if (!summary) {
      return null;
    }

    return {
      summary,
      strengths: asStringArray(parsed.strengths),
      gaps: asStringArray(parsed.gaps),
      questions: asStringArray(parsed.questions),
    };
  } catch {
    return null;
  }
}
