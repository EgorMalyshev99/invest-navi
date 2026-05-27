import {
  DEPOSIT_MENTION_PATTERN,
  DEPOSIT_RISK_CAVEAT_PATTERN,
  EN_DEPOSIT_MENTION_PATTERN,
  GUARANTEED_RETURN_PATTERNS,
  TRADING_DIRECTIVE_PATTERNS,
} from './compliance-patterns';

import type { ComplianceScanResult, ComplianceViolationCode } from './compliance-types';

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

function hasDepositComparisonWithoutRisk(text: string): boolean {
  const mentionsDeposit =
    DEPOSIT_MENTION_PATTERN.test(text) || EN_DEPOSIT_MENTION_PATTERN.test(text);
  DEPOSIT_MENTION_PATTERN.lastIndex = 0;
  EN_DEPOSIT_MENTION_PATTERN.lastIndex = 0;

  if (!mentionsDeposit) {
    return false;
  }

  DEPOSIT_RISK_CAVEAT_PATTERN.lastIndex = 0;
  return !DEPOSIT_RISK_CAVEAT_PATTERN.test(text);
}

export function scanComplianceText(text: string): ComplianceScanResult {
  const violations: ComplianceViolationCode[] = [];
  const normalized = text.trim();

  if (!normalized) {
    return { ok: true, violations };
  }

  if (matchesAny(normalized, TRADING_DIRECTIVE_PATTERNS)) {
    violations.push('TRADING_DIRECTIVE');
  }
  if (matchesAny(normalized, GUARANTEED_RETURN_PATTERNS)) {
    violations.push('GUARANTEED_RETURN');
  }
  if (hasDepositComparisonWithoutRisk(normalized)) {
    violations.push('DEPOSIT_COMPARISON_WITHOUT_RISK');
  }

  return { ok: violations.length === 0, violations };
}

export function scanComplianceTexts(texts: string[]): ComplianceScanResult {
  const allViolations = new Set<ComplianceViolationCode>();

  for (const text of texts) {
    const result = scanComplianceText(text);
    for (const code of result.violations) {
      allViolations.add(code);
    }
  }

  const violations = [...allViolations];
  return { ok: violations.length === 0, violations };
}

function stripPattern(text: string, pattern: RegExp): string {
  pattern.lastIndex = 0;
  return text
    .replace(pattern, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Remove known risky phrases; may leave shortened but safe text. */
export function sanitizeComplianceText(text: string): string {
  let result = text;

  for (const pattern of TRADING_DIRECTIVE_PATTERNS) {
    result = stripPattern(result, pattern);
  }
  for (const pattern of GUARANTEED_RETURN_PATTERNS) {
    result = stripPattern(result, pattern);
  }

  if (hasDepositComparisonWithoutRisk(result)) {
    const isEn = EN_DEPOSIT_MENTION_PATTERN.test(result);
    DEPOSIT_MENTION_PATTERN.lastIndex = 0;
    EN_DEPOSIT_MENTION_PATTERN.lastIndex = 0;
    const caveat = isEn
      ? ' Any comparison with bank deposits must account for default and price risk.'
      : ' Сравнение с вкладом возможно только с учётом риска дефолта и изменения цены.';
    result = `${result.trim()}${caveat}`;
  }

  return result.trim();
}

export function sanitizeComplianceTexts(texts: string[]): string[] {
  return texts.map((text) => sanitizeComplianceText(text));
}
