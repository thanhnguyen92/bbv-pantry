import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { TranslateModule } from '@ngx-translate/core';

/** Components */
import { MenuAdminComponent } from './menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { RestaurantSelectionComponent } from './restaurant-selection/restaurant-selection.component';

/** Modules */
import { MenuAdminRoutingModule } from './menu-routing.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SimpleMaterialModule } from 'app/shared/modules/simple-material.module';

/** Services */
import { MenuService } from 'app/shared/services/menu.service';

@NgModule({
    declarations: [MenuAdminComponent, MenuItemComponent, RestaurantSelectionComponent],
    entryComponents: [MenuItemComponent, RestaurantSelectionComponent],
    imports: [
        TranslateModule,
        FuseSharedModule,
        CommonModule,
        FormsModule,
        AngularFirestoreModule,
        SimpleMaterialModule,

        MenuAdminRoutingModule
    ],
    providers: [MenuService]
})
export class MenuAdminModule { }
