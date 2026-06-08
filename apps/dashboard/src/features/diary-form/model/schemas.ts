import {
  DIARY_ACTIONS,
  DIARY_HORIZONS,
  MAX_CONFIDENCE,
  MAX_SYMBOL_LENGTH,
  MAX_TEXT_LENGTH,
  MIN_CONFIDENCE,
} from '@repo/api/validation/constants';
import { z } from 'zod';

export const diaryActionSchema = z.enum(DIARY_ACTIONS);
export const diaryHorizonSchema = z.enum(DIARY_HORIZONS);

export const diaryEntryFormSchema = z.object({
  assetSymbol: z
    .string()
    .trim()
    .min(1, 'required')
    .max(MAX_SYMBOL_LENGTH)
    .transform((value) => value.toUpperCase()),
  action: diaryActionSchema,
  horizon: diaryHorizonSchema,
  rationale: z.string().max(MAX_TEXT_LENGTH).optional(),
  risks: z.string().max(MAX_TEXT_LENGTH).optional(),
  successCriteria: z.string().max(MAX_TEXT_LENGTH).optional(),
  failureCriteria: z.string().max(MAX_TEXT_LENGTH).optional(),
  confidence: z.number().int().min(MIN_CONFIDENCE).max(MAX_CONFIDENCE).optional(),
});

export type DiaryEntryFormValues = z.infer<typeof diaryEntryFormSchema>;
