export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_LONG_LENGTH = 12;

export type PasswordRuleId = 'minLength' | 'lower' | 'upper' | 'digit' | 'long';

export type PasswordStrengthLevel = 'weak' | 'fair' | 'strong';

export interface PasswordRuleCheck {
  id: PasswordRuleId;
  met: boolean;
}

export interface PasswordStrength {
  level: PasswordStrengthLevel;
  /** 0–100 for progress UI */
  score: number;
  rules: PasswordRuleCheck[];
  metCount: number;
}

export function getPasswordRules(password: string): PasswordRuleCheck[] {
  return [
    { id: 'minLength', met: password.length >= PASSWORD_MIN_LENGTH },
    { id: 'lower', met: /[a-z]/.test(password) },
    { id: 'upper', met: /[A-Z]/.test(password) },
    { id: 'digit', met: /\d/.test(password) },
    { id: 'long', met: password.length >= PASSWORD_LONG_LENGTH },
  ];
}

export function analyzePassword(password: string): PasswordStrength {
  const rules = getPasswordRules(password);
  const metCount = rules.filter((rule) => rule.met).length;

  let level: PasswordStrengthLevel;
  if (!rules[0]?.met || metCount <= 2) {
    level = 'weak';
  } else if (metCount === rules.length) {
    level = 'strong';
  } else {
    level = 'fair';
  }

  const score = level === 'weak' ? 33 : level === 'fair' ? 66 : 100;

  return { level, score, rules, metCount };
}

/** Registration allowed for fair (yellow) and strong (green) only. */
export function isPasswordAcceptableForRegistration(password: string): boolean {
  return analyzePassword(password).level !== 'weak';
}
