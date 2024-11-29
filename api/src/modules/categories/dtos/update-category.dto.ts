import { PartialType } from '@nestjs/mapped-types';

import { CreateCategoryDto } from '..';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
