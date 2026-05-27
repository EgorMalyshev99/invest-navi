export type ComplianceViolationCode =
  | 'TRADING_DIRECTIVE'
  | 'GUARANTEED_RETURN'
  | 'DEPOSIT_COMPARISON_WITHOUT_RISK';

export interface ComplianceScanResult {
  ok: boolean;
  violations: ComplianceViolationCode[];
}

export interface ComplianceGateResult<T> {
  ok: boolean;
  content: T | null;
  violations: ComplianceViolationCode[];
}

export interface RetroInsightContent {
  summary: string;
  questions: string[];
}
