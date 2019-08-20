import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { RestaurantBooking } from '../models/booking.model';
import { map } from 'rxjs/operators';

const BOOKING_ENTITYNAME = 'restaurantBooking';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(public fireBaseService: FirebaseService) {}

  gets() {
    this.fireBaseService.setPath(BOOKING_ENTITYNAME);
    return this.fireBaseService
      .gets<RestaurantBooking>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.map(entity => {
            const data = entity.payload.doc.data() as RestaurantBooking;
            data.uid = entity.payload.doc.id;
            return data;
          });
        })
      );
  }
  add(booking: RestaurantBooking) {
    this.fireBaseService.setPath(BOOKING_ENTITYNAME);
    return this.fireBaseService.add(booking);
  }

  update(booking: RestaurantBooking) {
    this.fireBaseService.setPath(BOOKING_ENTITYNAME);
    return this.fireBaseService.update(booking, booking.uid);
  }

  delete(uid: string) {
    this.fireBaseService.setPath(BOOKING_ENTITYNAME);
    return this.fireBaseService.delete(uid);
  }
}
