import { RouterModule } from '@angular/router';

/** Components */
import { AdminComponent } from './admin.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

export const AdminRoutingModule = RouterModule.forChild([
  { path: '', component: AdminComponent },
  {
    path: 'restaurant',
    loadChildren: './restaurant/restaurant.module#RestaurantModule'
  },
  { path: 'restaurant/:id/menu', loadChildren: './menu/menu.module#MenuModule' }
]);
