import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { UserRole } from '../enums/user-role.enum';
import { PublishSubcribeService } from './publish-subcribe.service';
import { PubSubChannel } from '../constants/pub-sub-channel.constant';
import { environment } from 'src/environments/environment.prod';
const USER_KEY = 'USER-KEY';
const USER_PERMISSIONS = 'USER-PERMISSIONS';
const USER_ACCESSTOKEN = 'ACCESS-TOKEN-KEY';
const USER_REFRESHTOKEN = 'REFRESH-TOKEN-KEY';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: firebase.User;
  isLogged = false;

  constructor(
    private pubSubService: PublishSubcribeService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(async result => {
      if (result) {
        this.userData = result;
        await this.setStorageUser(result);
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

  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.id}`
    );
    return userRef.set(user, {
      merge: true
    });
  }

  logOut() {
    return this.afAuth.auth.signOut().then(() => {
      this.clearStorage();
      this.router.navigate(['auth', 'login']);
    });
  }

  async setUserRoles(roles: UserRole[]) {
    localStorage.setItem(USER_PERMISSIONS, JSON.stringify(roles));
  }

  private async setStorageUser(user: firebase.User) {
    const accessToken = await user.getIdToken(true);
    if (!environment.production) {
    }
    const refreshToken = user.refreshToken;
    localStorage.setItem(USER_ACCESSTOKEN, accessToken);
    localStorage.setItem(USER_REFRESHTOKEN, refreshToken);
    // localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private clearStorage() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_ACCESSTOKEN);
    localStorage.removeItem(USER_REFRESHTOKEN);
    localStorage.removeItem(USER_PERMISSIONS);
  }

  async refreshToken() {
    const user: firebase.User = await new Promise(resolve => {
      this.afAuth.auth.onAuthStateChanged(
        currentUser => resolve(currentUser),
        () => resolve(null)
      );
    });

    if (user) {
      this.setStorageUser(user);
      return user;
    }
  }

  get token() {
    const accessToken = localStorage.getItem(USER_ACCESSTOKEN);
    return accessToken;
  }

  setIsLogged(value: boolean) {
    this.isLogged = value;
    this.pubSubService.publish(PubSubChannel.IS_USER_LOGGED, this.isLogged);
  }

  getIsLogged(): boolean {
    const accessToken = localStorage.getItem(USER_ACCESSTOKEN);
    const user = localStorage.getItem(USER_KEY);
    return user && accessToken && user !== null && accessToken != null;
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

  get currentUser() {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return undefined;
  }

  set currentUser(value) {
    if (value) {
      localStorage.setItem(USER_KEY, JSON.stringify(value));
    }
  }
}
