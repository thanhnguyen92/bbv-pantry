import { BaseEntity } from './base.model';
import { OrderItem } from './order-item.model';

export class Order implements BaseEntity {
  uid?: string;
  customerName?: string;
  totalPrice: string;
  orderItems?: Array<OrderItem> = new Array<OrderItem>();
}
