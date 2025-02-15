import { PartialType } from '@nestjs/mapped-types';

import { CreateProductDto } from '../../../modules/products/dtos/create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
