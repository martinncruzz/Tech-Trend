export interface GetShoppingCartResponse {
  shopping_cart_id: string;
  total: number;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  products: ProductItem[];
}

export interface ProductItem {
  shopping_cart_id: string;
  product_id: string;
  quantity: number;
  subtotal: number;
  product: Product;
}

export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  image_url: string;
  image_id: string;
  createdAt: Date;
  updatedAt: Date | null;
}
