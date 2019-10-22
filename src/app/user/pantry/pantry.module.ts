import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PantryComponent } from './pantry.component';
import { PantryRoutingModule } from './pantry-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserCartComponent } from './cart/cart.component';
import { UserMenuComponent } from './menu/menu.component';
import { HappyHoursComponent } from './happy-hours/happy-hours.component';
import { HappyHoursListComponent } from './happy-hours/happy-hours-list/happy-hours-list.component';
import { ClickOutsideDirective } from 'src/app/shared/directives/outside-click.directive';
import { UserComponent } from '../user.component';

@NgModule({
  imports: [
    CommonModule,
    PantryRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    UserComponent,
    UserCartComponent,
    UserMenuComponent,
    HappyHoursComponent,
    HappyHoursListComponent,
    PantryComponent
  ],
  providers: []
})
export class PantryModule {}
