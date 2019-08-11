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
  private path: string;
  entity: AngularFirestoreDocument<T>;
  entities: AngularFirestoreCollection<T>;
  constructor(path: string, private db: AngularFirestore) {
    this.path = path;
  }

  Get(id: string): AngularFirestoreDocument {
    this.entity = this.db.doc<T>(this.path);
    return this.entity;
  }

  Gets(query?: QueryFn): AngularFirestoreCollection<T> {
    this.entities = this.db.collection<T>(this.path, query);
    return this.entities;
  }

  async Add(entity: T, callBack?: Function) {
    await this.entities
      .add(entity)
      .then(result => {
        if (callBack != null) {
          callBack(result);
        }
      })
      .catch(error => {
        this.errorCallback(error);
      });
  }

  async Update(entity: T, callBack?: Function) {
    await this.db
      .doc(`${this.path}/${entity.uid}`)
      .update(entity)
      .then(result => {
        if (callBack) {
          callBack(result);
        }
      })
      .catch(error => this.errorCallback(error));
  }

  async Delete(id: string, callBack?: Function) {
    await this.db
      .doc(`${this.path}/${id}`)
      .delete()
      .then(result => {
        if (callBack) {
          callBack(result);
        }
      })
      .catch(err => {
        this.errorCallback(err);
      });
  }
  private errorCallback(message) {
    console.log(message);
  }
}
