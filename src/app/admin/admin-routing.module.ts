import { RestaurantAdminComponent } from './restaurant/restaurant.component';
import { AdminComponent } from './admin.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { Error404Component } from 'app/errors/error-404/error-404.component';

const appRoutes: Routes = [
    { path: '', component: AdminComponent },
    {
        path: 'restaurant', component: RestaurantAdminComponent
    },
    // { path: '**', component: Error404Component }
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
