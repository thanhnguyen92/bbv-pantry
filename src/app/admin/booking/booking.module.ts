import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BookingService } from './../../shared/services/booking.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from './booking.component';
import { BookingRoutingModule } from './booking-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { BookingItemComponent } from './booking-item/booking-item.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BookingComponent, BookingItemComponent],
  entryComponents: [BookingItemComponent],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    BookingRoutingModule,
    AngularFirestoreModule
  ],
  providers: [BookingService]
})
export class BookingModule { }
