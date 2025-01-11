import { CreateProductDto } from '@modules/products/dtos/create-product.dto';
import { Product } from '@modules/products/entities/product.entity';
import { ProductFiltersDto } from '@modules/products/dtos/product-filters.dto';
import { UpdateProductDto } from '@modules/products/dtos/update-product.dto';

export abstract class ProductsRepository {
  abstract findAll(productFiltersDto: ProductFiltersDto): Promise<{ total: number; products: Product[] }>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findByName(name: string): Promise<Product | null>;
  abstract create(createProductDto: CreateProductDto): Promise<Product>;
  abstract update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
  abstract delete(id: string): Promise<boolean>;
}
