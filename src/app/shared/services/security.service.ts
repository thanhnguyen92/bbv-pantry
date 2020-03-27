import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { UserRole } from '../enums/user-roles.enum';
import { SecurityModel } from '../models/security.model';

const ENTITY_NAME = 'security';
@Injectable({
    providedIn: 'root'
})
export class SecurityService {
    constructor(private _firestoreService: FirestoreService) { }

    getRolesByUserIds(userIds: string[]) {
        if (userIds && userIds.length > 0) {
            this._firestoreService.setPath(ENTITY_NAME);
            return this._firestoreService.gets<SecurityModel>()
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

    getRolesByUserId(userId, onchanges = false) {
        this._firestoreService.setPath(ENTITY_NAME);
        if (onchanges) {
            return this._firestoreService.gets<SecurityModel>(t => t.where('userId', '==', userId))
                .snapshotChanges().pipe(map(entities => {
                    if (entities.length === 1) {
                        const data = entities[0].payload.doc.data() as SecurityModel;
                        const id = entities[0].payload.doc.id;
                        return { id, ...data };
                    }
                }));
        }

        return this._firestoreService.gets<SecurityModel>(t => t.where('userId', '==', userId))
            .get()
            .pipe(map(entities => {
                if (entities.docs.length === 1) {
                    const data = entities.docs[0].data() as SecurityModel;
                    const id = entities.docs[0].id;
                    return { id, ...data };
                }
            }));
    }

    async assignRoles(userId, roles: UserRole[]) {
        this._firestoreService.setPath(ENTITY_NAME);
        const entity = {
            userId,
            roles
        } as SecurityModel;
        await this._firestoreService.add<SecurityModel>(entity);
    }

    async updateRoles(userId, roles: UserRole[]) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.gets<SecurityModel>(t => t.where('userId', '==', userId)).get()
            .pipe(map(entity => {
                if (entity && entity.docs.length > 0) {
                    const data = entity.docs[0].data() as SecurityModel;
                    return data;
                }
            })).subscribe(security => {
                if (security) {
                    security.roles = roles;
                    return this._firestoreService.update<SecurityModel>(security, security.id);
                } else {
                    this.assignRoles(userId, roles).then();
                }
            });
    }
}
