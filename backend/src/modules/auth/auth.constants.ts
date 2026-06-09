export const AUTH_SESSION_NAMESPACE = 'auth.sessions';

export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/u;

export const STRONG_PASSWORD_MESSAGE =
  'Password must contain at least 12 characters, including uppercase, lowercase, number, and symbol.';
