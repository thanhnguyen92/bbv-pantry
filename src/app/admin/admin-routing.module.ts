import { RouterModule } from '@angular/router';

/** Components */
import { AdminComponent } from './admin.component';

export const AdminRoutingModule = RouterModule.forChild([
  { path: '', component: AdminComponent },
  { path: 'restaurant', loadChildren: './restaurant/restaurant.module#RestaurantModule' }
]);
