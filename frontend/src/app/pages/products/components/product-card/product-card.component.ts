import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Product } from '../../../../core/interfaces/products';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'products-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styles: ``,
})
export class ProductCardComponent {
  public product = input.required<Product>();
}
