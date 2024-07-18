import { Component, input, output } from '@angular/core';
import {
  ProductItem,
  ShoppingCartForm,
} from '../../../../core/interfaces/shopping-carts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shopping-carts-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styles: ``,
})
export class CartItemComponent {
  public productItem = input.required<ProductItem>();
  public processing = input.required<boolean>();

  public newQuantity = output<ShoppingCartForm>();
  public productToRemoveFromCart = output<string>();
  public productRemovalConfirmation = output<boolean>();

  public updateProductQuantity(quantity: number): void {
    this.newQuantity.emit({
      product_id: this.productItem().product_id,
      quantity,
    });
  }

  public setProductToRemoveFromCart(productId: string): void {
    this.productToRemoveFromCart.emit(productId);
  }

  public confirmRemoval(confirm: boolean): void {
    this.productRemovalConfirmation.emit(confirm);
  }
}
