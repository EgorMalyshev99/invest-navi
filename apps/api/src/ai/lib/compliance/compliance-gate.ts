import { sanitizeComplianceText, scanComplianceTexts } from './compliance-text';

import type { BondInsightContent } from '../bond-insight.types';
import type { DiaryHypothesisFeedbackContent } from '../diary-feedback.types';
import type { AssetInsightContent } from '../insight.types';
import type { WeeklyReviewContent } from '@repo/api';

import type {
  ComplianceGateResult,
  ComplianceViolationCode,
  RetroInsightContent,
} from './compliance-types';

function gateResult<T>(
  content: T | null,
  violations: ComplianceViolationCode[],
): ComplianceGateResult<T> {
  const ok = content !== null && violations.length === 0;
  return {
    ok,
    content: ok ? content : null,
    violations,
  };
}

function sanitizeStrings(values: string[]): string[] {
  return values.map((value) => sanitizeComplianceText(value)).filter((value) => value.length > 0);
}

function rejectIfPreSanitizeViolations(originalTexts: string[]): ComplianceViolationCode[] | null {
  const preScan = scanComplianceTexts(originalTexts);
  return preScan.ok ? null : preScan.violations;
}

export function applyAssetInsightCompliance(
  content: AssetInsightContent,
): ComplianceGateResult<AssetInsightContent> {
  const originalTexts = [
    content.whatIs,
    content.whatChanged,
    content.whyMatters,
    content.forInvestor,
    ...content.risks,
    ...(content.vsIndex ? [content.vsIndex] : []),
  ];
  const preViolations = rejectIfPreSanitizeViolations(originalTexts);
  if (preViolations) {
    return gateResult<AssetInsightContent>(null, preViolations);
  }

  const sanitized: AssetInsightContent = {
    whatIs: sanitizeComplianceText(content.whatIs),
    whatChanged: sanitizeComplianceText(content.whatChanged),
    whyMatters: sanitizeComplianceText(content.whyMatters),
    risks: sanitizeStrings(content.risks),
    forInvestor: sanitizeComplianceText(content.forInvestor),
    vsIndex: content.vsIndex ? sanitizeComplianceText(content.vsIndex) : undefined,
  };

  if (
    !sanitized.whatIs ||
    !sanitized.whatChanged ||
    !sanitized.whyMatters ||
    !sanitized.forInvestor ||
    sanitized.risks.length === 0
  ) {
    return gateResult<AssetInsightContent>(null, ['TRADING_DIRECTIVE']);
  }

  const scan = scanComplianceTexts([
    sanitized.whatIs,
    sanitized.whatChanged,
    sanitized.whyMatters,
    sanitized.forInvestor,
    ...sanitized.risks,
    ...(sanitized.vsIndex ? [sanitized.vsIndex] : []),
  ]);

  return gateResult(scan.ok ? sanitized : null, scan.violations);
}

export function applyBondInsightCompliance(
  content: BondInsightContent,
): ComplianceGateResult<BondInsightContent> {
  const originalTexts = [
    content.overview,
    content.couponAndMaturity,
    content.yieldContext,
    content.rateSensitivity,
    ...content.risks,
    ...content.questionsBeforeBuy,
    ...(content.liquidityNote ? [content.liquidityNote] : []),
  ];
  const preViolations = rejectIfPreSanitizeViolations(originalTexts);
  if (preViolations) {
    return gateResult<BondInsightContent>(null, preViolations);
  }

  const sanitized: BondInsightContent = {
    overview: sanitizeComplianceText(content.overview),
    couponAndMaturity: sanitizeComplianceText(content.couponAndMaturity),
    yieldContext: sanitizeComplianceText(content.yieldContext),
    rateSensitivity: sanitizeComplianceText(content.rateSensitivity),
    risks: sanitizeStrings(content.risks),
    questionsBeforeBuy: sanitizeStrings(content.questionsBeforeBuy),
    liquidityNote: content.liquidityNote
      ? sanitizeComplianceText(content.liquidityNote)
      : undefined,
  };

  if (
    !sanitized.overview ||
    !sanitized.couponAndMaturity ||
    !sanitized.yieldContext ||
    !sanitized.rateSensitivity ||
    sanitized.risks.length === 0 ||
    sanitized.questionsBeforeBuy.length === 0
  ) {
    return gateResult<BondInsightContent>(null, ['TRADING_DIRECTIVE']);
  }

  const scan = scanComplianceTexts([
    sanitized.overview,
    sanitized.couponAndMaturity,
    sanitized.yieldContext,
    sanitized.rateSensitivity,
    ...sanitized.risks,
    ...sanitized.questionsBeforeBuy,
    ...(sanitized.liquidityNote ? [sanitized.liquidityNote] : []),
  ]);

  return gateResult(scan.ok ? sanitized : null, scan.violations);
}

