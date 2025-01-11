import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { buildBaseUrl } from '@modules/shared/helpers/base-url.builder';
import { buildPagination } from '@modules/shared/helpers/pagination.builder';
import { CartsService } from '@modules/carts/carts.service';
import { CategoriesService } from '@modules/categories/categories.service';
import { CreateProductDto } from '@modules/products/dtos/create-product.dto';
import { OrdersService } from '@modules/orders/orders.service';
import { Product } from '@modules/products/entities/product.entity';
import { ProductFiltersDto } from '@modules/products/dtos/product-filters.dto';
import { ProductsRepository } from '@modules/products/repositories/products.repository';
import { ResourceType } from '@modules/shared/interfaces/enums';
import { UpdateProductDto } from '@modules/products/dtos/update-product.dto';
import { UploaderService } from '@modules/shared/services/uploader/uploader.service';
import { buildFiltersQuery } from '@modules/shared/helpers/filters-query.builder';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly uploaderService: UploaderService,
    private readonly ordersService: OrdersService,

    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,

    @Inject(forwardRef(() => CartsService))
    private readonly cartsService: CartsService,
  ) {}

  async getProducts(
    productFiltersDto: ProductFiltersDto,
  ): Promise<{ prev: string | null; next: string | null; products: Product[] }> {
    const { total, products } = await this.productsRepository.findAll(productFiltersDto);

    const filtersQuery = buildFiltersQuery(productFiltersDto);
    const baseUrl = buildBaseUrl(ResourceType.PRODUCTS);
    const { prev, next } = buildPagination(productFiltersDto, total, baseUrl, filtersQuery);

    return { prev, next, products };
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) throw new NotFoundException(`Product with id "${id}" not found`);

    return product;
  }

  async createProduct(createProductDto: CreateProductDto, file: Express.Multer.File): Promise<Product> {
    await this.categoriesService.getCategoryById(createProductDto.categoryId);

    const productExists = await this.productsRepository.findByName(createProductDto.name);
    if (productExists) throw new BadRequestException(`Product with name "${createProductDto.name}" already exists`);

    const { public_id, secure_url } = await this.uploaderService.uploadFile(file);

    createProductDto.imageId = public_id;
    createProductDto.imageUrl = secure_url;

    return this.productsRepository.create(createProductDto);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
    const product = await this.getProductById(id);

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const productExists = await this.productsRepository.findByName(updateProductDto.name);
      if (productExists) throw new BadRequestException(`Product with name "${updateProductDto.name}" already exists`);
    }

    if (file) {
      const { public_id, secure_url } = await this.uploaderService.updateFile(file, product.imageId);
      updateProductDto.imageId = public_id;
      updateProductDto.imageUrl = secure_url;
    }

    return this.productsRepository.update(id, updateProductDto);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const product = await this.getProductById(id);

    await Promise.all([
      this.cartsService.deleteCartItemsByProductId(id),
      this.ordersService.deleteOrderItemsByProductId(id),
      this.uploaderService.deleteFile(product.imageId),
    ]);

    return this.productsRepository.delete(id);
  }
}
