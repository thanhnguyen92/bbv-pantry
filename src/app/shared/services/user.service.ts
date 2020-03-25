import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { FirestoreService } from './firestore.service';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';
import { UserViewModel } from '../view-models/user.model';

const USER_ENTITY = 'users';
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly baseUrl = environment.bbvApiUrl;

    constructor(
        private _httpClient: HttpClient,
        private _firestoreService: FirestoreService) { }

    gets() {
        this._firestoreService.setPath(USER_ENTITY);
        return this._firestoreService.gets<UserModel>()
            .snapshotChanges()
            .pipe(
                map(entities => {
                    return entities.map(entity => {
                        const data = entity.payload.doc.data() as UserViewModel;
                        const id = entity.payload.doc.id;
                        return { id, ...data };
                    });
                })
            );
        // .get()
        // .pipe(map(entities => {
        //     return entities.docs.map(entity => {
        //         const data = entity.data() as UserViewModel;
        //         const id = entity.id;
        //         return { id, ...data };
        //     });
        // }));
    }

    getBbvUserInfo(userName, idToken): Observable<any> {
        const url = `${this.baseUrl}/mitarbeiter?username=${userName}`;
        const headerOptions = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': 3600,
            'Authorization': `Bearer ${idToken}`
        };

        const headers = new HttpHeaders((Object as any).assign(headerOptions));
        return this._httpClient.get(url, { headers: headers });
    }

    getByUserIds(userIds: string[]) {
        if (userIds && userIds.length > 0) {
            this._firestoreService.setPath(USER_ENTITY);
            return this._firestoreService.gets<UserModel>().snapshotChanges()
                .pipe(map(entities => {
                    return entities.filter(entity => {
                        const id = entity.payload.doc.id;
                        if (userIds.find(userId => userId === id)) {
                            return entity;
                        }
                    }).map(entity => {
                        const data = entity.payload.doc.data() as UserViewModel;
                        const id = entity.payload.doc.id;
                        return { id, ...data };
                    });
                }));
        } else {
            return of([] as UserViewModel[]);
        }
    }

    get(userId: string) {
        this._firestoreService.setPath(USER_ENTITY);
        // return this._firestoreService.get<UserModel>(userId).snapshotChanges()
        //     .pipe(map(entity => {
        //         const data = entity.payload.data() as UserViewModel;
        //         const id = entity.payload.id;
        //         return { id, ...data };
        //     }));
        return this._firestoreService.get<UserModel>(userId).get()
            .pipe(map(entity => {
                const data = entity.data() as UserViewModel;
                const id = entity.id;
                return { id, ...data };
            }));
    }

    update(entity: UserViewModel) {
        this._firestoreService.setPath(USER_ENTITY);
        return this._firestoreService.update<UserModel>(entity, entity.id);
    }
}
