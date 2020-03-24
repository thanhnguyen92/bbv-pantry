import { RouterModule } from '@angular/router';

/** Components */
import { RestaurantAdminComponent } from './restaurant.component';

export const RestaurantRoutingModule = RouterModule.forChild([
    { path: '', component: RestaurantAdminComponent }
]);
