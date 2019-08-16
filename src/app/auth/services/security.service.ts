import { UserRole } from './../../shared/enums/user-role.enum';
import { FirebaseService } from './../../shared/services/firebase.service';
import { Injectable } from '@angular/core';
import { Security } from 'src/app/shared/models/security.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

const ENTITY_NAME = 'security';
@Injectable()
export class SecurityService {
    constructor(private firebaseService: FirebaseService) { }

    getRoles(userId) {
        this.firebaseService.setPath(ENTITY_NAME);
        return this.firebaseService.gets<Security>(t => t.where('userId', '==', userId)).snapshotChanges().pipe(map(entities => {
            return entities.map(entity => {
                const data = entity.payload.doc.data() as Security;
                data.uid = entity.payload.doc.id;
                return data;
            });
        }));
    }

    assignRoles(userId, roles: UserRole[]) {
        this.firebaseService.setPath(ENTITY_NAME);
        const entity = {
            userId,
            roles
        } as Security;
        this.firebaseService.add<Security>(entity);
    }
}
