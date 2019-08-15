import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Menu } from '../models/menu.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from '../models/order.model';

const ENTITY_NAME = 'order';
@Injectable({
  providedIn: 'root'
})
export class OrderService extends FirebaseService<Order> {
  constructor(afs: AngularFirestore) {
    super(ENTITY_NAME, afs);
  }
}
