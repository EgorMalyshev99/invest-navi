import { describe, expect, it } from 'vitest';

import { sanitizeComplianceText, scanComplianceText } from './compliance-text';

describe('scanComplianceText', () => {
  it('allows educational neutral text', () => {
    expect(scanComplianceText('Рынок мог двигаться из-за ставки и валюты.')).toEqual({
      ok: true,
      violations: [],
    });
  });

  it('flags trading directives', () => {
    const result = scanComplianceText('Стоит купить эту бумагу сейчас.');
    expect(result.ok).toBe(false);
    expect(result.violations).toContain('TRADING_DIRECTIVE');
  });

  it('flags guaranteed return claims', () => {
    const result = scanComplianceText('Гарантированный доход без риска.');
    expect(result.ok).toBe(false);
    expect(result.violations).toContain('GUARANTEED_RETURN');
  });

  it('flags deposit comparison without risk caveat', () => {
    const result = scanComplianceText('Доходность выше вклада в банке.');
    expect(result.ok).toBe(false);
    expect(result.violations).toContain('DEPOSIT_COMPARISON_WITHOUT_RISK');
  });
});

describe('sanitizeComplianceText', () => {
  it('strips buy directive and keeps safe remainder', () => {
    const sanitized = sanitizeComplianceText('Стоит купить. Следите за рисками.');
    expect(sanitized).not.toMatch(/купить/i);
    expect(sanitized.length).toBeGreaterThan(0);
  });
});
