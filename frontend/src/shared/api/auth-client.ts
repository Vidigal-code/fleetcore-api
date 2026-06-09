import { httpClient } from '@/shared/api/http-client';
import type { UserRole } from '@/entities/user/model/types';

export interface RegisterInput {
  nickname: string;
  name: string;
  email: string;
  password: string;
}

export interface RegisteredUser {
  id: string;
  nickname: string;
  name: string;
  email: string;
  roles: UserRole[];
}

export interface UpdatePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  name: string;
  nickname: string;
  email?: string;
}

export const authClient = {
  async register(input: RegisterInput): Promise<RegisteredUser> {
    const { data } = await httpClient.post('/auth/register', input);
    return data as RegisteredUser;
  },
  async logout(): Promise<void> {
    await httpClient.post('/auth/logout');
  },
  async updatePassword(input: UpdatePasswordInput): Promise<void> {
    await httpClient.post('/auth/update/password', input);
  },
  async updateProfile(input: UpdateProfileInput): Promise<RegisteredUser> {
    const { data } = await httpClient.post('/auth/update/profile', input);
    return data as RegisteredUser;
  },
};
