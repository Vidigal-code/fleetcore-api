'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { appConfig } from '@/shared/config/env';
import { ThemeProvider } from '@/processes/app/providers/theme-provider';
import { store } from '@/processes/app/store/store';
import { AuthHydrator } from '@/processes/auth/ui/auth-hydrator';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: appConfig.cacheTtlSeconds * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
    [],
  );

  return (
    <ThemeProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthHydrator />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
};
