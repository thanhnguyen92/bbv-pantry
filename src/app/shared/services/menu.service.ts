import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Menu } from '../models/menu.model';
import { AngularFirestore } from '@angular/fire/firestore';

const ENTITY_NAME = 'menu';
@Injectable({
  providedIn: 'root'
})
export class MenuService extends FirebaseService<Menu> {
  constructor(afs: AngularFirestore) {
    super(ENTITY_NAME, afs);
  }
}
