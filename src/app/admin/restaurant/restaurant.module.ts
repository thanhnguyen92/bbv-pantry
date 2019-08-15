import { NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantComponent } from './restaurant.component';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { SimpleMaterialModule } from 'src/app/shared/modules/simple-material.module';
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';
import {
  AngularFirestore,
  AngularFirestoreModule
} from '@angular/fire/firestore';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { OrderService } from 'src/app/shared/services/order.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RestaurantRoutingModule,
    SimpleMaterialModule,
    AngularFirestoreModule
  ],
  declarations: [RestaurantComponent, RestaurantItemComponent],
  entryComponents: [RestaurantItemComponent],
  providers: [RestaurantService, OrderService]
})
export class RestaurantModule {}
