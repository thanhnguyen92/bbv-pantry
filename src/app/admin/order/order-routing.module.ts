import { RouterModule } from '@angular/router';

/** Components */
import { OrderComponent } from './order.component';

export const OrderRoutingModule = RouterModule.forChild([
  { path: '', component: OrderComponent }
]);
