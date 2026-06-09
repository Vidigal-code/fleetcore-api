import { Injectable, PipeTransform } from '@nestjs/common';

type Sanitizable =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null
  | undefined;

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const removeControlCharacters = (input: string): string => {
  let sanitized = '';
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const code = char.charCodeAt(0);
    const isForbidden =
      (code >= 0 && code <= 9) ||
      code === 11 ||
      code === 12 ||
      (code >= 14 && code <= 31) ||
      code === 127;

    if (isForbidden) {
      continue;
    }
    sanitized += char;
  }
  return sanitized;
};

const sanitize = (value: unknown): Sanitizable => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const withoutControl = removeControlCharacters(trimmed);
    return escapeHtml(withoutControl);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce<Record<string, unknown>>(
      (accumulator, [key, entry]) => {
        accumulator[key] = sanitize(entry);
        return accumulator;
      },
      {},
    );
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    typeof value === 'undefined'
  ) {
    return value;
  }

  return undefined;
};

@Injectable()
export class SanitizeInputPipe implements PipeTransform {
  transform(value: unknown) {
    return sanitize(value);
  }
}
