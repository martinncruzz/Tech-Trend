export interface ShoppingCart {
  shopping_cart_id: string;
  total: number;
  user_id: string;
  createdAt: Date;
  updatedAt: Date | null;
}
