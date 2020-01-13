import { FirestoreService } from './firestore.service';
import { Injectable } from '@angular/core';
import { RestaurantModel } from '../models/restaurant.model';
import { map } from 'rxjs/operators';
import { Utilities } from './utilities';
import { BookingModel } from '../models/booking.model';

const RESTAURANT_ENTITY = 'restaurant';
const RESTAURANT_BOOKING_ENTITY = 'restaurantBooking';
@Injectable({
    providedIn: 'root'
})
export class RestaurantService {
    constructor(private firestoreService: FirestoreService) { }

    gets() {
        this.firestoreService.setPath(RESTAURANT_ENTITY);
        return this.firestoreService
            .gets<RestaurantModel>()
            .snapshotChanges()
            .pipe(
                map(entities => {
                    return entities.map(entity => {
                        const data = entity.payload.doc.data() as RestaurantModel;
                        const id = entity.payload.doc.id;
                        return { id, ...data };
                    });
                })
            );
    }

    getByRestaurantIds(restaurantIds: string[]) {
        this.firestoreService.setPath(RESTAURANT_ENTITY);
        return this.firestoreService
            .gets<RestaurantModel>()
            .snapshotChanges()
            .pipe(
                map(entities => {
                    return entities
                        .filter(entity => {
                            const id = entity.payload.doc.id;
                            if (restaurantIds.find(restaurantId => restaurantId === id)) {
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

    getByBookingDate(bookingDate) {
        this.firestoreService.setPath(RESTAURANT_BOOKING_ENTITY);
        return this.firestoreService
            .gets<BookingModel>(t => t.where('isClosed', '==', false))
            .snapshotChanges()
            .pipe(
                map(entities => {
                    return entities
                        .filter(entity => {
                            const data = entity.payload.doc.data();
                            const bookingFrom = Utilities.convertTimestampToDate(
                                data.bookingFrom
                            );
                            const bookingTo = Utilities.convertTimestampToDate(
                                data.bookingTo
                            );
                            if ((bookingFrom <= bookingDate && bookingDate <= bookingTo)
                                || (bookingDate <= bookingTo && data.isPreBooking)) {
                                return entity;
                            }
                        })
                        .map(entity => {
                            const data = entity.payload.doc.data();
                            data.bookingFrom = Utilities.convertTimestampToDate(
                                data.bookingFrom
                            );
                            data.bookingTo = Utilities.convertTimestampToDate(data.bookingTo);
                            const id = entity.payload.doc.id;
                            return { id, ...data };
                        });
                })
            );
    }

    add(entity: RestaurantModel) {
        this.firestoreService.setPath(RESTAURANT_ENTITY);
        return this.firestoreService.add<RestaurantModel>(entity);
    }

    update(entity: RestaurantModel) {
        this.firestoreService.setPath(RESTAURANT_ENTITY);
        return this.firestoreService.update<RestaurantModel>(entity, entity.id);
    }

    delete(uid) {
        this.firestoreService.setPath(RESTAURANT_ENTITY);
        return this.firestoreService.delete(uid);
    }
}
