import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { MenuModel } from '../models/menu.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

const ENTITY_NAME = 'menu';
@Injectable({
  providedIn: 'root'
})
export class MenuService extends FirebaseService<MenuModel> {
  constructor(afs: AngularFirestore) {
    super(ENTITY_NAME, afs);
  }

  getMenuByRestaurantId(restaurantId) {
    return this.gets(t => t.where('restaurantId', '==', restaurantId)).snapshotChanges().pipe(map(entities => {
      return entities.map(entity => {
        const data = entity.payload.doc.data() as MenuModel;
        data.uid = entity.payload.doc.id;
        return data;
      });
    }));
  }
}
