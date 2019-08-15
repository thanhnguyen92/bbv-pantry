import { FirebaseService } from './../../shared/services/firebase.service';
import { Injectable } from '@angular/core';
import { Security } from 'src/app/shared/models/security.model';
import { AngularFirestore } from '@angular/fire/firestore';

const ENTITY_NAME = 'security';
@Injectable()
export class SecurityService extends FirebaseService<Security> {
    constructor(
        afs: AngularFirestore) {
        super(ENTITY_NAME, afs);
    }
}
