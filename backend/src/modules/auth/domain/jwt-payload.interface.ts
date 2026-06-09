import { UserRole } from '../../users/domain/user-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  nickname: string;
}
