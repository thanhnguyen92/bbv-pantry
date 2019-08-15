import { Injectable, NgZone } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import * as jwt_decode from 'jwt-decode';
import { Security } from '../models/security.model';
import { map } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { UserRole } from '../enums/user-role.enum';
const USER_KEY = 'USER-KEY';
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
    private router: Router,
    private ngZone: NgZone
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
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        const query = this.afs.collection<Security>('security', t => t.where('userId', '==', result.user.uid));
        query.get().pipe(map(entities => {
          return entities.docs.map(entity => {
            return entity.data();
          });
        })).subscribe(results => {
          if (results) {
            const security = results[0] as Security;
            localStorage.setItem(USER_PERMISSIONS, JSON.stringify(security.roles));

            this.ngZone.run(() => {
              this.router.navigate(['admin']);
            });
            this.setUserData(result.user);
          } else {
            NotificationService.showErrorMessage('Access denied');
            this.logOut();
          }
        });
      })
      .catch(error => {
        return error.message;
      });
  }

  register(email, password) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        this.sendVerification();
        this.setUserData(result.user);
        return result;
      })
      .catch(error => {
        return error.message;
      });
  }

  sendVerification() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(['verify-email']);
    });
  }

  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  logOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(USER_ACCESSTOKEN);
      localStorage.removeItem(USER_REFRESHTOKEN);
      localStorage.removeItem(USER_PERMISSIONS);
      this.router.navigate(['auth', 'login']);
    });
  }

  private async setStorageUser(user: firebase.User) {
    const accessToken = await user.getIdToken(true);
    const refreshToken = user.refreshToken;
    localStorage.setItem(USER_ACCESSTOKEN, accessToken);
    localStorage.setItem(USER_REFRESHTOKEN, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private clearStorage() {
    localStorage.setItem(USER_KEY, null);
    localStorage.setItem(USER_ACCESSTOKEN, null);
    localStorage.setItem(USER_REFRESHTOKEN, null);
  }

  get token() {
    const accessToken = localStorage.getItem(USER_ACCESSTOKEN);
    return accessToken;
  }
  get isLogged() {
    const currentUser = JSON.parse(localStorage.getItem(USER_KEY));
    const isLogged = currentUser !== null && currentUser.emailVerified;
    return isLogged;
  }

  get isAdmin() {
    const roles = JSON.parse(localStorage.getItem(USER_PERMISSIONS)) as UserRole[];
    return roles.indexOf(UserRole.Admin) > -1;
  }
}
