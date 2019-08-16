import { UserRole } from './../../shared/enums/user-role.enum';
import { FirebaseService } from './../../shared/services/firebase.service';
import { Injectable } from '@angular/core';
import { Security } from 'src/app/shared/models/security.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

const ENTITY_NAME = 'security';
@Injectable()
export class SecurityService extends FirebaseService<Security> {
    constructor(
        afs: AngularFirestore) {
        super(ENTITY_NAME, afs);
    }

    getRoles(userId) {
        return this.gets(t => t.where('userId', '==', userId)).get().pipe(map(entities => {
            return entities.docs.map(entity => {
                return entity.data();
            });
        }));
    }

    assignRoles(userId, roles: UserRole[]) {
        const entity = {
            userId,
            roles
        } as Security;
        this.add(entity);
    }
}
