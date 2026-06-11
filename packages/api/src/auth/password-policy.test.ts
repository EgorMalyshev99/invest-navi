import { describe, expect, it } from 'vitest';

import { analyzePassword, isPasswordAcceptableForRegistration } from './password-policy.js';

describe('password policy', () => {
  it('marks weak passwords', () => {
    expect(analyzePassword('short').level).toBe('weak');
    expect(isPasswordAcceptableForRegistration('short')).toBe(false);
  });

  it('accepts fair and strong passwords', () => {
    expect(isPasswordAcceptableForRegistration('Abcdef12')).toBe(true);
    expect(analyzePassword('Abcdef12abcd').level).toBe('strong');
  });
});
