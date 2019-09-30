import { UserRole } from './../../shared/enums/user-role.enum';
import { FirebaseService } from './../../shared/services/firebase.service';
import { Injectable } from '@angular/core';
import { SecurityModel } from 'src/app/shared/models/security.model';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

const ENTITY_NAME = 'security';
@Injectable()
export class SecurityService {
    constructor(private firebaseService: FirebaseService) { }

    getRolesByUserIds(userIds: string[]) {
        if (userIds && userIds.length > 0) {
            this.firebaseService.setPath(ENTITY_NAME);
            return this.firebaseService.gets<SecurityModel>()
                .snapshotChanges().pipe(map(entities => {
                    return entities.filter(entity => {
                        const data = entity.payload.doc.data();
                        if (userIds.find(userId => userId === data.userId)) {
                            return entity;
                        }
                    }).map(entity => {
                        const data = entity.payload.doc.data() as SecurityModel;
                        const id = entity.payload.doc.id;
                        return { id, ...data };
                    });
                }));
        } else {
            return of([] as SecurityModel[]);
        }
    }

    getRolesByUserId(userId) {
        this.firebaseService.setPath(ENTITY_NAME);
        return this.firebaseService.gets<SecurityModel>(t => t.where('userId', '==', userId)).snapshotChanges().pipe(map(entities => {
            return entities.map(entity => {
                const data = entity.payload.doc.data() as SecurityModel;
                const id = entity.payload.doc.id;
                return { id, ...data };
            });
        }));
    }

    async assignRoles(userId, roles: UserRole[]) {
        this.firebaseService.setPath(ENTITY_NAME);
        const entity = {
            userId,
            roles
        } as SecurityModel;
        await this.firebaseService.add<SecurityModel>(entity);
    }

    async updateRoles(userId, roles: UserRole[]) {
        this.firebaseService.setPath(ENTITY_NAME);
        return this.firebaseService.gets<SecurityModel>(t => t.where('userId', '==', userId)).get()
            .pipe(map(entity => {
                if (entity && entity.docs.length > 0) {
                    const data = entity.docs[0].data() as SecurityModel;
                    return data;
                }
            })).subscribe(security => {
                if (security) {
                    security.roles = roles;
                    return this.firebaseService.update<SecurityModel>(security, security.id);
                }
            });
    }
}
