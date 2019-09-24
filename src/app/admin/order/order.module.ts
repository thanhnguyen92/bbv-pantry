import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { UserService } from 'src/app/shared/services/user.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderComponent],
  imports: [FormsModule, MaterialModule, CommonModule, OrderRoutingModule],
  providers: [UserService]
})
export class OrderModule {}
