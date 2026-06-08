import {
  ENTRY_DATE_PATTERN,
  MAX_GOAL_LENGTH,
  MAX_PRICE,
  MAX_QUANTITY,
  MAX_SYMBOL_LENGTH,
  MIN_PRICE,
  MIN_QUANTITY,
} from '@repo/api/validation/constants';
import { z } from 'zod';

export const portfolioPositionFormSchema = z.object({
  assetSymbol: z
    .string()
    .trim()
    .min(1, 'required')
    .max(MAX_SYMBOL_LENGTH)
    .transform((value) => value.toUpperCase()),
  quantity: z.number().min(MIN_QUANTITY, 'positive').max(MAX_QUANTITY, 'positive'),
  entryPrice: z.number().min(MIN_PRICE, 'positive').max(MAX_PRICE, 'positive'),
  entryDate: z.string().trim().regex(ENTRY_DATE_PATTERN, 'dateFormat'),
  goal: z.string().max(MAX_GOAL_LENGTH).optional(),
});

export type PortfolioPositionFormValues = z.infer<typeof portfolioPositionFormSchema>;
