import { BaseEntity } from './base.model';

export class BookingModel implements BaseEntity {
  uid?: string;
  bookingFrom?: Date;
  bookingTo?: Date;
  isClosed = false;
  isPreBooking = false;
  restaurantId?: string;
}
