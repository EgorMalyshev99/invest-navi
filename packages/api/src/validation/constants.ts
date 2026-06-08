export const MAX_SYMBOL_LENGTH = 32;
export const MAX_TEXT_LENGTH = 4000;
export const MIN_CONFIDENCE = 1;
export const MAX_CONFIDENCE = 10;

export const DIARY_ACTIONS = ['observe', 'buy', 'sell', 'hold'] as const;
export const DIARY_HORIZONS = ['1m', '3m', '1y', 'long'] as const;
export const DIARY_STATUSES = ['active', 'completed', 'cancelled'] as const;

export type DiaryActionValue = (typeof DIARY_ACTIONS)[number];
export type DiaryHorizonValue = (typeof DIARY_HORIZONS)[number];
export type DiaryStatusValue = (typeof DIARY_STATUSES)[number];

export const MAX_GOAL_LENGTH = 4000;
export const MIN_QUANTITY = 0.000001;
export const MAX_QUANTITY = 1_000_000_000;
export const MIN_PRICE = 0.000001;
export const MAX_PRICE = 1_000_000_000;

export const ENTRY_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
