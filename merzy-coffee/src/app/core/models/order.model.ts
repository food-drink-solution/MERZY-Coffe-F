import { CartItem } from './cart.model';

export type OrderStatus = 'received' | 'preparing' | 'ready';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}
