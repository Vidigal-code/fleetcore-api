import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthUser } from '@/entities/user/model/types';

export interface AuthState {
  status: 'idle' | 'authenticating' | 'authenticated' | 'error';
  accessToken: string | null;
  user: AuthUser | null;
  error: string | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  status: 'idle',
  accessToken: null,
  user: null,
  error: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<{ token: string | null; user: AuthUser | null } | undefined>) {
      if (action.payload?.token && action.payload.user) {
        state.accessToken = action.payload.token;
        state.user = action.payload.user;
        state.status = 'authenticated';
      }
      state.hydrated = true;
    },
    loginRequested(state) {
      state.status = 'authenticating';
      state.error = null;
    },
    loginSucceeded(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.status = 'authenticated';
      state.error = null;
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
      state.accessToken = null;
      state.user = null;
    },
    loggedOut(state) {
      state.status = 'idle';
      state.accessToken = null;
      state.user = null;
      state.error = null;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
