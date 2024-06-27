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
