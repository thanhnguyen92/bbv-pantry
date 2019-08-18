import { RouterModule } from '@angular/router';

/** Components */
import { UserHistoryComponent } from './history.component';

export const UserHistoryRoutingModule = RouterModule.forChild([
  { path: '', component: UserHistoryComponent }
]);
