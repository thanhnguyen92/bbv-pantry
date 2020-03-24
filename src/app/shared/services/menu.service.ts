import { Injectable } from '@angular/core';
import { MenuModel } from '../models/menu.model';
import { map } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';

const ENTITY_NAME = 'menu';
@Injectable({
    providedIn: 'root'
})
export class MenuService {
    constructor(private _firestoreService: FirestoreService) { }

    getById(menuId: string) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.get<MenuModel>(menuId).get()
            .pipe(map(entity => {
                const data = entity.data() as MenuModel;
                const id = entity.id;
                return { id, ...data };
            }));
    }

    getByRestaurantId(restaurantId) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.gets<MenuModel>(t => t.where('restaurantId', '==', restaurantId)).snapshotChanges()
            .pipe(map(entities => {
                return entities.map(entity => {
                    const data = entity.payload.doc.data() as MenuModel;
                    const id = entity.payload.doc.id;
                    data['type'] = entity.type;
                    return { id, ...data };
                });
            }));
    }

    add(entity: MenuModel) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.add<MenuModel>(entity);
    }

    update(entity: MenuModel) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.update<MenuModel>(entity, entity.id);
    }

    delete(uid) {
        this._firestoreService.setPath(ENTITY_NAME);
        return this._firestoreService.delete(uid);
    }
}
