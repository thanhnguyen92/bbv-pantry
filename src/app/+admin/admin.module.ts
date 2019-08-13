import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

/** Components */
import { AdminComponent } from './admin.component';
import { SimpleMaterialModule } from '../shared/modules/simple-material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from '../shared/interceptors';

@NgModule({
  imports: [CommonModule, AdminRoutingModule, SimpleMaterialModule],
  declarations: [AdminComponent],
  providers: []
})
export class AdminModule {}
