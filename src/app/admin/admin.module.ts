import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { RestaurantAdminComponent } from './restaurant/restaurant.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { MatTableModule, MatPaginatorModule } from '@angular/material';

@NgModule({
    imports: [
        TranslateModule,
        FuseSharedModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,

        AdminRoutingModule,
        NgxDatatableModule
    ],
    declarations: [
        AdminComponent,
        RestaurantAdminComponent,
        RestaurantItemComponent
    ],
    bootstrap: [AdminComponent]
})
export class AdminModule { }
