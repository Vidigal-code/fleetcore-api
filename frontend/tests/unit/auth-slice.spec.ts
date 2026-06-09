import { authActions, authReducer, type AuthState } from '@/processes/auth/model/auth-slice';
import type { AuthUser } from '@/entities/user/model/types';

const sampleUser: AuthUser = {
  id: 'user-1',
  nickname: 'aivacol',
  name: 'Aivacol Admin',
  email: 'aivacol@fleetcore.local',
  roles: ['admin'],
};

describe('auth slice', () => {
  it('hydrates session from storage', () => {
    const initialState = undefined;
    const hydrated = authReducer(initialState as unknown as AuthState, authActions.hydrate({
      token: 'token-123',
      user: sampleUser,
    }));

    expect(hydrated.hydrated).toBe(true);
    expect(hydrated.status).toBe('authenticated');
    expect(hydrated.accessToken).toBe('token-123');
    expect(hydrated.user?.email).toBe(sampleUser.email);
  });

  it('stores token on login success', () => {
    const state = authReducer(undefined as unknown as AuthState, authActions.loginSucceeded({
      token: 'abc',
      user: sampleUser,
    }));

    expect(state.status).toBe('authenticated');
    expect(state.accessToken).toBe('abc');
    expect(state.user?.nickname).toBe(sampleUser.nickname);
  });

  it('resets session on logout', () => {
    const authedState = authReducer(undefined as unknown as AuthState, authActions.loginSucceeded({
      token: 'abc',
      user: sampleUser,
    }));

    const loggedOut = authReducer(authedState, authActions.loggedOut());

    expect(loggedOut.status).toBe('idle');
    expect(loggedOut.accessToken).toBeNull();
    expect(loggedOut.user).toBeNull();
  });
});
