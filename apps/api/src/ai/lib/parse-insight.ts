import {
  extractJsonObject,
  normalizeInsightString,
  normalizeInsightStringArray,
} from './parse-json-block';

import type { AssetInsightContent } from './insight.types';


export function parseInsightJson(raw: string): AssetInsightContent | null {
  const jsonBlock = extractJsonObject(raw);
  if (!jsonBlock) {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonBlock) as Record<string, unknown>;
    const whatIs = normalizeInsightString(parsed.whatIs);
    const whatChanged = normalizeInsightString(parsed.whatChanged);
    const whyMatters = normalizeInsightString(parsed.whyMatters);
    const forInvestor = normalizeInsightString(parsed.forInvestor);
    const risks = normalizeInsightStringArray(parsed.risks);

    if (!whatIs || !whatChanged || !whyMatters || !forInvestor || risks.length === 0) {
      return null;
    }

    return {
      whatIs,
      whatChanged,
      whyMatters,
      risks,
      forInvestor,
      vsIndex: normalizeInsightString(parsed.vsIndex) ?? undefined,
    };
  } catch {
    return null;
  }
}
