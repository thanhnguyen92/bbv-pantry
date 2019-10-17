import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { MenuModel } from '../models/menu.model';
import { map } from 'rxjs/operators';
import { HappyHoursModel } from '../models/happy-hours.model';
const ENTITY_NAME = 'happy-hours';
@Injectable({
  providedIn: 'root'
})
export class HappyHoursService {
  constructor(private firebaseService: FirebaseService) {}

  getById(menuId: string) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .get<HappyHoursModel>(menuId)
      .get()
      .pipe(
        map(entity => {
          const data = entity.data() as HappyHoursModel;
          const id = entity.id;
          return { id, ...data };
        })
      );
  }
  gets() {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<HappyHoursModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.map(entity => {
            const data = entity.payload.doc.data() as HappyHoursModel;
            const id = entity.payload.doc.id;
            data['type'] = entity.type;
            return { id, ...data };
          });
        })
      );
  }
  checkExitsName(name) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<MenuModel>()
      .valueChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              if (
                entity.name.localeCompare(name, ['vn', 'en'], {
                  sensitivity: 'accent'
                }) === 0
              ) {
                return entity;
              }
            })
            .map(entity => {
              const data = entity as MenuModel;

              const id = entity.id;
              return { id, ...data };
            });
        })
      );
  }
  add(entity: HappyHoursModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    entity.date = new Date();
    return this.firebaseService.add<HappyHoursModel>(entity);
  }

  update(entity: HappyHoursModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.update<HappyHoursModel>(entity, entity.id);
  }

  delete(uid) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.delete(uid);
  }
}
