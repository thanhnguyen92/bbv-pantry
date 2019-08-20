import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { RestaurantModel } from '../models/restaurant.model';
import { map } from 'rxjs/operators';
import { Utilities } from './utilities';

const ENTITY_NAME = 'restaurant';
@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  constructor(private firebaseService: FirebaseService) {}

  gets() {
    this.firebaseService.setPath(ENTITY_NAME);
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
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.gets<RestaurantModel>(Utilities.buildQueryGetByPropWithArray('uid', restaurantIds))
      .snapshotChanges().pipe(map(entities => {
        return entities.map(entity => {
          const data = entity.payload.doc.data() as RestaurantModel;
          data.uid = entity.payload.doc.id;
          return data;
        });
      }));
  }

  getByBookingDate(bookingDate) {
    this.firebaseService.setPath('restaurantBooking');
    console.log(bookingDate);
    return this.firebaseService.gets<any>
      // (t => ((t.where('bookingFrom', '>=', bookingDate) && t.where('bookingTo', '<=', bookingDate))
      //   || t.where('isPreBooking', '==', true)) && t.where('isClosed', '==', false))
      (t => t.where('bookingFrom', '>=', bookingDate) && t.where('bookingTo', '<=', bookingDate) && t.where('isClosed', '==', false))
      .snapshotChanges().pipe(map(entities => {
        return entities.map(entity => {
          const data = entity.payload.doc.data();
          console.log(data);
          data.uid = entity.payload.doc.id;
          return data;
        });
      }));
  }

  add(entity: RestaurantModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    entity.uid = this.firebaseService.createId();
    return this.firebaseService.add<RestaurantModel>(entity);
  }

  update(entity: RestaurantModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.update<RestaurantModel>(entity, entity.uid);
  }

  delete(uid) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.delete(uid);
  }
}
