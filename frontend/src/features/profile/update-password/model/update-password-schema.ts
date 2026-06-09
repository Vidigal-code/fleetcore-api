import { z } from 'zod';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/u;

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Informe a senha atual'),
    newPassword: z
      .string()
      .regex(STRONG_PASSWORD_REGEX, 'Password must contain at least 12 characters, including uppercase, lowercase, number, and symbol.'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
