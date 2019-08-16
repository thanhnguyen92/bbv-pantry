import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Order } from '../models/order.model';
import { map } from 'rxjs/operators';

const ENTITY_NAME = 'order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firebaseService: FirebaseService) { }

  add(newItem) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.add<Order>(newItem);
  }

  getAll() {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.gets<Order>().snapshotChanges().pipe(map(entities => {
      return entities.map(entity => {
        const data = entity.payload.doc.data() as Order;
        data.uid = entity.payload.doc.id;
        return data;
      });
    }));
  }
}
