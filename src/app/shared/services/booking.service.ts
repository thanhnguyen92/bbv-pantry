import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { BookingModel } from '../models/booking.model';
import { map } from 'rxjs/operators';
import { Utilities } from './utilities';

const ENTITY_NAME = 'restaurantBooking';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private firebaseService: FirebaseService) { }

  gets() {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<BookingModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.map(entity => {
            const data = entity.payload.doc.data();
            data.bookingFrom = Utilities.convertTimestampToDate(data.bookingFrom);
            data.bookingTo = Utilities.convertTimestampToDate(data.bookingTo);
            const id = entity.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getById(bookingId: string) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .get<BookingModel>(bookingId).get()
      .pipe(map(entity => {
        const data = entity.data() as BookingModel;
        const id = entity.id;
        return { id, ...data };
      }));
  }

  getByIds(bookingIds: string[]) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<BookingModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              const id = entity.payload.doc.id;
              if (bookingIds.find(bookingId => bookingId === id)) {
                return entity;
              }
            })
            .map(entity => {
              const data = entity.payload.doc.data();
              data.bookingFrom = Utilities.convertTimestampToDate(
                data.bookingFrom
              );
              data.bookingTo = Utilities.convertTimestampToDate(data.bookingTo);
              const id = entity.payload.doc.id;
              return { id, ...data };
            });
        })
      );
  }

  getByRestaurantId(restaurantId: string) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<BookingModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              const data = entity.payload.doc.data();
              if (restaurantId === data.restaurantId) {
                return entity;
              }
            })
            .map(entity => {
              const data = entity.payload.doc.data();
              data.bookingFrom = Utilities.convertTimestampToDate(
                data.bookingFrom
              );
              data.bookingTo = Utilities.convertTimestampToDate(data.bookingTo);
              const id = entity.payload.doc.id;
              return { id, ...data };
            });
        })
      );
  }

  add(entity: BookingModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.add<BookingModel>(entity);
  }

  update(entity: BookingModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.update<BookingModel>(entity, entity.id);
  }

  delete(uid) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.delete(uid);
  }
}
