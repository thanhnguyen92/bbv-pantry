import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { OrderModel } from '../models/order.model';
import { map } from 'rxjs/operators';
import { OrderItem } from '../models/order-item.model';
import { Utilities } from './utilities';

const ENTITY_NAME = 'order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firebaseService: FirebaseService) {}

  gets() {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<OrderModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.map(entity => {
            const data = entity.payload.doc.data();
            data.orderDate = Utilities.convertTimestampToDate(data.orderDate);
            data.uid = entity.payload.doc.id;
            return data;
          });
        })
      );
  }

  getByRestaurantId(restaurantId: string) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<OrderModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              const data = entity.payload.doc.data();
              if (restaurantId === data.restaurantId) {
                return entity;
              }
            })
            .map(entity => {
              const data = entity.payload.doc.data();
              data.orderDate = Utilities.convertTimestampToDate(data.orderDate);
              data.uid = entity.payload.doc.id;
              return data;
            });
        })
      );
  }

  add(entity: OrderModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    entity.uid = this.firebaseService.createId();
    if (entity.orderItems) {
      entity.orderItems.forEach(item => {
        item.uid = this.firebaseService.createId();
      });
    }
    return this.firebaseService.add<OrderModel>(entity);
  }

  getsPaidOrUnpaid(isPaid) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<OrderModel>(t => t.where('isPaid', '==', isPaid))
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.map(entity => {
            const data = entity.payload.doc.data() as OrderModel;
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
