import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

/** Components */
import { AdminComponent } from './admin.component';
import { SimpleMaterialModule } from '../shared/modules/simple-material.module';

@NgModule({
  imports: [CommonModule, AdminRoutingModule, SimpleMaterialModule],
  declarations: [AdminComponent]
})
export class AdminModule {}
