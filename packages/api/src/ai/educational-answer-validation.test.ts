import { describe, expect, it } from 'vitest';

import { ValidationError } from '../auth/input-validation.js';

import { assertEducationalQuestionInput } from './educational-answer-validation.js';

describe('assertEducationalQuestionInput', () => {
  it('trims and defaults locale to ru', () => {
    expect(assertEducationalQuestionInput('  Что такое ETF?  ')).toEqual({
      question: 'Что такое ETF?',
      locale: 'ru',
    });
  });

  it('supports en locale', () => {
    expect(assertEducationalQuestionInput('What is a bond?', 'en')).toEqual({
      question: 'What is a bond?',
      locale: 'en',
    });
  });

  it('rejects too short questions', () => {
    expect(() => assertEducationalQuestionInput('ab')).toThrow(ValidationError);
  });
});
