import { Injectable, NgZone } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import * as jwt_decode from 'jwt-decode';
const USER_KEY = 'USER-KEY';
const USER_ACCESSTOKEN = 'ACCESS-TOKEN-KEY';
const USER_REFRESHTOKEN = 'REFRESH-TOKEN-KEY';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
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

  SigIn(email, password) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        this.ngZone.run(() => {
          this.router.navigate(['dasboard']);
        });
        this.SetUserData(result.user);
        return result.user;
      })
      .catch(error => {
        return error.message;
      });
  }
  SignUp(email, password) {
    debugger;
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        this.SendVerificationMail();
        this.SetUserData(result.user);
        return result;
      })
      .catch(error => {
        return error.message;
      });
  }

  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(['verify-email']);
    });
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`,
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.setItem(USER_KEY, null);
      this.router.navigate(['sign-in']);
    });
  }

  private async setStorageUser(user: firebase.User) {
    const accessToken = await user.getIdToken();
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
  get isLogged() {
    const currentUser = JSON.parse(localStorage.getItem(USER_KEY));
    const isLogged = currentUser !== null && currentUser.emailVerified;
    return isLogged;
  }

  get isAdmin() {
    //TODO: Should implement feature to check role admin. Should implement admin firebase to custom token
    const tokenInfo = jwt_decode(localStorage.getItem(USER_ACCESSTOKEN));
    const user = JSON.parse(localStorage.getItem(USER_KEY)) as firebase.User;
    // Just hard code for this time.
    if (user.email.indexOf('thanhnguyen') || user.email.indexOf('toannguyen'))
      return true;
    return false;
  }
}
