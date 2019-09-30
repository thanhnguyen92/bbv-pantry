import { RouterModule } from '@angular/router';

/** Components */
import { UserManagementComponent } from './user-management.component';

export const UserManagementRoutingModule = RouterModule.forChild([
  { path: '', component: UserManagementComponent }
]);
