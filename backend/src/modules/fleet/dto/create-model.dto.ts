import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateModelDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;
}
