import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { MenuModel } from '../models/menu.model';
import { map } from 'rxjs/operators';
import { HappyHoursModel } from '../models/happy-hours.model';
import { OrderNotes } from 'src/app/user/order-notes/order-notes.component';
const ENTITY_NAME = 'order-notes';
@Injectable({
  providedIn: 'root'
})
export class OrderNotesService {
  constructor(private firebaseService: FirebaseService) {}

  getById(menuId: string) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .get<OrderNotes>(menuId)
      .get()
      .pipe(
        map(entity => {
          const data = entity.data() as OrderNotes;
          const id = entity.id;
          return { id, ...data };
        })
      );
  }
  gets() {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<OrderNotes>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.map(entity => {
            const data = entity.payload.doc.data() as OrderNotes;
            const id = entity.payload.doc.id;
            data['type'] = entity.type;
            return { id, ...data };
          });
        })
      );
  }

  add(entity: OrderNotes) {
    this.firebaseService.setPath(ENTITY_NAME);
    entity.orderDate = new Date();
    return this.firebaseService.add<OrderNotes>(entity);
  }

  update(entity: OrderNotes) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.update<OrderNotes>(entity, entity.id);
  }

  delete(uid) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.delete(uid);
  }
}
