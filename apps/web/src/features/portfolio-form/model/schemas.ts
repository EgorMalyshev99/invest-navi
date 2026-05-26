import { z } from 'zod';

export const portfolioPositionFormSchema = z.object({
  assetSymbol: z
    .string()
    .trim()
    .min(1, 'required')
    .max(32)
    .transform((value) => value.toUpperCase()),
  quantity: z.coerce.number().positive('positive'),
  entryPrice: z.coerce.number().positive('positive'),
  entryDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateFormat'),
  goal: z.string().max(4000).optional(),
});

export type PortfolioPositionFormValues = z.infer<typeof portfolioPositionFormSchema>;
