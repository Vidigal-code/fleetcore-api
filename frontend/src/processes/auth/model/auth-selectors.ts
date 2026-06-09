import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/processes/app/store/store';

const selectAuthState = (state: RootState) => state.auth;

export const selectIsHydrated = createSelector(selectAuthState, (state) => state.hydrated);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.status === 'authenticated' && Boolean(state.accessToken),
);

export const selectCurrentUser = createSelector(selectAuthState, (state) => state.user);

export const selectAuthStatus = createSelector(selectAuthState, (state) => state.status);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
