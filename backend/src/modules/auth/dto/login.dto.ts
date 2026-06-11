import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Apelido ou e-mail do usuário. / User nickname or email.',
    example: 'aivacol',
  })
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @ApiProperty({
    description: 'Senha do usuário. / User password.',
    example: 'aivacol123!',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
