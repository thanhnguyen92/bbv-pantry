import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { TranslateModule } from '@ngx-translate/core';

/** Components */
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { RestaurantAdminComponent } from './restaurant.component';

/** Modules */
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { SimpleMaterialModule } from 'app/shared/modules/simple-material.module';

/** Services */
import { RestaurantService } from 'app/shared/services/restaurant.service';

@NgModule({
    imports: [
        TranslateModule,
        FuseSharedModule,
        FormsModule,
        CommonModule,
        SimpleMaterialModule,
        AngularFirestoreModule,

        RestaurantRoutingModule
    ],
    declarations: [RestaurantAdminComponent, RestaurantItemComponent],
    entryComponents: [RestaurantItemComponent],
    providers: [RestaurantService]
})
export class RestaurantAdminModule { }
