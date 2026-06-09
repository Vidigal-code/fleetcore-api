'use client';

import axios, { AxiosHeaders } from 'axios';

import { appConfig } from '@/shared/config/env';
import { sessionStorage } from '@/shared/lib/token-storage';

export const httpClient = axios.create({
  baseURL: appConfig.apiUrl,
  headers: AxiosHeaders.from({
    'Content-Type': 'application/json',
  }),
});

httpClient.interceptors.request.use((config) => {
  const token = sessionStorage.getToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers ?? {});
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && typeof window !== 'undefined') {
      sessionStorage.clearSession();
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  },
);
