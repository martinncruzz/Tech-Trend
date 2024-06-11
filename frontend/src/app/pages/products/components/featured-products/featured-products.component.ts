import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Product {
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'products-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-products.component.html',
  styles: ``,
})
export class FeaturedProductsComponent {
  public products = signal<Product[]>([
    {
      name: 'Gaming Laptop',
      description: 'High-performance laptop for gaming',
      price: 1499,
    },
    {
      name: 'Mechanical Keyboard',
      description:
        'Tactile and responsive keyboard which you need in your setup',
      price: 99,
    },
    {
      name: 'Wireless Mouse',
      description: 'Precise and comfortable mouse maded for you',
      price: 49,
    },
    {
      name: 'Gaming Headset',
      description: 'Immersive audio experience for gaming and music production',
      price: 79,
    },
  ]);
}
