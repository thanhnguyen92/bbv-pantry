import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Order } from '../models/order.model';
import { map } from 'rxjs/operators';
import { OrderItem } from '../models/order-item.model';

const ENTITY_NAME = 'order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firebaseService: FirebaseService) {}

  add(entity: Order) {
    this.firebaseService.setPath(ENTITY_NAME);
    entity.uid = this.firebaseService.createId();
    if (entity.orderItems) {
      entity.orderItems.forEach(item => {
        item.uid = this.firebaseService.createId();
      });
    }
    return this.firebaseService.add<Order>(entity);
  }

  getsPaidOrUnpaid(isPaid) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<Order>(t => t.where('isPaid', '==', isPaid))
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.map(entity => {
            const data = entity.payload.doc.data() as Order;
            data.uid = entity.payload.doc.id;
            return data;
          });
        })
      );
  }

  calculatePrice(cart: OrderItem[]) {
    if (!cart) {
      return 0;
    }

    let total = 0;
    cart.forEach(item => {
      total += item.amount * item.price;
    });
    return total;
  }
}
