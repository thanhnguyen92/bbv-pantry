import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderHistoriesAdminComponent } from './order-histories.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SimpleMaterialModule } from 'app/shared/modules/simple-material.module';
import { OrderHistoriesRoutingModule } from './order-histories-routing.module';
import { MatCardModule } from '@angular/material';

@NgModule({
  declarations: [OrderHistoriesAdminComponent],
  imports: [
    TranslateModule,
    FuseSharedModule,
    CommonModule,
    FormsModule,
    AngularFirestoreModule,
    SimpleMaterialModule,
    MatCardModule,

    OrderHistoriesRoutingModule
  ]
})
export class OrderHistoriesModule { }
