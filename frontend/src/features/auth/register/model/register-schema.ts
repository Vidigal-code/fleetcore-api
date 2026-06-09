import { z } from 'zod';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/u;

export const registerSchema = z.object({
  nickname: z
    .string()
    .min(3, 'Informe pelo menos 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  name: z
    .string()
    .min(3, 'Informe pelo menos 3 caracteres')
    .max(120, 'Máximo de 120 caracteres'),
  email: z.string().email('Informe um e-mail válido'),
  password: z
    .string()
    .regex(STRONG_PASSWORD_REGEX, 'Password must contain at least 12 characters, including uppercase, lowercase, number, and symbol.'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
