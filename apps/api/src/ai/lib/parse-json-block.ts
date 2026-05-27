export function extractJsonObject(raw: string): string | null {
  const trimmed = raw.trim();
  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    return null;
  }
  return trimmed.slice(jsonStart, jsonEnd + 1);
}

export function normalizeInsightString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim().replace(/\s+/g, ' ');
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeInsightStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => normalizeInsightString(item))
    .filter((item): item is string => Boolean(item));
}
