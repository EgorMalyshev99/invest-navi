import { describe, expect, it } from 'vitest';

import {
  assertLoginInput,
  assertRegisterInput,
  assertValidEmail,
  ValidationError,
} from './input-validation.js';

describe('assertValidEmail', () => {
  it('normalizes and accepts valid email', () => {
    expect(assertValidEmail('  User@Example.COM ')).toBe('user@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => assertValidEmail('not-an-email')).toThrow(ValidationError);
  });
});

describe('assertLoginInput', () => {
  it('returns normalized email and password', () => {
    expect(assertLoginInput({ email: 'a@b.co', password: 'secret' })).toEqual({
      email: 'a@b.co',
      password: 'secret',
    });
  });

  it('requires password', () => {
    expect(() => assertLoginInput({ email: 'a@b.co', password: '' })).toThrow(ValidationError);
  });
});

describe('assertRegisterInput', () => {
  it('accepts strong password', () => {
    const result = assertRegisterInput({
      email: 'user@test.com',
      password: 'Abcdef12',
      name: '  Test  ',
    });
    expect(result.email).toBe('user@test.com');
    expect(result.name).toBe('Test');
  });

  it('rejects weak password', () => {
    expect(() =>
      assertRegisterInput({ email: 'user@test.com', password: 'weak', name: null }),
    ).toThrow(ValidationError);
  });
});
