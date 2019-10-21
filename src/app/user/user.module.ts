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
import { HappyHoursListComponent } from './happy-hours/happy-hours-list/happy-hours-list.component';
import { ClickOutsideDirective } from '../shared/directives/outside-click.directive';
import { PmWebComponent } from './pm-web/pm-web.component';
import { ProjectPlannerComponent } from './project-planner/project-planner.component';

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
    HappyHoursComponent,
    HappyHoursListComponent,
    ClickOutsideDirective,
    PmWebComponent,
    ProjectPlannerComponent
  ],
  providers: []
})
export class UserModule {}
