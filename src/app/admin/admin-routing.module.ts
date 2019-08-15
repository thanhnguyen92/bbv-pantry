import { RouterModule } from '@angular/router';

/** Components */
import { AdminComponent } from './admin.component';
import { AdminGuard } from '../shared/guards/admin.guard';

export const AdminRoutingModule = RouterModule.forChild([
  { path: '', component: AdminComponent, canActivate: [AdminGuard] },
  {
    path: 'restaurant',
    loadChildren: './restaurant/restaurant.module#RestaurantModule'
  },
  { path: 'restaurant/:id/menu', loadChildren: './menu/menu.module#MenuModule' }
]);
