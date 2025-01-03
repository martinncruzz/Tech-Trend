import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
