import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Product } from '../../../../core/interfaces/products';
import { RouterModule } from '@angular/router';
import { ShoppingCartForm } from '../../../../core/interfaces/shopping-carts';

@Component({
  selector: 'products-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styles: ``,
})
export class ProductCardComponent {
  public product = input.required<Product>();
  public productsInCart = input.required<string[]>();
  public processing = input.required<boolean>();

  public cartUpdate = output<ShoppingCartForm>();

  public updateShoppingCart(quantity: number): void {
    this.cartUpdate.emit({ product_id: this.product().product_id, quantity });
  }
}
