import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  QueryFn
} from '@angular/fire/firestore';
import { BaseEntity } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService<T extends BaseEntity> {
  entity: AngularFirestoreDocument<T>;
  entities: AngularFirestoreCollection<T>;
  constructor(private path: string, private db: AngularFirestore) {
    this.entities = db.collection<T>(this.path);
  }

  public get(id: string): AngularFirestoreDocument {
    this.entity = this.db.doc<T>(this.path);
    return this.entity;
  }

  public gets(query?: QueryFn): AngularFirestoreCollection<T> {
    this.entities = this.db.collection<T>(this.path, query);
    return this.entities;
  }

  public add(entity: T) {
    return this.entities.add(entity);
  }

  public update(entity: T) {
    return this.db.doc(`${this.path}/${entity.uid}`).update(entity);
  }

  public delete(id: string) {
    return this.db.doc(`${this.path}/${id}`).delete();
  }
  private errorCallback(message) {
    console.log(message);
  }
}
