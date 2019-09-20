import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { BookingModel } from '../models/booking.model';
import { map } from 'rxjs/operators';

const ENTITY_NAME = 'restaurantBooking';
@Injectable({
    providedIn: 'root'
})
export class BookingService {
    constructor(private firebaseService: FirebaseService) { }

    gets() {
        this.firebaseService.setPath(ENTITY_NAME);
        return this.firebaseService.gets<BookingModel>().snapshotChanges().pipe(map(entities => {
            return entities.map(entity => {
                const data = entity.payload.doc.data() as BookingModel;
                data.uid = entity.payload.doc.id;
                return data;
            });
        }));
    }

    add(entity: BookingModel) {
        this.firebaseService.setPath(ENTITY_NAME);
        entity.uid = this.firebaseService.createId();
        return this.firebaseService.add<BookingModel>(entity);
    }

    update(entity: BookingModel) {
        this.firebaseService.setPath(ENTITY_NAME);
        return this.firebaseService.update<BookingModel>(entity, entity.uid);
    }

    delete(uid) {
        this.firebaseService.setPath(ENTITY_NAME);
        return this.firebaseService.delete(uid);
    }
}
