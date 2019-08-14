import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

/** Components */
import { AdminComponent } from './admin.component';
import { SimpleMaterialModule } from '../shared/modules/simple-material.module';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [CommonModule, AdminRoutingModule, SimpleMaterialModule],
  declarations: [AdminComponent],
  providers: []
})
export class AdminModule {}
