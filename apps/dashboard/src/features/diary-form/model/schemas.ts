import { z } from 'zod';

export const diaryActionSchema = z.enum(['observe', 'buy', 'sell', 'hold']);
export const diaryHorizonSchema = z.enum(['1m', '3m', '1y', 'long']);

export const diaryEntryFormSchema = z.object({
  assetSymbol: z
    .string()
    .trim()
    .min(1, 'required')
    .max(32)
    .transform((value) => value.toUpperCase()),
  action: diaryActionSchema,
  horizon: diaryHorizonSchema,
  rationale: z.string().max(4000).optional(),
  risks: z.string().max(4000).optional(),
  successCriteria: z.string().max(4000).optional(),
  failureCriteria: z.string().max(4000).optional(),
  confidence: z.number().int().min(1).max(10).optional(),
});

export type DiaryEntryFormValues = z.infer<typeof diaryEntryFormSchema>;
