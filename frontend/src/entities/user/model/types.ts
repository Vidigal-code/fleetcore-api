export type UserRole = 'admin' | 'operator';

export interface AuthUser {
  id: string;
  nickname: string;
  name: string;
  email: string;
  roles: UserRole[];
}
