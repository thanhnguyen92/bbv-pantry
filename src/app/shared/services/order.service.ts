import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

/** Models */
import { OrderModel } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';

/** Services */
import { Utilities } from './utilities';
import { FirestoreService } from './firestore.service';

const ENTITY_NAME = 'order';
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private _firestoreService: FirestoreService) { }

    gets() {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService
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
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService
            .get<OrderModel>(orderId)
            .get()
            .pipe(
                map(entity => {
                    const data = entity.data() as OrderModel;
                    const id = entity.id;
                    return { id, ...data };
                })
            );
    }

    getByRestaurantId(restaurantId: string) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService
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
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService
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
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.add<OrderModel>(entity);
    }

    update(entity: OrderModel) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.update<OrderModel>(entity, entity.id);
    }

    delete(uid) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.delete(uid);
    }

    getsByPaymentState(isPaid, userId) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService
            .gets<OrderModel>(t => t.where('isPaid', '==', isPaid))
            .snapshotChanges()
            .pipe(
                map(entities => {
                    return entities
                        .filter(entity => {
                            const data = entity.payload.doc.data() as OrderModel;
                            if (data.userId === userId || !userId || userId === '') {
                                return entity;
                            }
                        })
                        .map(entity => {
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
            if (!item.price) {
                item.price = 0;
            }
            total += item.amount * item.price;
        });
        return total;
    }
}
