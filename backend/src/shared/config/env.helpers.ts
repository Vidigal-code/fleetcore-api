export const parseBoolean = (
  value: string | undefined,
  defaultValue = false,
): boolean => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'on', 'yes'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'off', 'no'].includes(normalized)) {
    return false;
  }

  return defaultValue;
};

export const parseNumber = (
  value: string | undefined,
  defaultValue: number,
): number => {
  if (!value) {
    return defaultValue;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

export const parseStringArray = (
  value: string | undefined,
  defaultValue: string[] = [],
): string[] => {
  if (!value) {
    return defaultValue;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};
