import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FileUploadModule } from 'ng2-file-upload';
/** Components */
import { AdminComponent } from './admin.component';
import { SimpleMaterialModule } from '../shared/modules/simple-material.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SimpleMaterialModule,
   
  ],
  declarations: [AdminComponent],
  providers: []
})
export class AdminModule {}
