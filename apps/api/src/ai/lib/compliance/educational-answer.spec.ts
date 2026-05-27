import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildFallbackEducationalAnswer } from '../build-educational-answer-prompt';
import { scanComplianceText } from './compliance-text';

describe('educational answer compliance', () => {
  it('rejects answer with buy directive', () => {
    const result = scanComplianceText('You should buy this stock now for dividends.');
    assert.equal(result.ok, false);
  });

  it('allows educational bond rate explanation', () => {
    const result = scanComplianceText(
      'When rates rise, existing bonds with lower coupons may become less attractive, so prices may fall. This is not investment advice.',
    );
    assert.equal(result.ok, true);
  });

  it('fallback text passes compliance scan', () => {
    for (const locale of ['ru', 'en'] as const) {
      const fallback = buildFallbackEducationalAnswer(locale);
      const result = scanComplianceText(fallback);
      assert.equal(result.ok, true, `fallback failed for ${locale}`);
    }
  });
});
