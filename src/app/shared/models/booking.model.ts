import { BaseEntity } from './base.model';

export class RestaurantBooking implements BaseEntity {
  uid?: string;
  restaurantId: string;
  restaurantName: string;
  bookingFrom: any;
  bookingTo: any;
  isClosed: boolean;
  isPreBooking: boolean;
}
