import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  QueryFn
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  path: string;

  constructor(private db: AngularFirestore) { }

  public setPath(path) {
    this.path = path;
  }

  public createId(){
    return this.db.createId();
  }

  public get<T>(id: string): AngularFirestoreDocument {
    return this.db.doc<T>(`${this.path}/${id}`);
  }

  public gets<T>(query?: QueryFn): AngularFirestoreCollection<T> {
    return this.db.collection<T>(this.path, query);
  }

  public add<T>(entity: T) {
    const entities = this.db.collection<T>(this.path);
    return entities.add(entity);
  }

  public update<T>(entity: T, uid: string) {
    return this.db.doc(`${this.path}/${uid}`).update(entity);
  }

  public delete(id: string) {
    return this.db.doc(`${this.path}/${id}`).delete();
  }

  private errorCallback(message) {
    console.log(message);
  }
}
