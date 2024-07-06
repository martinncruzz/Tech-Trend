import { Component, OnInit, inject, signal } from '@angular/core';
import {
  GetShoppingCartResponse,
  ShoppingCartForm,
} from '../../core/interfaces/shopping-carts';
import { ShoppingCartsService } from '../../core/services';
import { CommonModule } from '@angular/common';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'shopping-carts',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './shopping-carts.component.html',
  styles: ``,
})
export class ShoppingCartsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly hotToastService = inject(HotToastService);

  private readonly shoppingCartsService = inject(ShoppingCartsService);

  public shoppingCart = signal<GetShoppingCartResponse | undefined>(undefined);
  public productToRemoveFromCart = signal<string>('');

  constructor() {}

  ngOnInit(): void {
    this.getUserShoppingCart();
  }

  public getUserShoppingCart(): void {
    this.shoppingCartsService.getUserShoppingCart().subscribe({
      next: (shoppingCart) => this.shoppingCart.set(shoppingCart),
      error: () => this.router.navigateByUrl('/'),
    });
  }

  public updateProductQuantity(shoppingCartForm: ShoppingCartForm): void {
    this.shoppingCartsService
      .updateProductQuantityInCart(shoppingCartForm)
      .subscribe({
        next: () => this.getUserShoppingCart(),
        error: (error) => console.log(error),
      });
  }

  public getProductToRemoveFromCart(productId: string): void {
    this.productToRemoveFromCart.set(productId);
  }

  public removeProductFromCart(confirm: boolean): void {
    if (confirm) {
      this.shoppingCartsService
        .removeProductFromCart(this.productToRemoveFromCart())
        .subscribe({
          next: () => {
            this.getUserShoppingCart();
            this.hotToastService.info('Product removed from cart');
          },
          error: (error) => this.hotToastService.error(error),
        });
    }
  }
}
