import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { RestaurantModel } from '../models/restaurant.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

const ENTITY_NAME = 'restaurant';
@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  constructor(private firebaseService: FirebaseService) {}

  getRestaurants() {
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

  add(entity) {
    this.firebaseService.setPath(ENTITY_NAME);
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
