import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantComponent } from './restaurant.component';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { SimpleMaterialModule } from 'src/app/shared/modules/simple-material.module';

@NgModule({
  imports: [CommonModule, RestaurantRoutingModule, SimpleMaterialModule],
  declarations: [RestaurantComponent]
})
export class RestaurantModule {}