export function applyDiaryFeedbackCompliance(
  content: DiaryHypothesisFeedbackContent,
): ComplianceGateResult<DiaryHypothesisFeedbackContent> {
  const originalTexts = [
    content.summary,
    ...content.strengths,
    ...content.gaps,
    ...content.questions,
  ];
  const preViolations = rejectIfPreSanitizeViolations(originalTexts);
  if (preViolations) {
    return gateResult<DiaryHypothesisFeedbackContent>(null, preViolations);
  }

  const sanitized: DiaryHypothesisFeedbackContent = {
    summary: sanitizeComplianceText(content.summary),
    strengths: sanitizeStrings(content.strengths),
    gaps: sanitizeStrings(content.gaps),
    questions: sanitizeStrings(content.questions),
  };

  if (!sanitized.summary) {
    return gateResult<DiaryHypothesisFeedbackContent>(null, ['TRADING_DIRECTIVE']);
  }

  const scan = scanComplianceTexts([
    sanitized.summary,
    ...sanitized.strengths,
    ...sanitized.gaps,
    ...sanitized.questions,
  ]);

  return gateResult(scan.ok ? sanitized : null, scan.violations);
}

export function applyRetroInsightCompliance(
  content: RetroInsightContent,
): ComplianceGateResult<RetroInsightContent> {
  const preViolations = rejectIfPreSanitizeViolations([content.summary, ...content.questions]);
  if (preViolations) {
    return gateResult<RetroInsightContent>(null, preViolations);
  }

  const sanitized: RetroInsightContent = {
    summary: sanitizeComplianceText(content.summary),
    questions: sanitizeStrings(content.questions),
  };

  if (!sanitized.summary) {
    return gateResult<RetroInsightContent>(null, ['TRADING_DIRECTIVE']);
  }

  const scan = scanComplianceTexts([sanitized.summary, ...sanitized.questions]);
  return gateResult(scan.ok ? sanitized : null, scan.violations);
}

export function applyWeeklyReviewCompliance(
  content: WeeklyReviewContent,
): ComplianceGateResult<WeeklyReviewContent> {
  const originalTexts = [
    content.summary,
    content.bondsAndRub,
    ...content.sectors,
    ...content.events,
    ...content.risksForNextWeek,
  ];
  const preViolations = rejectIfPreSanitizeViolations(originalTexts);
  if (preViolations) {
    return gateResult<WeeklyReviewContent>(null, preViolations);
  }

  const sanitized = {
    summary: sanitizeComplianceText(content.summary),
    sectors: sanitizeStrings(content.sectors),
    bondsAndRub: sanitizeComplianceText(content.bondsAndRub),
    events: sanitizeStrings(content.events),
    risksForNextWeek: sanitizeStrings(content.risksForNextWeek),
  };

  if (!sanitized.summary || !sanitized.bondsAndRub || sanitized.sectors.length === 0) {
    return gateResult<WeeklyReviewContent>(null, ['TRADING_DIRECTIVE']);
  }

  const scan = scanComplianceTexts([
    sanitized.summary,
    sanitized.bondsAndRub,
    ...sanitized.sectors,
    ...sanitized.events,
    ...sanitized.risksForNextWeek,
  ]);

  return gateResult(scan.ok ? sanitized : null, scan.violations);
}

export function formatComplianceViolations(violations: ComplianceViolationCode[]): string {
  return violations.join(', ');
}
