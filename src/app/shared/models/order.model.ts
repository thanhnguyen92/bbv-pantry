import { BaseEntity } from './base.model';
import { OrderItem } from './order-item.model';

export class Order implements BaseEntity {
  uid?: string;
  userId?: string;
  orderDate?: any;
  totalPrice?: number;
  orderItems?: Array<OrderItem> = new Array<OrderItem>();
  isPaid = false;
}
