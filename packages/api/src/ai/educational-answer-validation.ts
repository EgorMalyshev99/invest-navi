import { ValidationError } from '../auth/input-validation.js';

const MIN_QUESTION_LENGTH = 3;
const MAX_QUESTION_LENGTH = 1000;

export function assertEducationalQuestionInput(
  question: string,
  locale?: string | null,
): { question: string; locale: 'ru' | 'en' } {
  const trimmed = question.trim();
  if (trimmed.length < MIN_QUESTION_LENGTH) {
    throw new ValidationError(`Question must be at least ${MIN_QUESTION_LENGTH} characters`);
  }
  if (trimmed.length > MAX_QUESTION_LENGTH) {
    throw new ValidationError(`Question must be at most ${MAX_QUESTION_LENGTH} characters`);
  }

  return {
    question: trimmed,
    locale: locale === 'en' ? 'en' : 'ru',
  };
}
