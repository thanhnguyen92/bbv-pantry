import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from './booking.component';
import { BookingRoutingModule } from './booking-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';

@NgModule({
  declarations: [BookingComponent],
  imports: [
    MaterialModule,
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
