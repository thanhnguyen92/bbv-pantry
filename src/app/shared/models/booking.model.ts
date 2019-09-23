import { BaseEntity } from './base.model';

export class BookingModel implements BaseEntity {
  uid?: string;
  bookingFrom?: any;
  bookingTo?: any;
  isClosed?: boolean;
  isPreBooking?: boolean;
  restaurantId?: string;
}
