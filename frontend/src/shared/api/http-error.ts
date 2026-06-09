import type { AxiosError } from 'axios';

export interface ApiErrorDetails {
  message: string;
}

export const extractErrorMessage = (error: unknown): string => {
  if ((error as AxiosError)?.isAxiosError) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return (
      axiosError.response?.data?.message ??
      axiosError.response?.data?.error ??
      axiosError.message ??
      'Algo inesperado aconteceu.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Algo inesperado aconteceu.';
};
