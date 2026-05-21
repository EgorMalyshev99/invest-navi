import type { AssetInsightContent } from './insight.types';

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function parseInsightJson(raw: string): AssetInsightContent | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const whatIs = asString(parsed.whatIs);
    const whatChanged = asString(parsed.whatChanged);
    const whyMatters = asString(parsed.whyMatters);
    const forInvestor = asString(parsed.forInvestor);
    const risksRaw = parsed.risks;

    if (!whatIs || !whatChanged || !whyMatters || !forInvestor || !Array.isArray(risksRaw)) {
      return null;
    }

    const risks = risksRaw
      .map((item) => asString(item))
      .filter((item): item is string => Boolean(item));

    if (risks.length === 0) {
      return null;
    }

    return {
      whatIs,
      whatChanged,
      whyMatters,
      risks,
      forInvestor,
      vsIndex: asString(parsed.vsIndex) ?? undefined,
    };
  } catch {
    return null;
  }
}
