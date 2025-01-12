export class CreateOrderDto {
  userId: string;
  total: number;
  receiptUrl: string;
  items: {
    productId: string;
    quantity: number;
    subtotal: number;
  }[];
}
