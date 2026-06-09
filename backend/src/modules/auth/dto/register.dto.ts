import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_REGEX,
} from '../auth.constants';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  nickname!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @Matches(STRONG_PASSWORD_REGEX, {
    message: STRONG_PASSWORD_MESSAGE,
  })
  password!: string;
}
