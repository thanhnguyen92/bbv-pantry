import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { UserManagementRoutingModule } from './user-management.routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserService } from 'src/app/shared/services/user.service';
import { SecurityService } from 'src/app/auth/services/security.service';
import { UserItemComponent } from './user-item/user-item.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        AngularFirestoreModule,
        UserManagementRoutingModule
    ],
    declarations: [UserManagementComponent, UserItemComponent],
    entryComponents: [UserItemComponent],
    providers: [SecurityService, UserService]
})
export class UserManagementModule { }
