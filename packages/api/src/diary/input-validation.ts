import { ValidationError } from '../auth/input-validation.js';
import {
  DIARY_ACTIONS,
  DIARY_HORIZONS,
  DIARY_STATUSES,
  MAX_CONFIDENCE,
  MAX_SYMBOL_LENGTH,
  MAX_TEXT_LENGTH,
  MIN_CONFIDENCE,
} from '../validation/constants.js';

const diaryActions = new Set<string>(DIARY_ACTIONS);
const diaryHorizons = new Set<string>(DIARY_HORIZONS);
const diaryStatuses = new Set<string>(DIARY_STATUSES);

export function normalizeAssetSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

export function assertAssetSymbol(symbol: string): string {
  const normalized = normalizeAssetSymbol(symbol);
  if (!normalized || normalized.length > MAX_SYMBOL_LENGTH) {
    throw new ValidationError('Invalid asset symbol');
  }
  return normalized;
}

function assertOptionalText(value: string | null | undefined, field: string): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length > MAX_TEXT_LENGTH) {
    throw new ValidationError(`${field} must be at most ${MAX_TEXT_LENGTH} characters`);
  }
  return trimmed || null;
}

export interface CreateDiaryEntryFields {
  assetSymbol: string;
  action: string;
  horizon: string;
  rationale?: string | null;
  risks?: string | null;
  successCriteria?: string | null;
  failureCriteria?: string | null;
  confidence?: number | null;
}

export function assertCreateDiaryEntryInput(input: CreateDiaryEntryFields): {
  assetSymbol: string;
  action: 'observe' | 'buy' | 'sell' | 'hold';
  horizon: '1m' | '3m' | '1y' | 'long';
  rationale: string | null;
  risks: string | null;
  successCriteria: string | null;
  failureCriteria: string | null;
  confidence: number | null;
} {
  const assetSymbol = assertAssetSymbol(input.assetSymbol);
  const action = input.action;
  if (!diaryActions.has(action)) {
    throw new ValidationError('Invalid diary action');
  }
  const horizon = input.horizon;
  if (!diaryHorizons.has(horizon)) {
    throw new ValidationError('Invalid diary horizon');
  }
  let confidence: number | null = null;
  if (input.confidence !== undefined && input.confidence !== null) {
    if (
      !Number.isInteger(input.confidence) ||
      input.confidence < MIN_CONFIDENCE ||
      input.confidence > MAX_CONFIDENCE
    ) {
      throw new ValidationError(
        `Confidence must be between ${MIN_CONFIDENCE} and ${MAX_CONFIDENCE}`,
      );
    }
    confidence = input.confidence;
  }

  return {
    assetSymbol,
    action: action as 'observe' | 'buy' | 'sell' | 'hold',
    horizon: horizon as '1m' | '3m' | '1y' | 'long',
    rationale: assertOptionalText(input.rationale, 'Rationale'),
    risks: assertOptionalText(input.risks, 'Risks'),
    successCriteria: assertOptionalText(input.successCriteria, 'Success criteria'),
    failureCriteria: assertOptionalText(input.failureCriteria, 'Failure criteria'),
    confidence,
  };
}

export interface UpdateDiaryEntryFields {
  action?: string;
  horizon?: string;
  rationale?: string | null;
  risks?: string | null;
  successCriteria?: string | null;
  failureCriteria?: string | null;
  confidence?: number | null;
  status?: string;
}

export function assertUpdateDiaryEntryInput(input: UpdateDiaryEntryFields): Partial<{
  action: 'observe' | 'buy' | 'sell' | 'hold';
  horizon: '1m' | '3m' | '1y' | 'long';
  rationale: string | null;
  risks: string | null;
  successCriteria: string | null;
  failureCriteria: string | null;
  confidence: number | null;
  status: 'active' | 'completed' | 'cancelled';
}> {
  const updates: Partial<{
    action: 'observe' | 'buy' | 'sell' | 'hold';
    horizon: '1m' | '3m' | '1y' | 'long';
    rationale: string | null;
    risks: string | null;
    successCriteria: string | null;
    failureCriteria: string | null;
    confidence: number | null;
    status: 'active' | 'completed' | 'cancelled';
  }> = {};

  if (input.action !== undefined) {
    if (!diaryActions.has(input.action)) {
      throw new ValidationError('Invalid diary action');
    }
    updates.action = input.action as 'observe' | 'buy' | 'sell' | 'hold';
  }
  if (input.horizon !== undefined) {
    if (!diaryHorizons.has(input.horizon)) {
      throw new ValidationError('Invalid diary horizon');
    }
    updates.horizon = input.horizon as '1m' | '3m' | '1y' | 'long';
  }
  if (input.status !== undefined) {
    if (!diaryStatuses.has(input.status)) {
      throw new ValidationError('Invalid diary status');
    }
    updates.status = input.status as 'active' | 'completed' | 'cancelled';
  }
  if (input.rationale !== undefined) {
    updates.rationale = assertOptionalText(input.rationale, 'Rationale');
  }
  if (input.risks !== undefined) {
    updates.risks = assertOptionalText(input.risks, 'Risks');
  }
  if (input.successCriteria !== undefined) {
    updates.successCriteria = assertOptionalText(input.successCriteria, 'Success criteria');
  }
  if (input.failureCriteria !== undefined) {
    updates.failureCriteria = assertOptionalText(input.failureCriteria, 'Failure criteria');
  }
  if (input.confidence !== undefined) {
    if (input.confidence === null) {
      updates.confidence = null;
    } else if (
      !Number.isInteger(input.confidence) ||
      input.confidence < MIN_CONFIDENCE ||
      input.confidence > MAX_CONFIDENCE
    ) {
      throw new ValidationError(
        `Confidence must be between ${MIN_CONFIDENCE} and ${MAX_CONFIDENCE}`,
      );
    } else {
      updates.confidence = input.confidence;
    }
  }

  return updates;
}

export interface DiaryHypothesisFeedbackFields {
  assetSymbol: string;
  action: string;
  horizon: string;
  rationale?: string | null;
  risks?: string | null;
  successCriteria?: string | null;
  failureCriteria?: string | null;
  confidence?: number | null;
  locale?: string | null;
}

export function assertDiaryHypothesisFeedbackInput(
  input: DiaryHypothesisFeedbackFields,
): CreateDiaryEntryFields & { locale: 'ru' | 'en' } {
  const entry = assertCreateDiaryEntryInput(input);
  const locale = input.locale === 'en' ? 'en' : 'ru';
  return { ...entry, locale };
}
