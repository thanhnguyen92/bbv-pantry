import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingAdminComponent } from './booking.component';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingItemAdminComponent } from './booking-item/booking-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import { SimpleMaterialModule } from 'app/shared/modules/simple-material.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatDatepickerModule } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  entryComponents: [BookingItemAdminComponent],
  declarations: [BookingAdminComponent, BookingItemAdminComponent],
  imports: [
    TranslateModule,
    FuseSharedModule,
    CommonModule,
    FormsModule,
    AngularFirestoreModule,
    SimpleMaterialModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    
    BookingRoutingModule
  ]
})
export class BookingModule { }
