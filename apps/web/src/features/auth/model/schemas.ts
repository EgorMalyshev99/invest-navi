import { isPasswordAcceptableForRegistration, PASSWORD_MIN_LENGTH } from '@repo/api';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'passwordRequired'),
});

export const registerStep1Schema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, 'minPassword')
      .refine(isPasswordAcceptableForRegistration, 'passwordTooWeak'),
    passwordConfirm: z.string().min(1, 'passwordConfirmRequired'),
    name: z.string().max(120).optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'passwordMismatch',
    path: ['passwordConfirm'],
  });

export const knowledgeLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterStep1FormValues = z.infer<typeof registerStep1Schema>;
export type KnowledgeLevelValue = z.infer<typeof knowledgeLevelSchema>;
