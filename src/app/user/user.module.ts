import { MaterialModule } from './../shared/modules/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

/** Components */
import { UserComponent } from './user.component';
import { UserCartComponent } from './cart/cart.component';
import { UserMenuComponent } from './menu/menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, UserRoutingModule, MaterialModule, FormsModule],
  declarations: [UserComponent, UserCartComponent, UserMenuComponent],
  providers: []
})
export class UserModule {}
