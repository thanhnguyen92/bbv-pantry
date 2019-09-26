import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { map } from 'rxjs/operators';
import { PushNotificationModel } from '../models/push-notification.model';
import { filter } from 'minimatch';

const ENTITY_NAME = 'notification';
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  /**
   *
   */
  constructor(private fireService: FirebaseService) { }

  getByEmailOrUserId(email, userId) {
    this.fireService.setPath(ENTITY_NAME);
    return this.fireService
      .gets<PushNotificationModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              const data = entity.payload.doc.data() as PushNotificationModel;
              if (
                (email && data.email === email) ||
                (userId && data.userId === userId)
              ) {
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

  push(pushNotificationModel: PushNotificationModel) {
    this.fireService.setPath(ENTITY_NAME);
    // return this.fireService.add<PushNotificationModel>(pushNotificationModel);
  }

  delete(uid) {
    this.fireService.setPath(ENTITY_NAME);
    return this.fireService.delete(uid);
  }
}
