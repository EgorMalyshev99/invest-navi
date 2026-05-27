import {
  extractJsonObject,
  normalizeInsightString,
  normalizeInsightStringArray,
} from './parse-json-block';

import type { BondInsightContent } from './bond-insight.types';


export function parseBondInsightJson(raw: string): BondInsightContent | null {
  const jsonBlock = extractJsonObject(raw) ?? raw.trim();

  try {
    const parsed = JSON.parse(jsonBlock) as Record<string, unknown>;
    const overview = normalizeInsightString(parsed.overview);
    const couponAndMaturity = normalizeInsightString(parsed.couponAndMaturity);
    const yieldContext = normalizeInsightString(parsed.yieldContext);
    const rateSensitivity = normalizeInsightString(parsed.rateSensitivity);
    const risks = normalizeInsightStringArray(parsed.risks);
    const questionsBeforeBuy = normalizeInsightStringArray(parsed.questionsBeforeBuy);

    if (
      !overview ||
      !couponAndMaturity ||
      !yieldContext ||
      !rateSensitivity ||
      risks.length === 0 ||
      questionsBeforeBuy.length === 0
    ) {
      return null;
    }

    return {
      overview,
      couponAndMaturity,
      yieldContext,
      rateSensitivity,
      risks,
      questionsBeforeBuy,
      liquidityNote: normalizeInsightString(parsed.liquidityNote) ?? undefined,
    };
  } catch {
    return null;
  }
}
