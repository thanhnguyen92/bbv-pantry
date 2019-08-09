import { RouterModule } from '@angular/router';

/** Components */
import { UserComponent } from './user.component';

export const UserRoutingModule = RouterModule.forChild([
  { path: '', component: UserComponent }
]);
