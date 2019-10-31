import { MaterialModule } from './../shared/modules/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

/** Components */
import { UserComponent } from './user.component';
import { UserCartComponent } from './pantry/cart/cart.component';
import { UserMenuComponent } from './pantry/menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './profile/user-profile.component';
import { ClickOutsideDirective } from '../shared/directives/outside-click.directive';
import { PmWebComponent } from './pm-web/pm-web.component';
import { ProjectPlannerComponent } from './project-planner/project-planner.component';
import { HappyHoursComponent } from './pantry/happy-hours/happy-hours.component';
import { HappyHoursListComponent } from './pantry/happy-hours/happy-hours-list/happy-hours-list.component';
import { WikiComponent } from './wiki/wiki.component';
import { PluginsComponent } from './plugins/plugins.component';
import { PluginComponent } from '../shared/components/plugin/plugin.component';
import { PluginItemComponent } from './plugins/plugin-item/plugin-item.component';
import { OrderNotesComponent } from './order-notes/order-notes.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    UserProfileComponent,
    ClickOutsideDirective,
    PmWebComponent,
    ProjectPlannerComponent,
    WikiComponent,
    PluginsComponent,
    PluginComponent,
    OrderNotesComponent
  ],
  providers: []
})
export class UserModule {}
