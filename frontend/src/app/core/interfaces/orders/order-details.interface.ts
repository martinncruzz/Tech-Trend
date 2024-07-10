export interface OrderDetails {
  order_id: string;
  user_id: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: null;
  products: ProductItem[];
}

export interface ProductItem {
  order_id: string;
  product_id: string;
  quantity: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date | null;
  product: Product;
}

export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  image_id: string;
  category_id: string;
  createdAt: Date;
  updatedAt: Date | null;
}
