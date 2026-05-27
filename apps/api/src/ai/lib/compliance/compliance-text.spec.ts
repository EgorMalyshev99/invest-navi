import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  applyAssetInsightCompliance,
  applyBondInsightCompliance,
  applyDiaryFeedbackCompliance,
  applyRetroInsightCompliance,
} from './compliance-gate';
import { sanitizeComplianceText, scanComplianceText } from './compliance-text';

import type { AssetInsightContent } from '../insight.types';

const safeAssetInsight: AssetInsightContent = {
  whatIs: 'Educational overview of the issuer.',
  whatChanged: 'Price moved within the session range.',
  whyMatters: 'Context for your hypothesis — not a forecast.',
  risks: ['Market risk may affect the price.', 'Sector factors matter.'],
  forInvestor: 'May suit investors who accept equity volatility; not personal advice.',
};

describe('scanComplianceText', () => {
  it('flags Russian trading directives', () => {
    const result = scanComplianceText('Рекомендую купить бумагу сейчас.');
    assert.equal(result.ok, false);
    assert.ok(result.violations.includes('TRADING_DIRECTIVE'));
  });

  it('flags English trading directives', () => {
    const result = scanComplianceText('You should buy this stock now.');
    assert.equal(result.ok, false);
    assert.ok(result.violations.includes('TRADING_DIRECTIVE'));
  });

  it('flags guaranteed return claims', () => {
    const result = scanComplianceText('Гарантированный доход без риска.');
    assert.ok(!result.ok);
    assert.ok(result.violations.includes('GUARANTEED_RETURN'));
  });

  it('flags deposit comparison without risk caveat', () => {
    const result = scanComplianceText('Доходность лучше банковского вклада.');
    assert.equal(result.ok, false);
    assert.ok(result.violations.includes('DEPOSIT_COMPARISON_WITHOUT_RISK'));
  });

  it('allows deposit mention with explicit risk caveat', () => {
    const result = scanComplianceText(
      'Доходность может отличаться от вклада из‑за риска дефолта и изменения цены.',
    );
    assert.equal(result.ok, true);
  });

  it('allows cautious educational copy', () => {
    const result = scanComplianceText(
      'Цена может измениться; сверьте движение с гипотезой — это не прогноз.',
    );
    assert.equal(result.ok, true);
  });
});

describe('sanitizeComplianceText', () => {
  it('strips imperative buy phrasing', () => {
    const sanitized = sanitizeComplianceText('Стоит купить бумагу на дивиденды.');
    const scan = scanComplianceText(sanitized);
    assert.equal(scan.ok, true);
  });

  it('appends risk caveat for unsafe deposit comparison', () => {
    const sanitized = sanitizeComplianceText('Доходность выше вклада.');
    assert.match(sanitized, /риск/i);
    const scan = scanComplianceText(sanitized);
    assert.equal(scan.ok, true);
  });
});

describe('applyAssetInsightCompliance', () => {
  it('passes safe educational insight', () => {
    const result = applyAssetInsightCompliance(safeAssetInsight);
    assert.equal(result.ok, true);
    assert.ok(result.content);
  });

  it('rejects insight with trading directive', () => {
    const result = applyAssetInsightCompliance({
      ...safeAssetInsight,
      forInvestor: 'Покупай сейчас, пока дешёво.',
    });
    assert.equal(result.ok, false);
    assert.equal(result.content, null);
  });
});

describe('applyBondInsightCompliance', () => {
  it('rejects bond copy comparing to deposit without risk', () => {
    const result = applyBondInsightCompliance({
      overview: 'Corporate bond on MOEX.',
      couponAndMaturity: 'Coupon 8%, maturity 2030.',
      yieldContext: 'Yield is better than a bank deposit.',
      rateSensitivity: 'Sensitive to rate changes.',
      risks: ['Issuer risk applies.'],
      questionsBeforeBuy: ['Who is the issuer?'],
    });
    assert.equal(result.ok, false);
  });
});

describe('applyDiaryFeedbackCompliance', () => {
  it('rejects feedback with sell directive', () => {
    const result = applyDiaryFeedbackCompliance({
      summary: 'Продавай до падения.',
      strengths: [],
      gaps: [],
      questions: [],
    });
    assert.equal(result.ok, false);
  });
});

describe('applyRetroInsightCompliance', () => {
  it('passes retrospective summary with cautious wording', () => {
    const result = applyRetroInsightCompliance({
      summary: 'Price moved; compare with your criteria — not a verdict.',
      questions: ['What would you check before acting again?'],
    });
    assert.equal(result.ok, true);
  });
});
