import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { MenuModel } from '../models/menu.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

const ENTITY_NAME = 'menu';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private firebaseService: FirebaseService) { }

  getByRestaurantId(restaurantId) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.gets<MenuModel>(t => t.where('restaurantId', '==', restaurantId)).snapshotChanges().pipe(map(entities => {
      return entities.map(entity => {
        const data = entity.payload.doc.data() as MenuModel;
        data.uid = entity.payload.doc.id;
        data['type'] = entity.type;
        return data;
      });
    }));
  }

  add(entity: MenuModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    entity.uid = this.firebaseService.createId();
    return this.firebaseService.add<MenuModel>(entity);
  }

  update(entity: MenuModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.update<MenuModel>(entity, entity.uid);
  }

  delete(uid) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.delete(uid);
  }
}
