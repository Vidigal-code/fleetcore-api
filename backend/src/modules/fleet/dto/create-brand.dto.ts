import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Nome da marca. / Brand name.',
    example: 'Aivacol',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
