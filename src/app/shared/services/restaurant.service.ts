import { BookingModel } from 'src/app/shared/models/booking.model';
import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { RestaurantModel } from '../models/restaurant.model';
import { map } from 'rxjs/operators';
import { Utilities } from './utilities';

const RESTAURANT_ENTITY = 'restaurant';
const RESTAURANT_BOOKING_ENTITY = 'restaurantBooking';
@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  constructor(private firebaseService: FirebaseService) {}

  gets() {
    this.firebaseService.setPath(RESTAURANT_ENTITY);
    return this.firebaseService
      .gets<RestaurantModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.map(entity => {
            const data = entity.payload.doc.data() as RestaurantModel;
            data.uid = entity.payload.doc.id;
            return data;
          });
        })
      );
  }

  getByRestaurantIds(restaurantIds: string[]) {
    this.firebaseService.setPath(RESTAURANT_ENTITY);
    return this.firebaseService
      .gets<RestaurantModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              const data = entity.payload.doc.data();
              if (restaurantIds.find(uid => uid === data.uid)) {
                return entity;
              }
            })
            .map(entity => {
              const data = entity.payload.doc.data();
              data.uid = entity.payload.doc.id;
              return data;
            });
        })
      );
  }

  getByBookingDate(bookingDate) {
    this.firebaseService.setPath(RESTAURANT_BOOKING_ENTITY);
    return this.firebaseService
      .gets<BookingModel>(t => t.where('isClosed', '==', false))
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              const data = entity.payload.doc.data();
              const bookingFrom = Utilities.convertTimestampToDate(
                data.bookingFrom
              );
              const bookingTo = Utilities.convertTimestampToDate(
                data.bookingTo
              );
              if (bookingFrom <= bookingDate && bookingDate <= bookingTo) {
                return entity;
              }
            })
            .map(entity => {
              const data = entity.payload.doc.data();
              data.bookingFrom = Utilities.convertTimestampToDate(
                data.bookingFrom
              );
              data.bookingTo = Utilities.convertTimestampToDate(data.bookingTo);
              data.uid = entity.payload.doc.id;
              return data;
            });
        })
      );
  }

  add(entity: RestaurantModel) {
    this.firebaseService.setPath(RESTAURANT_ENTITY);
    entity.uid = this.firebaseService.createId();
    return this.firebaseService.add<RestaurantModel>(entity);
  }

  update(entity: RestaurantModel) {
    this.firebaseService.setPath(RESTAURANT_ENTITY);
    return this.firebaseService.update<RestaurantModel>(entity, entity.uid);
  }

  delete(uid) {
    this.firebaseService.setPath(RESTAURANT_ENTITY);
    return this.firebaseService.delete(uid);
  }
}
