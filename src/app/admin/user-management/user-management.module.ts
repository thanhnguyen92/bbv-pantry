import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { UserManagementRoutingModule } from './user-management.routing.module';
import { UserManagementComponent } from './user-management.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        AngularFirestoreModule,
        UserManagementRoutingModule
    ],
    declarations: [UserManagementComponent],
    entryComponents: [],
    providers: [RestaurantService, OrderService]
})
export class UserManagementModule { }
