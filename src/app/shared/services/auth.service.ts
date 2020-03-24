import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserRole } from '../enums/user-roles.enum';
import { UserModel } from '../models/user.model';
import { MsalService } from '@azure/msal-angular';
import { PublishSubcribeService } from './pub-sub.service';
import { PubSubChannel } from '../constants/pub-sub-channels.contants';
import { Utilities } from './utilities';

const USER_INFO = 'USER-INFO';
const USER_PERMISSIONS = 'USER-PERMISSIONS';
const USER_ACCESSTOKEN = 'ACCESS-TOKEN-KEY';
const USER_REFRESHTOKEN = 'REFRESH-TOKEN-KEY';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userData: firebase.User;

    constructor(
        private _router: Router,
        private _msalService: MsalService,
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth,
        private _pubSubService: PublishSubcribeService) { }

    login(email, password) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    register(email, password) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    sendVerification() {
        return this.afAuth.auth.currentUser.sendEmailVerification().then();
    }

    resetPassword(email) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    setUserData(user) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(
            `users/${user.id}`
        );
        return userRef.set(user, {
            merge: true
        });
    }

    async msalLogin() {
        return await this._msalService.loginPopup();
    }

    async msalGetUser() {
        return await this._msalService.getUser();
    }

    async logOut() {
        this._router.navigate(['/']);
        setTimeout(() => {
            this.clearStorage();
            this._msalService.logout();
            this._pubSubService.publish(PubSubChannel.LOGGED_STATE, false);
        });
        // return this.afAuth.auth.signOut().then(() => {
        //     this.clearStorage();
        //     this.router.navigate(['auth', 'login']);
        // });
    }

    async setUserRoles(roles: UserRole[]) {
        localStorage.setItem(USER_PERMISSIONS, JSON.stringify(roles));
    }

    async refreshToken() {
        const user: firebase.User = await new Promise(resolve => {
            this.afAuth.auth.onAuthStateChanged(
                currentUser => resolve(currentUser),
                () => resolve(null)
            );
        });

        if (user) {
            this.setUserStorage(user);
            return user;
        }
    }

    get accessToken() {
        const accessToken = localStorage.getItem(USER_ACCESSTOKEN);
        return accessToken;
    }

    set accessToken(value) {
        if (value) {
            localStorage.setItem(USER_ACCESSTOKEN, value);
        }
    }

    get isAuthenticated(): boolean {
        const user = localStorage.getItem(USER_INFO);
        if (user && user !== null) {
            return true;
        }

        return false;
    }

    get isAdmin() {
        const roles = JSON.parse(
            localStorage.getItem(USER_PERMISSIONS)
        ) as UserRole[];
        if (roles) {
            return roles.indexOf(UserRole.Admin) !== -1;
        }
        return false;
    }

    get currentUser(): any {
        const user = localStorage.getItem(USER_INFO);
        if (user) {
            return JSON.parse(user) as UserModel;
        }

        return undefined;
    }

    set currentUser(value: any) {
        if (value || !Utilities.isObjectEmpty(value)) {
            // Mapping from msal user to bbv user
            const bbvUser = {
                firstName: value.vorname,
                lastName: value.name,
                email: value.skypeName,
                birthday: value.geburtsDatum,
                bankNumber: value.kontonummer,
                mobileNumber: value.telMobile,
                zipCode: value.plz,
                location: value.ort,
                countryId: value.nationalitaetsId ? value.nationalitaetsId : value.landId,
                civilStandId: value.zivilStandId
            } as UserModel;
            localStorage.setItem(USER_INFO, JSON.stringify(bbvUser));
        }
    }

    private async setUserStorage(user: firebase.User) {
        const accessToken = await user.getIdToken(true);
        const refreshToken = user.refreshToken;
        localStorage.setItem(USER_ACCESSTOKEN, accessToken);
        localStorage.setItem(USER_REFRESHTOKEN, refreshToken);
    }

    private clearStorage() {
        localStorage.removeItem(USER_INFO);
        localStorage.removeItem(USER_ACCESSTOKEN);
        localStorage.removeItem(USER_REFRESHTOKEN);
        localStorage.removeItem(USER_PERMISSIONS);
    }
}
