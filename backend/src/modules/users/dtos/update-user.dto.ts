import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(5)
  @IsOptional()
  fullname?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  address?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  email?: string;
}
