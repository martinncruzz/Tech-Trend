import { CartItem } from '../../../modules/carts/entities/cart-item.entity';
import { CreateCartItemDto } from '../../../modules/carts/dtos/create-cart-item.dto';
import { UpdateCartItemDto } from '../../../modules/carts/dtos/update-cart-item.dto';

export abstract class CartItemsRepository {
  abstract findAllByProductId(productId: string): Promise<CartItem[]>;
  abstract findByCartIdAndProductId(cartId: string, productId: string): Promise<CartItem | null>;
  abstract create(createCartItemDto: CreateCartItemDto): Promise<CartItem>;
  abstract update(id: string, updateCartItemDto: UpdateCartItemDto): Promise<CartItem>;
  abstract delete(id: string): Promise<boolean>;
  abstract deleteManyByCartId(cartId: string): Promise<boolean>;
}
