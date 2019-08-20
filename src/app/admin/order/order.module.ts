import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { OrderService } from 'src/app/shared/services/order.service';
import { SimpleMaterialModule } from 'src/app/shared/modules/simple-material.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderComponent],
  imports: [
    FormsModule,
    MaterialModule,
    CommonModule,
    OrderRoutingModule,
    AngularFirestoreModule,
    SimpleMaterialModule
  ],
  // entryComponents: [RestaurantItemComponent],
  providers: [OrderService]
})
export class OrderModule {}
