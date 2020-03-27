import { FirestoreService } from './firestore.service';
import { Injectable } from '@angular/core';
import { BookingModel } from '../models/booking.model';
import { map } from 'rxjs/operators';
import { Utilities } from './utilities';

const ENTITY_NAME = 'restaurantBooking';
@Injectable({
    providedIn: 'root'
})
export class BookingService {
    constructor(private _firestoreService: FirestoreService) { }

    gets() {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService
            .gets<BookingModel>()
            .snapshotChanges()
            .pipe(
                map(entities => {
                    return entities.map(entity => {
                        const data = entity.payload.doc.data();
                        data.bookingFrom = Utilities.convertTimestampToDate(data.bookingFrom);
                        data.bookingTo = Utilities.convertTimestampToDate(data.bookingTo);
                        const id = entity.payload.doc.id;
                        return { id, ...data };
                    });
                })
            );
    }

    getById(bookingId: string) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService
            .get<BookingModel>(bookingId).get()
            .pipe(map(entity => {
                const data = entity.data() as BookingModel;
                const id = entity.id;
                return { id, ...data };
            }));
    }

    getByIds(bookingIds: string[]) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService
            .gets<BookingModel>()
            .snapshotChanges()
            .pipe(
                map(entities => {
                    return entities
                        .filter(entity => {
                            const id = entity.payload.doc.id;
                            if (bookingIds.find(bookingId => bookingId === id)) {
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

    getByRestaurantId(restaurantId: string) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService
            .gets<BookingModel>()
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

    add(entity: BookingModel) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.add<BookingModel>(entity);
    }

    update(entity: BookingModel) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.update<BookingModel>(entity, entity.id);
    }

    delete(uid) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.delete(uid);
    }
}
