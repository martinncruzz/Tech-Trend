import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Product } from '../../../../core/interfaces/products';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Category } from '../../../../core/interfaces/categories';

@Component({
  selector: 'products-products-list',
  standalone: true,
  imports: [RouterModule, ProductCardComponent],
  templateUrl: './products-list.component.html',
  styles: ``,
})
export class ProductsListComponent {
  public products = signal<Product[]>([
    {
      product_id: 'abc',
      name: 'Mechanical Gaming Keyboard',
      description:
        'RGB backlit mechanical keyboard with customizable keys and durable switches.',
      price: 99.99,
      stock: 50,
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      name: 'UltraWide Gaming Monitor',
      description:
        '34-inch curved ultrawide monitor with 144Hz refresh rate and 1ms response time.',
      price: 499.99,
      stock: 30,
      product_id: '',
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      name: 'Gaming Laptop',
      description:
        'High-performance gaming laptop with Intel i7 processor, 16GB RAM, and NVIDIA RTX 3070.',
      price: 1499.99,
      stock: 20,
      product_id: '',
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      name: 'Gaming Mouse',
      description:
        'Ergonomic gaming mouse with 16000 DPI sensor and customizable RGB lighting.',
      price: 59.99,
      stock: 100,
      product_id: '',
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      name: 'Gaming Headset',
      description:
        'Surround sound gaming headset with noise-cancelling microphone and comfortable ear pads.',
      price: 79.99,
      stock: 75,
      product_id: '',
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      name: 'Gaming Chair',
      description:
        'Ergonomic gaming chair with lumbar support and adjustable armrests.',
      price: 199.99,
      stock: 40,
      product_id: '',
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      name: 'Gaming Desk',
      description:
        'Spacious gaming desk with cable management and RGB lighting.',
      price: 299.99,
      stock: 15,
      product_id: '',
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      name: 'Gaming Controller',
      description:
        'Wireless gaming controller compatible with PC and consoles.',
      price: 49.99,
      stock: 60,
      product_id: '',
      createdAt: new Date(),
      updatedAt: null,
    },
    {
      product_id: '',
      name: 'External Gaming Hard Drive',
      description:
        '2TB external hard drive optimized for gaming with fast read/write speeds.',
      price: 129.99,
      stock: 45,
      createdAt: new Date(),
      updatedAt: null,
    },
  ]);

  public categories = signal<Category[]>([
    { name: 'Keyboards' },
    { name: 'Monitors' },
    { name: 'Laptops' },
    { name: 'Mice' },
    { name: 'Headsets' },
    { name: 'Accesories' },
  ]);
}
