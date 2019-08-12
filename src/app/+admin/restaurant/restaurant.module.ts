import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantComponent } from './restaurant.component';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { SimpleMaterialModule } from 'src/app/shared/modules/simple-material.module';
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RestaurantRoutingModule,
    SimpleMaterialModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [RestaurantComponent, RestaurantItemComponent],
  entryComponents: [RestaurantItemComponent]
})
export class RestaurantModule {}
