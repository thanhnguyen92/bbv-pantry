import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';

/** Components */
import { UserAdminComponent } from './user.component';

/** Modules */
import { UserAdminRoutingModule } from './user-routing.module';
import { SimpleMaterialModule } from 'app/shared/modules/simple-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { UserRolesAdminComponent } from './user-roles/user-roles.component';
import { UserItemAdminComponent } from './user-item/user-item.component';

@NgModule({
    declarations: [UserAdminComponent, UserRolesAdminComponent, UserItemAdminComponent],
    entryComponents: [UserRolesAdminComponent, UserItemAdminComponent],
    imports: [
        TranslateModule,
        FuseSharedModule,
        CommonModule,
        FormsModule,
        AngularFirestoreModule,
        SimpleMaterialModule,

        UserAdminRoutingModule
    ],
    providers: []
})
export class UserAdminModule { }
