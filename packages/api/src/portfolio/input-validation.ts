import { ValidationError } from '../auth/input-validation.js';
import { assertAssetSymbol } from '../diary/input-validation.js';

const MAX_GOAL_LENGTH = 4000;
const MIN_QUANTITY = 0.000001;
const MAX_QUANTITY = 1_000_000_000;
const MIN_PRICE = 0.000001;
const MAX_PRICE = 1_000_000_000;

function assertPositiveNumber(value: number, field: string, min: number, max: number): number {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new ValidationError(`${field} must be between ${min} and ${max}`);
  }
  return value;
}

function assertOptionalGoal(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length > MAX_GOAL_LENGTH) {
    throw new ValidationError(`Goal must be at most ${MAX_GOAL_LENGTH} characters`);
  }
  return trimmed || null;
}

function assertEntryDate(value: string): string {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new ValidationError('Entry date must be YYYY-MM-DD');
  }
  const parsed = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError('Invalid entry date');
  }
  return trimmed;
}

export interface CreatePortfolioPositionFields {
  assetSymbol: string;
  quantity: number;
  entryPrice: number;
  entryDate: string;
  goal?: string | null;
}

export function assertCreatePortfolioPositionInput(input: CreatePortfolioPositionFields): {
  assetSymbol: string;
  quantity: number;
  entryPrice: number;
  entryDate: string;
  goal: string | null;
} {
  return {
    assetSymbol: assertAssetSymbol(input.assetSymbol),
    quantity: assertPositiveNumber(input.quantity, 'Quantity', MIN_QUANTITY, MAX_QUANTITY),
    entryPrice: assertPositiveNumber(input.entryPrice, 'Entry price', MIN_PRICE, MAX_PRICE),
    entryDate: assertEntryDate(input.entryDate),
    goal: assertOptionalGoal(input.goal),
  };
}

export interface UpdatePortfolioPositionFields {
  assetSymbol?: string;
  quantity?: number;
  entryPrice?: number;
  entryDate?: string;
  goal?: string | null;
}

export function assertUpdatePortfolioPositionInput(input: UpdatePortfolioPositionFields): Partial<{
  assetSymbol: string;
  quantity: number;
  entryPrice: number;
  entryDate: string;
  goal: string | null;
}> {
  const updates: Partial<{
    assetSymbol: string;
    quantity: number;
    entryPrice: number;
    entryDate: string;
    goal: string | null;
  }> = {};

  if (input.assetSymbol !== undefined) {
    updates.assetSymbol = assertAssetSymbol(input.assetSymbol);
  }
  if (input.quantity !== undefined) {
    updates.quantity = assertPositiveNumber(input.quantity, 'Quantity', MIN_QUANTITY, MAX_QUANTITY);
  }
  if (input.entryPrice !== undefined) {
    updates.entryPrice = assertPositiveNumber(
      input.entryPrice,
      'Entry price',
      MIN_PRICE,
      MAX_PRICE,
    );
  }
  if (input.entryDate !== undefined) {
    updates.entryDate = assertEntryDate(input.entryDate);
  }
  if (input.goal !== undefined) {
    updates.goal = assertOptionalGoal(input.goal);
  }

  return updates;
}
