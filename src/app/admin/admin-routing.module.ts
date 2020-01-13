import { RestaurantAdminComponent } from './restaurant/restaurant.component';
import { AdminComponent } from './admin.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';

const appRoutes: Routes = [
    { path: '', component: AdminComponent },
    {
        path: 'restaurant', children: [
            { path: '', component: RestaurantAdminComponent },
            { path: ':id', component: RestaurantItemComponent },
            { path: 'create', component: RestaurantItemComponent }
        ]
    }
    // { path: '**', component: PageNotFoundComponent }
];
@NgModule({
    imports: [
        RouterModule.forChild(
            appRoutes
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule { }
