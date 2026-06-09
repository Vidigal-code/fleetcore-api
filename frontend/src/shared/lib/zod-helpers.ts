import { z } from 'zod';

export interface RequiredStringOptions {
  trim?: boolean;
}

export const requiredString = (message: string, options?: RequiredStringOptions) => {
  let schema = z.string();
  if (options?.trim) {
    schema = schema.trim();
  }
  return schema.min(1, { message });
};

export const requiredUuid = (message: string, invalidMessage: string) =>
  requiredString(message, { trim: true }).uuid(invalidMessage);

export const requiredNumber = (message: string) =>
  z.number().refine((value) => !Number.isNaN(value), { message });
