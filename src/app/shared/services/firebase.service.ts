import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  QueryFn,
} from '@angular/fire/firestore';
import { BaseEntity } from '../models/base.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService<T extends BaseEntity> {
  entity: AngularFirestoreDocument<T>;
  entities: AngularFirestoreCollection<T>;
  constructor(private path: string, private db: AngularFirestore) {
    this.entities = db.collection<T>(this.path);
  }

  public Get(id: string): AngularFirestoreDocument {
    this.entity = this.db.doc<T>(this.path);
    return this.entity;
  }

  public Gets(query?: QueryFn): AngularFirestoreCollection<T> {
    this.entities = this.db.collection<T>(this.path, query);
    return this.entities;
  }

  public Add(entity: T) {
    return this.entities.add(entity);
  }

  public Update(entity: T) {
    return this.db.doc(`${this.path}/${entity.uid}`).update(entity);
  }

  public Delete(id: string) {
    return this.db.doc(`${this.path}/${id}`).delete();
  }
  private errorCallback(message) {
    console.log(message);
  }
}
