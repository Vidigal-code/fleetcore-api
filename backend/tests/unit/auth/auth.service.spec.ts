import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthService } from '../../../src/modules/auth/application/auth.service';
import { AuthSessionService } from '../../../src/modules/auth/application/auth-session.service';
import { LoginDto } from '../../../src/modules/auth/dto/login.dto';
import { RegisterDto } from '../../../src/modules/auth/dto/register.dto';
import { JwtPayload } from '../../../src/modules/auth/domain/jwt-payload.interface';
import {
  UsersService,
  type CreateUserInput,
} from '../../../src/modules/users/application/users.service';
import { User } from '../../../src/modules/users/domain/user.aggregate';
import { UserRole } from '../../../src/modules/users/domain/user-role.enum';

const createUserAggregate = async () => {
  const passwordHash = await bcrypt.hash('Test12345678@', 10);
  return User.create({
    nickname: 'tester',
    name: 'Tester',
    email: 'tester@example.com',
    passwordHash,
    roles: [UserRole.Operator],
    createdBy: 'system',
  });
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let sessionService: jest.Mocked<AuthSessionService>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      findByNickname: jest.fn(),
      createUser: jest.fn(),
      ensureAdminSeed: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    jwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    sessionService = {
      generateSessionId: jest.fn(),
      store: jest.fn(),
      revoke: jest.fn(),
      isActive: jest.fn(),
    } as unknown as jest.Mocked<AuthSessionService>;

    service = new AuthService(
      usersService,
      jwtService,
      configService,
      sessionService,
    );
  });

  it('authenticates and generates a session on login', async () => {
    const user = await createUserAggregate();
    usersService.findByEmail.mockResolvedValue(user);
    sessionService.generateSessionId.mockReturnValue('session-123');
    jwtService.signAsync.mockResolvedValue('token-xyz');
    configService.get.mockImplementation(
      (key: string, defaultValue: unknown) => {
        if (key === 'jwt.expiresIn') {
          return '3600s';
        }
        return defaultValue;
      },
    );

    const credentials: LoginDto = {
      identifier: 'tester@example.com',
      password: 'Test12345678@',
    };

    const result = await service.login(credentials);

    expect(result.accessToken).toBe('token-xyz');
    expect(result.tokenType).toBe('Bearer');
    expect(result.user.email).toBe('tester@example.com');

    const storeCalls = sessionService.store.mock.calls as Array<
      [string, string]
    >;
    expect(storeCalls[0]).toEqual(['session-123', user.id]);

    const signCalls = jwtService.signAsync.mock.calls as Array<
      [JwtPayload, { jwtid?: string } | undefined]
    >;
    const [payload, options] = signCalls[0];
    expect(payload.sessionId).toBe('session-123');
    expect(options?.jwtid).toBe('session-123');
  });

  it('registers a new operator with strong password', async () => {
    const created = await createUserAggregate();
    usersService.createUser.mockResolvedValue(created);

    const input: RegisterDto = {
      nickname: 'tester',
      name: 'Tester',
      email: 'tester@example.com',
      password: 'Test12345678@',
    };

    const result = await service.register(input);

    const createCalls = usersService.createUser.mock.calls as Array<
      [CreateUserInput]
    >;
    const [payload] = createCalls[0];

    expect(payload.nickname).toBe('tester');
    expect(payload.roles).toEqual([UserRole.Operator]);
    expect(payload.createdBy).toBe('tester');
    expect(result.email).toBe(created.email);
  });

  it('revokes session on logout', async () => {
    await service.logout('session-789');

    const revokeCalls = sessionService.revoke.mock.calls as Array<[string]>;
    expect(revokeCalls[0]).toEqual(['session-789']);
  });
});
