import { MaterialModule } from './../shared/modules/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

/** Components */
import { UserComponent } from './user.component';
import { UserCartComponent } from './cart/cart.component';
import { UserMenuComponent } from './menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './profile/user-profile.component';
import { HappyHoursComponent } from './happy-hours/happy-hours.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    UserComponent,
    UserCartComponent,
    UserMenuComponent,
    UserProfileComponent,
    HappyHoursComponent
  ],
  providers: []
})
export class UserModule {}
