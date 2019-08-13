import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { RestaurantModel } from '../models/restaurant.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService extends FirebaseService<RestaurantModel> {

  constructor(db: AngularFirestore) {
    super('Restaurant', db);
  }
}
