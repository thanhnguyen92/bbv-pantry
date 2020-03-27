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
import { UserService } from './user.service';
import { NotificationService } from './notification.service';
import { map } from 'rxjs/operators';
import { UserViewModel } from '../view-models/user.model';
import { SecurityModel } from '../models/security.model';
import { FirestoreService } from './firestore.service';
import { AppService } from './app.service';

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
        private db: AngularFirestore,
        private afAuth: AngularFireAuth,
        private _appService: AppService,
        private _pubSubService: PublishSubcribeService,
        private _userService: UserService) { }

    // login(email, password) {
    //     return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    // }

    login() {
        return this.msalLogin().then(async idToken => {
            const msUser = await this.msalGetUser();

            this._appService.setLoadingStatus(true);
            await this._userService.getBbvUserInfo(msUser.displayableId, idToken).toPromise()
                .then(user => {
                    if (!user.email) {
                        user.email = msUser.displayableId;
                    }
                    this.currentUser = user;

                    // Check firebase account
                    const newUser = { ...this.currentUser } as UserModel;
                    this.db.collection<UserModel>('users', t => t.where('email', '==', newUser.email))
                        .get().pipe(map(entity => {
                            let result;
                            if (entity.docs.length === 1) {
                                const data = entity.docs[0].data() as UserModel;
                                const id = entity.docs[0].id;
                                result = { id, ...data };
                            }

                            return result;
                        })).toPromise().then(currUser => {
                            if (!currUser) {
                                // Create new user in db
                                newUser.id = this.db.createId();
                                newUser.active = true;
                                this.db.doc(`users/${newUser.id}`).set(newUser, {
                                    merge: true
                                });

                                // Assign default role User for new account
                                const securityEntity = {
                                    id: this.db.createId(),
                                    userId: newUser.id,
                                    roles: [UserRole.User]
                                } as SecurityModel;
                                this.db.doc(`security/${securityEntity.id}`).set(securityEntity, {
                                    merge: true
                                });
                                this.userRoles = [UserRole.User];
                                this._pubSubService.publish(PubSubChannel.LOGGED_STATE, true);
                                this._appService.setLoadingStatus(false);
                            } else {
                                if (!currUser.active) {
                                    this.logOut();
                                    NotificationService.showWarningMessage(`Your account is deactivated, please contact administrators`);
                                    return;
                                }

                                // Get user roles
                                this.db.collection<SecurityModel>('security', t => t.where('userId', '==', currUser.id))
                                    .get().pipe(map(entities => {
                                        if (entities.docs.length === 1) {
                                            const data = entities.docs[0].data() as SecurityModel;
                                            const id = entities.docs[0].id;
                                            return { id, ...data };
                                        }
                                    })).toPromise().then(security => {
                                        this.userRoles = security.roles;
                                        this._pubSubService.publish(PubSubChannel.LOGGED_STATE, true);
                                        this._appService.setLoadingStatus(false);
                                    }).catch(err => {
                                        console.log(err);
                                        this.logOut();
                                        NotificationService.showErrorMessage(`Can’t get roles for user ${currUser.email}`);
                                    });
                            }
                        }).catch(err => {
                            console.log(err);
                            this.logOut();
                            NotificationService.showErrorMessage(`Can’t find firebase user with email ${newUser.email}`);
                        });
                }).catch(err => {
                    console.log(err);
                    this.logOut();
                    NotificationService.showErrorMessage(`Can’t get bbv's user information`);
                });
        }).catch(err => {
            console.log(err);
            NotificationService.showErrorMessage(`Login failed, please try again`);
            this._router.navigate(['/']);
        });
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
        const userRef: AngularFirestoreDocument<any> = this.db.doc(
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
        setTimeout(() => {
            this.clearStorage();
            this._msalService.logout();
            this._router.navigate(['/']);
            this._pubSubService.publish(PubSubChannel.LOGGED_STATE, false);
            this._appService.setLoadingStatus(false);
        });
        // return this.afAuth.auth.signOut().then(() => {
        //     this.clearStorage();
        //     this.router.navigate(['auth', 'login']);
        // });
    }

    set userRoles(roles) {
        localStorage.setItem(USER_PERMISSIONS, JSON.stringify(roles));
    }

    get userRoles(): any {
        const roles = localStorage.getItem(USER_PERMISSIONS);
        if (roles) {
            return JSON.parse(roles) as [];
        }

        return undefined;
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
            return roles.indexOf(UserRole.Administrator) !== -1;
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
