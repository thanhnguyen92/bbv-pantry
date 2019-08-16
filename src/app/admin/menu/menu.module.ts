import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuRoutingModule } from './menu-routing.module';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MenuService } from 'src/app/shared/services/menu.service';
import { RestaurantSelectionComponent } from './restaurant-selection/restaurant-selection.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';

@NgModule({
  declarations: [MenuComponent, MenuItemComponent, RestaurantSelectionComponent],
  entryComponents: [MenuItemComponent, RestaurantSelectionComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
    FormsModule,
    CommonModule,
    AngularFirestoreModule,
    MaterialModule
  ],
  providers: [MenuService]
})
export class MenuModule { }
