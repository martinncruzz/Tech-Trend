import { IsEnum, IsOptional, IsString, MinLength, Validate } from 'class-validator';

import { PaginationDto } from '../../../modules/shared/dtos/pagination.dto';
import { SortByOrderConstraint } from '../../../config/constraints/sort-by-order.constraint';
import { UserRoles } from '../../../modules/shared/interfaces/enums';

export class UserFiltersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  fullname?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  email?: string;

  @IsOptional()
  @IsEnum(UserRoles)
  roles?: UserRoles;

  @IsOptional()
  @IsEnum(['fullname', 'email', 'createdAt', 'updatedAt'])
  @Validate(SortByOrderConstraint)
  sortBy?: 'fullname' | 'email' | 'createdAt' | 'updatedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Validate(SortByOrderConstraint)
  order?: 'asc' | 'desc';
}
