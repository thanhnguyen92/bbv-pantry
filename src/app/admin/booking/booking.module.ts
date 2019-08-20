import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from './booking.component';
import { BookingRoutingModule } from './booking-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { BookingItemComponent } from './booking-item/booking-item.component';
import { BookingService } from 'src/app/shared/services/booking.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BookingComponent, BookingItemComponent],
  imports: [FormsModule, MaterialModule, CommonModule, BookingRoutingModule],
  entryComponents: [BookingItemComponent],
  providers: [BookingService]
})
export class BookingModule {}
