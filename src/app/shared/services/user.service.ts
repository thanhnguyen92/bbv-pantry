import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { FirestoreService } from './firestore.service';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';

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
        return this._firestoreService.gets<UserModel>().get()
            .pipe(map(entities => {
                return entities.docs.map(entity => {
                    const data = entity.data() as UserModel;
                    const id = entity.id;
                    return { id, ...data };
                });
            }));
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
}
