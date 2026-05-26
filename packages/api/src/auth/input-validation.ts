import { isPasswordAcceptableForRegistration } from './password-policy.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 120;
const MIN_PASSWORD_LENGTH = 1;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return (
    normalized.length > 0 && normalized.length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(normalized)
  );
}

export function assertValidEmail(email: string): string {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    throw new ValidationError('Invalid email address');
  }
  return normalized;
}

export interface LoginInputFields {
  email: string;
  password: string;
}

export function assertLoginInput(input: LoginInputFields): {
  email: string;
  password: string;
} {
  const email = assertValidEmail(input.email);
  const password = input.password ?? '';
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError('Password is required');
  }
  return { email, password };
}

export interface RegisterInputFields {
  email: string;
  password: string;
  name?: string | null;
}

export function assertRegisterInput(input: RegisterInputFields): {
  email: string;
  password: string;
  name: string | null;
} {
  const email = assertValidEmail(input.email);
  const password = input.password ?? '';
  if (!isPasswordAcceptableForRegistration(password)) {
    throw new ValidationError(
      'Password is too weak. Use at least 8 characters with upper and lower case letters and a digit.',
    );
  }
  const name = input.name?.trim() || null;
  if (name && name.length > MAX_NAME_LENGTH) {
    throw new ValidationError(`Name must be at most ${MAX_NAME_LENGTH} characters`);
  }
  return { email, password, name };
}

export interface UpdateProfileInputFields {
  name?: string | null;
}

export function assertUpdateProfileName(name: string | null | undefined): string | null {
  if (name === undefined || name === null) {
    return null;
  }
  const trimmed = name.trim();
  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new ValidationError(`Name must be at most ${MAX_NAME_LENGTH} characters`);
  }
  return trimmed || null;
}
