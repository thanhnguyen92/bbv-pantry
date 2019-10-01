import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { map } from 'rxjs/operators';
import { PushNotificationModel } from '../models/push-notification.model';
import moment = require('moment');

const ENTITY_NAME = 'notification';
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  /**
   *
   */
  constructor(private fireService: FirebaseService) {}

  getByEmailOrUserId(email, userId) {
    this.fireService.setPath(ENTITY_NAME);
    return this.fireService
      .gets<PushNotificationModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              console.log(entity);
              const data = entity.payload.doc.data() as PushNotificationModel;

              const dateSubstract = moment(data.dateTime).subtract(
                5,
                'minutes'
              );
              const isValid = moment().diff(dateSubstract, 'minute');
              debugger;
              if (
                (email && data.email === email) ||
                (userId && data.userId === userId)
              ) {
                return entity;
              }
            })
            .map(entity => {
              console.log(entity);
              const data = entity.payload.doc.data();
              const id = entity.payload.doc.id;
              return { id, ...data };
            });
        })
      );
  }

  push(pushNotificationModel: PushNotificationModel) {
    this.fireService.setPath(ENTITY_NAME);
    pushNotificationModel.dateTime = new Date().getUTCDate();
    return this.fireService.add<PushNotificationModel>(pushNotificationModel);
  }

  delete(uid) {
    this.fireService.setPath(ENTITY_NAME);
    // const debug = this.database.ref('notification');
    return this.fireService.delete(uid);
  }

  deleteCol() {
    this.fireService.setPath(ENTITY_NAME);
    // const debug = this.database.ref('notification');
    return this.fireService.deleteObject();
  }
}
