import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { RestaurantModel } from '../models/restaurant.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

const ENTITY_NAME = 'Restaurant';
@Injectable({
  providedIn: 'root'
})
export class RestaurantService extends FirebaseService<RestaurantModel> {
  constructor(afs: AngularFirestore) {
    super(ENTITY_NAME, afs);
  }

  getRestaurants() {
    return this.gets().snapshotChanges().pipe(map(entities => {
      return entities.map(entity => {
        const data = entity.payload.doc.data() as RestaurantModel;
        data.uid = entity.payload.doc.id;
        return data;
      });
    }));
  }
}
