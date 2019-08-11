import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
const USER_KEY = "user";
export class AuthService {
  userData: any;

  constructor(private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone) {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        this.userData = user;
        console.log(await user.getIdToken());
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      else {
        localStorage.setItem(USER_KEY, null);
      }

    });
  }

  SigIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then((result) => {
      this.ngZone.run(() => {
        this.router.navigate(['dasboard']);
      });
      this.SetUserData(result.user);
    }).catch(error => {
      window.alert(error.message)
    });
  }
  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((result) => {
      this.SendVerificationMail();
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error.message);
    })
  }



  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(['verify-email'])
    });
  }


  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.setItem(USER_KEY, null);
      this.router.navigate(['sign-in']);
    })
  }

  get isLogged() {
    var currentUser = JSON.parse(localStorage.getItem(USER_KEY));
    return currentUser !== null && currentUser.emailVerified;
  }

  get isAdmin() {
    //TODO: Should implement feature to check role admin
    return true;
  }
}
