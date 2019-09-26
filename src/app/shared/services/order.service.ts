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
  constructor(private firebaseService: FirebaseService) { }

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
            const id = entity.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getById(orderId: string) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.get<OrderModel>(orderId).get()
      .pipe(map(entity => {
        const data = entity.data() as OrderModel;
        const id = entity.id;
        return { id, ...data };
      }));
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
              const id = entity.payload.doc.id;
              return { id, ...data };
            });
        })
      );
  }

  getByBookingId(bookingId: string) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<OrderModel>()
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities
            .filter(entity => {
              const data = entity.payload.doc.data() as OrderModel;
              if (bookingId === data.bookingId) {
                return entity;
              }
            })
            .map(entity => {
              const data = entity.payload.doc.data();
              data.orderDate = Utilities.convertTimestampToDate(data.orderDate);
              const id = entity.payload.doc.id;
              return { id, ...data };
            });
        })
      );
  }

  add(entity: OrderModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.add<OrderModel>(entity);
  }

  update(entity: OrderModel) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.update<OrderModel>(entity, entity.id);
  }

  delete(uid) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService.delete(uid);
  }

  getsByPaymentState(isPaid, userId) {
    this.firebaseService.setPath(ENTITY_NAME);
    return this.firebaseService
      .gets<OrderModel>(t => t.where('isPaid', '==', isPaid))
      .snapshotChanges()
      .pipe(
        map(entities => {
          return entities.filter(entity => {
            const data = entity.payload.doc.data() as OrderModel;
            if (data.userId === userId) {
              return entity;
            }
          }).map(entity => {
            const data = entity.payload.doc.data() as OrderModel;
            const id = entity.payload.doc.id;
            return { id, ...data };
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
