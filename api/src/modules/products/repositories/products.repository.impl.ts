import { Injectable } from '@nestjs/common';

import { CreateProductDto } from '../../../modules/products/dtos/create-product.dto';
import { PostgresDatabase } from '../../../database/postgres/postgres-database';
import { Product } from '../../../modules/products/entities/product.entity';
import { ProductFiltersDto } from '../../../modules/products/dtos/product-filters.dto';
import { ProductsRepository } from '../../../modules/products/repositories/products.repository';
import { UpdateProductDto } from '../../../modules/products/dtos/update-product.dto';

@Injectable()
export class ProductsRepositoryImpl implements ProductsRepository {
  private readonly prisma = PostgresDatabase.getClient();

  async findAll(productFiltersDto: ProductFiltersDto): Promise<{ total: number; products: Product[] }> {
    const { page, limit, name, minPrice, maxPrice, categoryId, inStock, sortBy, order } = productFiltersDto;
    const filters: Record<string, any> = {};

    if (name) filters.name = { contains: name, mode: 'insensitive' };
    if (minPrice) filters.price = { gte: minPrice };
    if (maxPrice) filters.price = { ...filters.price, lte: maxPrice };
    if (categoryId) filters.categoryId = categoryId;
    if (inStock) filters.stock = { gt: 0 };

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where: filters }),
      this.prisma.product.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: order } : undefined,
        include: { category: { select: { name: true } } },
      }),
    ]);

    return { total, products: products.map(Product.fromObject) };
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? Product.fromObject(product) : null;
  }

  async findByName(name: string): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({ where: { name } });
    return product ? Product.fromObject(product) : null;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = await this.prisma.product.create({ data: createProductDto });
    return Product.fromObject(createdProduct);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.prisma.product.update({ where: { id }, data: updateProductDto });
    return Product.fromObject(updatedProduct);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.product.delete({ where: { id } });
    return true;
  }
}
