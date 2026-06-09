import { httpClient } from '@/shared/api/http-client';

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
  roles: string[];
}

export const authClient = {
  async register(input: RegisterInput): Promise<RegisteredUser> {
    const { data } = await httpClient.post('/auth/register', input);
    return data as RegisteredUser;
  },
  async logout(): Promise<void> {
    await httpClient.post('/auth/logout');
  },
};
