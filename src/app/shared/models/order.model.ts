import { BaseEntity } from './base.model';
import { OrderItem } from './order-item.model';

export class OrderModel implements BaseEntity {
  id?: string;
  uid?: string;
  userId?: string;
  orderDate?: any;
  totalPrice?: number;
  orderItems?: Array<OrderItem> = new Array<OrderItem>();
  restaurantId?: string;
  bookingId?: string;
  isPaid = false;
  isPaymentNotified = false;
}
