import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync, type ValidationError } from 'class-validator';

import { CreateBrandDto } from '../../../src/modules/fleet/dto/create-brand.dto';
import { CreateModelDto } from '../../../src/modules/fleet/dto/create-model.dto';
import { CreateVehicleDto } from '../../../src/modules/fleet/dto/create-vehicle.dto';
import { QueryVehiclesDto } from '../../../src/modules/fleet/dto/query-vehicles.dto';
import { LoginDto } from '../../../src/modules/auth/dto/login.dto';
import { RegisterDto } from '../../../src/modules/auth/dto/register.dto';

const UUID = '11111111-1111-4111-8111-111111111111';

const failingProperties = <T extends object>(
  dto: new () => T,
  payload: Record<string, unknown>,
): string[] => {
  const instance = plainToInstance(dto, payload, {
    enableImplicitConversion: true,
  });
  return validateSync(instance as object, {
    whitelist: true,
    forbidNonWhitelisted: true,
  }).map((error: ValidationError) => error.property);
};

const isValid = <T extends object>(
  dto: new () => T,
  payload: Record<string, unknown>,
): boolean => failingProperties(dto, payload).length === 0;

describe('DTO validation', () => {
  describe('CreateBrandDto', () => {
    it('accepts a non-empty name', () => {
      expect(isValid(CreateBrandDto, { name: 'Aivacol' })).toBe(true);
    });

    it('rejects an empty name', () => {
      expect(failingProperties(CreateBrandDto, { name: '' })).toContain('name');
    });

    it('rejects a missing name', () => {
      expect(failingProperties(CreateBrandDto, {})).toContain('name');
    });
  });

  describe('CreateModelDto', () => {
    it('accepts a name without a brand', () => {
      expect(isValid(CreateModelDto, { name: 'MegaBus Horizon' })).toBe(true);
    });

    it('accepts a name with a valid brand UUID', () => {
      expect(isValid(CreateModelDto, { name: 'Urban LX', brandId: UUID })).toBe(
        true,
      );
    });

    it('rejects a non-UUID brand', () => {
      expect(
        failingProperties(CreateModelDto, { name: 'Urban LX', brandId: 'x' }),
      ).toContain('brandId');
    });

    it('rejects an empty name', () => {
      expect(failingProperties(CreateModelDto, { name: '' })).toContain('name');
    });
  });

  describe('CreateVehicleDto', () => {
    const valid = {
      licensePlate: 'BRA1A23',
      chassis: '9BG116GW04C400001',
      renavam: '12345678901',
      year: 2024,
      modelId: UUID,
    };

    it('accepts a well-formed payload', () => {
      expect(isValid(CreateVehicleDto, valid)).toBe(true);
    });

    it('rejects a license plate outside the Mercosul pattern', () => {
      expect(
        failingProperties(CreateVehicleDto, { ...valid, licensePlate: '123' }),
      ).toContain('licensePlate');
    });

    it('rejects a year below the allowed range', () => {
      expect(
        failingProperties(CreateVehicleDto, { ...valid, year: 1800 }),
      ).toContain('year');
    });

    it('rejects a non-UUID modelId', () => {
      expect(
        failingProperties(CreateVehicleDto, { ...valid, modelId: 'nope' }),
      ).toContain('modelId');
    });
  });

  describe('QueryVehiclesDto', () => {
    it('accepts an empty query (all fields optional)', () => {
      expect(isValid(QueryVehiclesDto, {})).toBe(true);
    });

    it('accepts pagination and filter values', () => {
      expect(
        isValid(QueryVehiclesDto, {
          licensePlate: 'BRA',
          modelId: UUID,
          brandId: UUID,
          page: 2,
          limit: 50,
        }),
      ).toBe(true);
    });

    it('rejects a limit above the maximum', () => {
      expect(failingProperties(QueryVehiclesDto, { limit: 500 })).toContain(
        'limit',
      );
    });

    it('rejects a page below the minimum', () => {
      expect(failingProperties(QueryVehiclesDto, { page: 0 })).toContain(
        'page',
      );
    });
  });

  describe('LoginDto', () => {
    it('accepts an identifier and password', () => {
      expect(
        isValid(LoginDto, { identifier: 'aivacol', password: 'secret' }),
      ).toBe(true);
    });

    it('rejects a missing password', () => {
      expect(failingProperties(LoginDto, { identifier: 'aivacol' })).toContain(
        'password',
      );
    });
  });

  describe('RegisterDto', () => {
    const valid = {
      nickname: 'joliveira',
      name: 'João Oliveira',
      email: 'joao.oliveira@fleetcore.local',
      password: 'Fleetcore123!',
    };

    it('accepts a strong password and valid fields', () => {
      expect(isValid(RegisterDto, valid)).toBe(true);
    });

    it('rejects a weak password', () => {
      expect(
        failingProperties(RegisterDto, { ...valid, password: 'weak' }),
      ).toContain('password');
    });

    it('rejects an invalid email', () => {
      expect(
        failingProperties(RegisterDto, { ...valid, email: 'not-an-email' }),
      ).toContain('email');
    });

    it('rejects a short nickname', () => {
      expect(
        failingProperties(RegisterDto, { ...valid, nickname: 'ab' }),
      ).toContain('nickname');
    });
  });
});
