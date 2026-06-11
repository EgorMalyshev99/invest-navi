import { describe, expect, it } from 'vitest';

import { applyAssetInsightCompliance } from './compliance-gate';

const safeContent = {
  whatIs: 'Акция — доля в компании.',
  whatChanged: 'Цена изменилась за неделю.',
  whyMatters: 'Инвесторы оценивают ожидания по прибыли.',
  risks: ['Рыночный риск', 'Секторный риск'],
  forInvestor: 'Сверьте гипотезу с горизонтом и допустимой просадкой.',
};

describe('applyAssetInsightCompliance', () => {
  it('accepts compliant insight', () => {
    const result = applyAssetInsightCompliance(safeContent);
    expect(result.ok).toBe(true);
    expect(result.content).not.toBeNull();
  });

  it('rejects buy recommendation', () => {
    const result = applyAssetInsightCompliance({
      ...safeContent,
      forInvestor: 'Стоит купить прямо сейчас.',
    });
    expect(result.ok).toBe(false);
    expect(result.violations).toContain('TRADING_DIRECTIVE');
  });
});
