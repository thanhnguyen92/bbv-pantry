import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserRole } from '../enums/user-roles.enum';
import { UserModel } from '../models/user.model';

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
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth,
        private router: Router) {
        this.afAuth.authState.subscribe(async result => {
            if (result) {
                this.userData = result;
                await this.setUserStorage(result);
            } else {
                this.clearStorage();
            }
        });
    }

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

    async logOut() {
        return this.afAuth.auth.signOut().then(() => {
            this.clearStorage();
            this.router.navigate(['auth', 'login']);
        });
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

    get isLogged(): boolean {
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

    get currentUser(): UserModel {
        const user = localStorage.getItem(USER_INFO);
        if (user) {
            return JSON.parse(user) as UserModel;
        }

        return undefined;
    }

    set currentUser(value) {
        if (value) {
            localStorage.setItem(USER_INFO, JSON.stringify(value));
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
