import { Cart } from '@modules/carts/entities/cart.entity';
import { CreateCartDto } from '@modules/carts/dtos/create-cart.dto';
import { UpdateCartDto } from '@modules/carts/dtos/update-cart.dto';

export abstract class CartsRepository {
  abstract findById(id: string): Promise<Cart | null>;
  abstract findByUserId(userId: string): Promise<Cart | null>;
  abstract create(createCartDto: CreateCartDto): Promise<Cart>;
  abstract update(id: string, updateCartDto: UpdateCartDto): Promise<Cart>;
  abstract deleteByUserId(userId: string): Promise<boolean>;
}
