import { AdminComponent } from './admin.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Error404Component } from 'app/errors/error-404/error-404.component';

const appRoutes: Routes = [
    { path: '', component: AdminComponent },
    { path: 'restaurants', loadChildren: './restaurant/restaurant.module#RestaurantAdminModule' },
    { path: 'menus', loadChildren: './menu/menu.module#MenuAdminModule' },
    { path: 'menus/restaurant/:id', loadChildren: './menu/menu.module#MenuAdminModule' },
    { path: 'bookings', loadChildren: './booking/booking.module#BookingModule' },
    { path: 'order-histories', loadChildren: './order-histories/order-histories.module#OrderHistoriesModule' },
    { path: 'users', loadChildren: './user/user.module#UserAdminModule' }
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
