import { RouterModule } from '@angular/router';

/** Components */
import { RestaurantComponent } from './restaurant.component';

export const RestaurantRoutingModule = RouterModule.forChild([
  { path: '', component: RestaurantComponent }
]);
