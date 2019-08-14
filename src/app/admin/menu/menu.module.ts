import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { SimpleMaterialModule } from 'src/app/shared/modules/simple-material.module';
import { MenuRoutingModule } from './menu-routing.module';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MenuService } from 'src/app/shared/services/menu.service';

@NgModule({
  declarations: [MenuComponent, MenuItemComponent],
  entryComponents: [MenuItemComponent],
  imports: [
    CommonModule,
    SimpleMaterialModule,
    MenuRoutingModule,
    FormsModule,
    CommonModule,
    SimpleMaterialModule,
    AngularFirestoreModule
  ],
  providers: [MenuService]
})
export class MenuModule {}
