import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { BookingModel } from '../models/booking.model';
import { map } from 'rxjs/operators';
import { PluginModel } from '../models/plugin.model';

const ENTITY_NAME = 'plugin';
@Injectable({
  providedIn: 'root'
})
export class PluginService {
  constructor(private firebaseService: FirebaseService) {}

  gets() {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<PluginModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.map(entity => {
            const data = entity.payload.doc.data();

            const id = entity.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getById(id: string) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .get<PluginModel>(id)
      .get()
      .pipe(
        map(entity => {
          const data = entity.data() as BookingModel;
          const uid = entity.id;
          return { id: uid, ...data };
        })
      );
  }

  getByUserId(userId: string) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<PluginModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              const plugInUserId = entity.payload.doc.data().userId;
              if (plugInUserId === userId || !plugInUserId) {
                return entity;
              }
            })
            .map(entity => {
              const data = entity.payload.doc.data();
              const id = entity.payload.doc.id;
              return { id, ...data };
            });
        })
      );
  }

  add(entity: PluginModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.add<PluginModel>(entity);
  }

  update(entity: PluginModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.update<PluginModel>(entity, entity.id);
  }

  delete(uid) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.delete(uid);
  }
}
