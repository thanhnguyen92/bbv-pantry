import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { of, Observable } from 'rxjs';

const USER_ENTITY = 'users';
@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private firebaseService: FirebaseService) { }

    getByUserIds(userIds: string[]) {
        if (userIds && userIds.length > 0) {
            this.firebaseService.setPath(USER_ENTITY);
            return this.firebaseService.gets<UserModel>().snapshotChanges()
                .pipe(map(entities => {
                    return entities.filter(entity => {
                        const id = entity.payload.doc.id;
                        if (userIds.find(userId => userId === id)) {
                            return entity;
                        }
                    }).map(entity => {
                        const data = entity.payload.doc.data();
                        const id = entity.payload.doc.id;
                        return { id, ...data };
                    });
                }));
        } else {
            return of([] as UserModel[]);
        }
    }

    get(userId: string) {
        this.firebaseService.setPath(USER_ENTITY);
        return this.firebaseService.get<UserModel>(userId).snapshotChanges()
            .pipe(map(entity => {
                const data = entity.payload.data() as UserModel;
                const id = entity.payload.id;
                return { id, ...data };
            }));
    }
}
