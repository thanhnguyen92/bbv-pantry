import { BaseEntity } from './base.model';

export class BookingModel implements BaseEntity {
  id?: string;
  uid?: string;
  bookingFrom?: any;
  bookingTo?: any;
  isClosed?: boolean;
  isPreBooking?: boolean;
  restaurantId?: string;
}
