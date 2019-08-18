import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';

@NgModule({
  declarations: [OrderComponent],
  imports: [
    MaterialModule,
    CommonModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
