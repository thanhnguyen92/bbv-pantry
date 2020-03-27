import { RouterModule } from '@angular/router';

/** Components */
import { OrderHistoriesAdminComponent } from './order-histories.component';

export const OrderHistoriesRoutingModule = RouterModule.forChild([
  { path: '', component: OrderHistoriesAdminComponent }
]);
