import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class UserService {
    private readonly baseUrl = environment.bbvApiUrl;

    constructor(private _httpClient: HttpClient) { }

    getUserInfo(userName, idToken): Observable<any> {
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
